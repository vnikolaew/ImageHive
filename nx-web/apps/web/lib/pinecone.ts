import { Pinecone } from '@pinecone-database/pinecone';

export const client = new Pinecone({
   apiKey: '6b26a7dd-a831-48ad-b68d-a983563d9fd9'
});

export const tagsIndex = client.index('tags');
