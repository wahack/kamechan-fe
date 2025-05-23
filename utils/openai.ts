import { createOpenAI } from "@ai-sdk/openai";
// import 'dotenv/config'
export const openai = createOpenAI({
  baseURL: process.env.OPENAI_API_URL,
  apiKey: process.env.OPENAI_API_KEY,
});
