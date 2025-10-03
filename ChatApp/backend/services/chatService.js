import { v4 as uuidv4 } from 'uuid';
import { GroqService } from './groqService.js';
import { WebSearchService } from './webSearchService.js';
import { logger } from '../utils/logger.js';

export class ChatService {
    constructor() {
        this.groqService = new GroqService();
        this.webSearchService = new WebSearchService();
        this.conversations = new Map(); // In-memory storage for conversations
        this.SYSTEM_MESSAGE = {
            role: 'system',
            content: 'You are a helpful assistant. When you need to search for current information or recent events, use the webSearch function. Always use the proper function calling format.'
        };
    }

    async processMessage(message, sessionId = null) {
        try {
            // Create or get conversation
            if (!sessionId) {
                sessionId = uuidv4();
            }

            let conversation = this.conversations.get(sessionId);
            if (!conversation) {
                conversation = {
                    id: sessionId,
                    messages: [this.SYSTEM_MESSAGE],
                    createdAt: new Date(),
                    updatedAt: new Date()
                };
                this.conversations.set(sessionId, conversation);
            }

            // Add user message
            conversation.messages.push({
                role: 'user',
                content: message,
                timestamp: new Date().toISOString()
            });

            logger.info('Processing message', { 
                sessionId, 
                messageLength: message.length,
                conversationLength: conversation.messages.length 
            });

            // Get LLM response with tools
            const response = await this.groqService.createChatCompletion(
                conversation.messages,
                [this.webSearchService.getToolDefinition()]
            );

            const choice = response.choices[0];
            let finalMessage = choice.message.content;

            // Handle tool calls if present
            if (choice.message.tool_calls && choice.message.tool_calls.length > 0) {
                logger.info('Processing tool calls', { 
                    sessionId,
                    toolCallsCount: choice.message.tool_calls.length 
                });

                // Add assistant message with tool calls
                conversation.messages.push({
                    role: 'assistant',
                    content: choice.message.content,
                    tool_calls: choice.message.tool_calls
                });

                // Execute tool calls
                for (const toolCall of choice.message.tool_calls) {
                    const toolResult = await this.executeToolCall(toolCall);
                    conversation.messages.push(toolResult);
                }

                // Get final response without tools to avoid loops
                const followupResponse = await this.groqService.createChatCompletion(
                    conversation.messages,
                    [] // No tools for follow-up to prevent infinite loops
                );

                finalMessage = followupResponse.choices[0].message.content;
            }

            // Add final assistant message
            const assistantMessage = {
                role: 'assistant',
                content: finalMessage,
                timestamp: new Date().toISOString()
            };

            conversation.messages.push(assistantMessage);
            conversation.updatedAt = new Date();

            logger.info('Message processed successfully', { 
                sessionId,
                responseLength: finalMessage.length 
            });

            return {
                message: finalMessage,
                sessionId: sessionId,
                timestamp: assistantMessage.timestamp
            };

        } catch (error) {
            logger.error('Error processing message:', error);
            throw new Error('Failed to process message: ' + error.message);
        }
    }

    async executeToolCall(toolCall) {
        try {
            const { name, arguments: args } = toolCall.function;
            const parsedArgs = JSON.parse(args);

            let result;
            switch (name) {
                case 'webSearch':
                    result = await this.webSearchService.search(
                        parsedArgs.query,
                        parsedArgs.num_results || 3
                    );
                    break;
                default:
                    throw new Error(`Unknown tool: ${name}`);
            }

            return {
                role: 'tool',
                tool_call_id: toolCall.id,
                content: result
            };

        } catch (error) {
            logger.error('Error executing tool call:', error);
            return {
                role: 'tool',
                tool_call_id: toolCall.id,
                content: `Error executing tool: ${error.message}`
            };
        }
    }

    getConversation(sessionId) {
        return this.conversations.get(sessionId);
    }

    deleteConversation(sessionId) {
        return this.conversations.delete(sessionId);
    }

    getAllConversations() {
        return Array.from(this.conversations.values());
    }

    // Clean up old conversations (run periodically)
    cleanupOldConversations(maxAge = 24 * 60 * 60 * 1000) { // 24 hours
        const now = new Date();
        let cleaned = 0;

        for (const [sessionId, conversation] of this.conversations) {
            if (now - conversation.updatedAt > maxAge) {
                this.conversations.delete(sessionId);
                cleaned++;
            }
        }

        if (cleaned > 0) {
            logger.info(`Cleaned up ${cleaned} old conversations`);
        }

        return cleaned;
    }
}