const {GoogleGenAI }= require("@google/genai")

const ai = new GoogleGenAI({
   apiKey: process.env.GEMINI_API_KEY
});

async function generateResponse(content){

  /* console.log("CONTENT RECEIVED:", content); */

  const response = await ai.models.generateContent({
    model:"gemini-2.5-flash",
    contents:content
  })

   /* console.log(response); */

  return response.text;
}
module.exports={
  generateResponse
}