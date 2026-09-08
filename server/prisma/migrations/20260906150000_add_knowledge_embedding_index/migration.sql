CREATE INDEX "KnowledgeChunk_embedding_idx"
ON "KnowledgeChunk"
USING hnsw ("embedding" vector_cosine_ops);
