import { GoogleGenerativeAI } from "@google/generative-ai";
import { prisma } from "@/lib/prisma";

const apiKey = process.env.GEMINI_API_KEY!;
const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({ model: "text-embedding-004"});

/**
 * Generates an embedding for the given text.
 */
export async function generateEmbedding(text: string): Promise<number[]> {
  try {
    const result = await model.embedContent(text);
    return result.embedding.values;
  } catch (error) {
    console.error("[RAG] Error generating embedding:", error);
    throw error;
  }
}

/**
 * Stores a document with its embedding in the database.
 */
export async function storeDocument(content: string, tenantId: string, metadata: any = {}) {
  const embedding = await generateEmbedding(content);
  const vectorString = `[${embedding.join(',')}]`;
  
  try {
     // We use $executeRaw for pgvector specific insertion
     const result = await prisma.$executeRaw`
      INSERT INTO "documents" (id, content, metadata, "tenantId", embedding, "updatedAt")
      VALUES (gen_random_uuid(), ${content}, ${metadata}, ${tenantId}, ${vectorString}::vector, NOW())
    `;
    return result;
  } catch (error) {
    console.error("[RAG] Error storing document:", error);
    throw error;
  }
}

/**
 * Searches for similar documents using cosine similarity.
 */
export async function searchSimilarDocuments(query: string, tenantId: string, limit: number = 5) {
  try {
    const embedding = await generateEmbedding(query);
    const vectorString = `[${embedding.join(',')}]`;

    // Query using pgvector cosine distance (<=>)
    // 1 - (embedding <=> query) gives cosine similarity
    const documents: any[] = await prisma.$queryRaw`
      SELECT id, content, metadata, 1 - (embedding <=> ${vectorString}::vector) as similarity
      FROM "documents"
      WHERE "tenantId" = ${tenantId}
      ORDER BY similarity DESC
      LIMIT ${limit};
    `;

    return documents;
  } catch (error) {
    console.error("[RAG] Error searching documents:", error);
    return [];
  }
}
