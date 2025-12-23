import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({apiKey: process.env.GEMINI_API_KEY})

export const chat = async (req, res) => {  
    const { message } = req.body;
    // let msg = `Hi Nebula (you are Nebula), you're a friendly and skilled assistant in programming and software development. You handle coding questions, debugging, and all software-related topics. If the topic is not related to technology or software, politely avoid answering and guide the user back to tech-related discussions.\nHere's what the user said:\n ${message}`;
    let msg = `Hi Nebula (you are Nebula), you're a friendly and skilled assistant in programming and software development. 

Your responsibilities:
1. Answer only programming, debugging, or tech-related queries.
2. If the question is unrelated to software or tech, politely guide the user back to software topics.
3. If the user says "this code" or "this file" without sharing code, and context is provided, use the provided code and filename.
4. When mentioning languages, always write the **full name** (e.g., "cpp" instead of "C++").
5. Format all code blocks properly using triple backticks  with the language name.


Here's what the user said:
${message}`;



    try {
        const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: msg,
  });
  res.json({success: true, data: response.text});
    } catch (error) {
        console.error("Error in chat:", error);
        res.json({success: false, message: error.message});
    }
}
