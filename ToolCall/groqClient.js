import Groq from 'groq-sdk';
import { config } from './config.js';

export const groq = new Groq({
    apiKey: config.GROQ_API_KEY,
});

export async function createChatCompletion(messages, tools = []) {
    return groq.chat.completions.create({
        model: 'llama-3.3-70b-versatile',
        messages,
        temperature: 0.7,
        top_p: 0.9,
        stop: ['\nUser:', '\nAssistant:'],
        max_completion_tokens: 150,
        tools,
    });
}
