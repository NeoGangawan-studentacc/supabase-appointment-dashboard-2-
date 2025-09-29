
import { GoogleGenAI, Type } from "@google/genai";
import { Appointment } from '../types';

export const generateFactsFromData = async (appointments: Appointment[]): Promise<string[]> => {
  // Hosting providers like Vercel require a prefix for environment variables to be exposed to the browser.
  const apiKey = process.env.PUBLIC_API_KEY;

  if (!apiKey) {
    return [
        "API_KEY_MISSING", // Special identifier for this error
        "The Gemini API key needs to be configured for your hosting provider.",
        "Hosting platforms require a special prefix for security.",
        "In your Vercel project settings, please rename your environment variable from 'API_KEY' to 'PUBLIC_API_KEY'.",
        "You must redeploy your project after making this change."
    ];
  }
  
  try {
    const ai = new GoogleGenAI({ apiKey: apiKey });

    const prompt = `
      Analyze the following JSON data which represents a list of appointments. 
      Based on this data, provide 5 interesting and concise facts.
      Focus on distributions, common patterns, or any notable insights.
      
      Data:
      ${JSON.stringify(appointments.slice(0, 200), null, 2)}
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            facts: {
              type: Type.ARRAY,
              description: "An array of 5 interesting and concise facts derived from the appointment data.",
              items: {
                type: Type.STRING
              }
            }
          }
        },
      }
    });

    const jsonText = response.text.trim();
    const result = JSON.parse(jsonText);

    if (result && Array.isArray(result.facts) && result.facts.length > 0) {
      return result.facts;
    } else {
      throw new Error("Invalid or empty response format from Gemini API.");
    }
  } catch (error) {
    console.error("Error generating facts from Gemini:", error);
    return [
      "Could not generate facts due to an API error.",
      "The data might be too complex for a quick analysis.",
      "The connection to the AI service may have failed.",
      "Retrying might resolve the issue.",
      "Please check the console for more details."
    ];
  }
};
