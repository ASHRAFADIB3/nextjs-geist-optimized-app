import { GoogleGenerativeAI } from '@google/generative-ai';

const API_KEY = 'AIzaSyC2PQYQDxZjYK_1vp-7PQaEKtcINF7VUkc';
const genAI = new GoogleGenerativeAI(API_KEY);

export async function callGeminiAPI(prompt: string, mode: "generate" | "fix"): Promise<string> {
    try {
        const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

        // Prepare the prompt based on the mode
        const finalPrompt = mode === 'generate' 
            ? `Generate code for the following request: ${prompt}`
            : `Fix the following code and explain the changes: ${prompt}`;

        // Generate content
        const result = await model.generateContent(finalPrompt);
        const response = await result.response;
        const text = response.text();

        return text;
    } catch (error) {
        console.error('Error calling Gemini API:', error);
        throw new Error(`Failed to ${mode} code: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
}

// Helper function to validate API responses
function validateResponse(text: string): string {
    if (!text || typeof text !== 'string') {
        throw new Error('Invalid response from Gemini API');
    }
    return text;
}
