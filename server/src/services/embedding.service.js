const EMBEDDING_API_URL =
  "https://openrouter.ai/api/v1/embeddings";

const generateEmbeddings = async (texts) => {
  if (!Array.isArray(texts) || texts.length === 0) {
    throw new Error(
      "At least one text is required for embedding"
    );
  }

  if (!process.env.OPENROUTER_API_KEY) {
    throw new Error(
      "OPENROUTER_API_KEY is not configured"
    );
  }

  if (!process.env.OPENROUTER_EMBEDDING_MODEL) {
    throw new Error(
      "OPENROUTER_EMBEDDING_MODEL is not configured"
    );
  }

  const response = await fetch(
    EMBEDDING_API_URL,
    {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
      },

      body: JSON.stringify({
        model:
          process.env.OPENROUTER_EMBEDDING_MODEL,

        input: texts,

        dimensions: 1536,
      }),
    }
  );

  if (!response.ok) {
    const errorText =
      await response.text();

    throw new Error(
      `Embedding API request failed: ${response.status} ${errorText}`
    );
  }

  const result =
    await response.json();

  if (
    !result.data ||
    !Array.isArray(result.data)
  ) {
    throw new Error(
      "Invalid embedding API response"
    );
  }

  return result.data
    .sort((a, b) => a.index - b.index)
    .map((item) => item.embedding);
};

module.exports = {
  generateEmbeddings,
};