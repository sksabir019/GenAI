import Groq from 'groq-sdk';
import { config } from '../config/config.js';
import { logger } from '../utils/logger.js';

export class GroqService {
    constructor() {
        this.groq = new Groq({
            apiKey: config.GROQ_API_KEY,
        });
    }

    async createChatCompletion(messages, tools = []) {
        try {
            // Clean messages by removing custom properties (like timestamp)
            const cleanMessages = messages.map(msg => {
                const { timestamp, ...cleanMsg } = msg;
                return cleanMsg;
            });

            const requestData = {
                model: 'llama-3.3-70b-versatile',
                messages: cleanMessages,
                temperature: config.TEMPERATURE,
                top_p: config.TOP_P,
                stop: ['\nUser:', '\nAssistant:'],
                max_completion_tokens: config.MAX_COMPLETION_TOKENS,
            };

            // Only add tools if provided
            if (tools && tools.length > 0) {
                requestData.tools = tools;
                requestData.tool_choice = 'auto'; // Let the model decide when to use tools
            }

            logger.debug('Groq API request', {
                messageCount: messages.length,
                toolCount: tools.length,
                model: requestData.model
            });

            const response = await this.groq.chat.completions.create(requestData);

            logger.debug('Groq API response received', {
                usage: response.usage,
                choicesCount: response.choices?.length,
                hasToolCalls: !!(response.choices[0]?.message?.tool_calls?.length),
                messageContent: response.choices[0]?.message?.content?.substring(0, 100),
                fullMessage: response.choices[0]?.message // Log full message to debug
            });

            return response;

        } catch (error) {
            logger.error('Groq API error:', {
                message: error.message,
                status: error.status,
                code: error.code
            });
            
            // Handle specific Groq API errors
            if (error.status === 401) {
                throw new Error('Invalid Groq API key');
            } else if (error.status === 429) {
                throw new Error('Rate limit exceeded. Please try again later.');
            } else if (error.status >= 500) {
                throw new Error('Groq API service unavailable. Please try again later.');
            }
            
            throw error;
        }
    }

    async validateConnection() {
        try {
            await this.createChatCompletion([
                { role: 'user', content: 'Hello' }
            ]);
            return true;
        } catch (error) {
            logger.error('Groq connection validation failed:', error);
            return false;
        }
    }
}