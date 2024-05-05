"use server";

import { NextRequest, NextResponse } from "next/server";
import { PrismaVectorStore } from "@langchain/community/vectorstores/prisma";
import { Prisma, Tag } from "@prisma/client";
import { xprisma } from "@nx-web/db";
import { HuggingFaceInferenceEmbeddings } from "@langchain/community/embeddings/hf";

const embeddings = new HuggingFaceInferenceEmbeddings({
   model: `Snowflake/snowflake-arctic-embed-s`,
   apiKey: `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`,
});

const vectorStore = PrismaVectorStore
   .withModel<Tag>(xprisma)
   .create(embeddings,
      {
         prisma: Prisma,
         tableName: `Tag`,
         vectorColumnName: `embedding`,
         columns: {
            name: PrismaVectorStore.ContentColumn,
            id: PrismaVectorStore.IdColumn,
         },
      },
   );

export async function similaritySearch(tag: string, top_k= 10) {
   const result = await vectorStore
      .similaritySearchWithScore(tag, top_k);
   return result;
}

export async function GET(req: NextRequest, res: NextResponse) {
   const { tag } = await req.json();
   const result = await vectorStore
      .similaritySearchWithScore(tag, 10);

   return NextResponse.json({ result });
}
