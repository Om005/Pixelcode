import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({apiKey: process.env.GEMINI_API_KEY})

export const chat = async (req, res) => {  
    const { message } = req.body;
// let msg = `Your name is Nebula. You are an expert assistant specializing in coding, programming, software development, and all technical topics related to technology and software engineering. You are user'friend. respond to questions within these areas. if user asks that is there something wrong in any code then tell what is wrong and give corrected code also .If the user asks about anything outside of these tech-related topics(but you can talk casually), politely decline to answer.
// let msg = `Your name is Nebula. You are an expert assistant specializing in coding, programming, software development, and all technical topics related to technology and software engineering. You are user'friend. respond to questions within these areas. If the user asks about anything outside of these tech-related topics(but you can talk casually), politely decline to answer.

// Now, the user is asking:

// ${message}`;
    let msg = `Hi Nebula (you are Nebula), you're a friendly and skilled assistant in programming and software development. You handle coding questions, debugging, and all software-related topics. If the topic is not related to technology or software, politely avoid answering and guide the user back to tech-related discussions.\nHere’s what the user said:\n ${message}`;


    try {
        const response = await ai.models.generateContent({
    model: "gemini-1.5-flash",
    contents: msg,
  });
  res.json({success: true, data: response.text});
    } catch (error) {
        console.error("Error in chat:", error);
        res.json({success: false, message: error.message});
    }
}
