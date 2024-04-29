import itertools

from pgvector.psycopg import register_vector_async
import psycopg
from sentence_transformers import CrossEncoder, SentenceTransformer

sentences = [
    'The dog is barking',
    'The cat is purring',
    'The bear is growling'
]
query = 'growling bear'


def create_schema(conn):
    conn.execute('CREATE EXTENSION IF NOT EXISTS pgvector')
    register_vector_async(conn)

    conn.execute('DROP TABLE IF EXISTS documents')
    conn.execute('CREATE TABLE documents (id bigserial PRIMARY KEY, content text, embedding vector(384))')
    conn.execute("CREATE INDEX ON documents USING GIN (to_tsvector('english', content))")


def insert_data(conn):
    model = SentenceTransformer('multi-qa-MiniLM-L6-cos-v1')
    embeddings = model.encode(sentences)

    sql = 'INSERT INTO documents (content, embedding) VALUES ' + ', '.join(['(%s, %s)' for _ in embeddings])
    params = list(itertools.chain(*zip(sentences, [x.tolist() for x in embeddings])))
    conn.execute(sql, params)


def semantic_search(conn, query) -> list[tuple[int, str]]:
    model = SentenceTransformer('multi-qa-MiniLM-L6-cos-v1')
    embedding = model.encode(query)

    with conn.cursor() as cur:
        param = f"[{str.join(',', [str(x) for x in embedding.tolist()])}]"
        cur.execute("SELECT id, content FROM documents ORDER BY embedding <=> %s LIMIT 5",
                    (param,))
        return cur.fetchall()


def keyword_search(conn, query: str) -> list[tuple[int, str]]:
    with conn.cursor() as cur:
        cur.execute(
            "SELECT id, content FROM documents, plainto_tsquery('english', %s) query WHERE to_tsvector('english', content) @@ query ORDER BY ts_rank_cd(to_tsvector('english', content), query) DESC LIMIT 5",
            (query,))
        return cur.fetchall()


def rerank(query: str, results: list[tuple[int, str]]):
    # deduplicate
    results = set(x[1] for x in results)

    # re-rank
    encoder = CrossEncoder('cross-encoder/ms-marco-MiniLM-L-6-v2')
    scores = encoder.predict([(query, item) for item in results])
    return [v for _, v in sorted(zip(scores, results), reverse=True)]


def main():
    with psycopg.Connection.connect(
            conninfo='postgresql://postgres:postgres@localhost:5432/postgres',
            dbname='postgres', autocommit=True) as conn:
        create_schema(conn)
        insert_data(conn)

        # perform queries in parallel
        ss = semantic_search(conn, query)
        ks = keyword_search(conn, query)

        results = rerank(query, ss + ks)
        print(results)


if __name__ == '__main__':
    main()
