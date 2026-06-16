const {GoogleGenAI }= require("@google/genai")

const ai = new GoogleGenAI({
   apiKey: process.env.GEMINI_API_KEY
});

const SYSTEM_INSTRUCTION = `You are EchoMind, a concise and helpful AI assistant.
Rules you must always follow:
- Keep answers short and to the point by default. 2-4 sentences is ideal for simple questions.
- Use bullet points or numbered lists only when it genuinely helps clarity.
- Never pad answers with unnecessary intros, summaries, or filler phrases like "Certainly!" or "Great question!".
- Only give a long, detailed, in-depth answer if the user explicitly asks for it (e.g. "explain in detail", "give me a deep dive", "elaborate", "long answer").
- Match the user's tone: casual for casual questions, technical for technical ones.`

async function generateResponse(content){

  const response = await ai.models.generateContent({
    model:"gemini-2.5-flash",
    contents:content,
    config:{
      temperature:0.9,
      systemInstruction: SYSTEM_INSTRUCTION,
    }

  })

   /* console.log(response); */

  return response.text;
}

async function generateVector(content) {
  const response = await ai.models.embedContent({
    model: "gemini-embedding-001",
    contents: content,
    config:{
      outputDimensionality: 768
    }
  })

  
  return response.embeddings[0].values
}

module.exports={
  generateResponse, generateVector
}