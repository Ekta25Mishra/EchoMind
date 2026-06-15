// Import the Pinecone library
const { Pinecone } = require("@pinecone-database/pinecone");

// Initialize a Pinecone client with your API key
const pc = new Pinecone({ apiKey: process.env.PINECONE_API_KEY });

const echomindIndex = pc.Index("echomind-chatgpt");

async function createMemory({ vectors, metadata, messageId }) {
  const records = [
    {
      id: messageId,
      values: vectors,
      metadata: metadata || {},
    },
  ];
  console.log("Records:", records.length);

  await echomindIndex.upsert({
    records,
  });
}

async function queryMemory({ queryVector, limit = 5, metadata }) {
  const data = await echomindIndex.query({
    vector: queryVector,
    topK: limit,
    filter: metadata ?  metadata  : undefined,
    includeMetadata: true,
  });
  return data.matches;
}

module.exports = { createMemory, queryMemory };
