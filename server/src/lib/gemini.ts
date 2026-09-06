import { GoogleGenerativeAI } from '@google/generative-ai';

const apiKey = process.env.GEMINI_API_KEY;
let genAI: GoogleGenerativeAI | null = null;
if (apiKey) {
  genAI = new GoogleGenerativeAI(apiKey);
}

export async function suggestNote(jobTitle: string, jobLocation: string, jobDescription: string, friendName: string): Promise<string> {
  if (!genAI) {
    return `I recommend ${friendName} for this position. They would be a great fit based on their skills and experience.`;
  }
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const prompt = `Write a warm, professional referral note for ${friendName} for the ${jobTitle} position. The job is located in ${jobLocation}. Job description: ${jobDescription}. Keep it to 2-3 sentences.`;
    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (error) {
    console.error("Gemini AI error:", error);
    return `I recommend ${friendName} for this position. They would be a great fit based on their skills and experience.`;
  }
}

export async function generateFitSummary(jobTitle: string, jobDescription: string, friendName: string, friendEmail: string): Promise<string> {
  if (!genAI) {
    return `${friendName} appears to be a promising candidate for the ${jobTitle} position.`;
  }
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const prompt = `In 1-2 sentences, analyze how ${friendName} (referred via email ${friendEmail}) might be a fit for the ${jobTitle} position. Job description: ${jobDescription}. Start the summary with '${friendName}'s...'`;
    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (error) {
    console.error("Gemini AI error:", error);
    return `${friendName} appears to be a promising candidate for the ${jobTitle} position.`;
  }
}

