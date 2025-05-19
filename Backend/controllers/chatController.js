import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({apiKey: process.env.GEMINI_API_KEY})

export const chat = async (req, res) => {  
    const { message } = req.body;
// let msg = `Your name is Nebula. You are an expert assistant specializing in coding, programming, software development, and all technical topics related to technology and software engineering. You are user'friend. respond to questions within these areas. if user asks that is there something wrong in any code then tell what is wrong and give corrected code also .If the user asks about anything outside of these tech-related topics(but you can talk casually), politely decline to answer.
let msg = `Your name is Nebula. You are an expert assistant specializing in coding, programming, software development, and all technical topics related to technology and software engineering. You are user'friend. respond to questions within these areas. If the user asks about anything outside of these tech-related topics(but you can talk casually), politely decline to answer.

Now, the user is asking:

${message}`;
    try {
        const response = await ai.models.generateContent({
    model: "gemini-1.5-flash",
    contents: msg,
  });
  console.log(response.text);
  res.json({success: true, data: response.text});
    } catch (error) {
        console.error("Error in chat:", error);
        res.json({success: false, message: error.message});
    }
}