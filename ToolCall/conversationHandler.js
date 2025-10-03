import { createChatCompletion } from './groqClient.js';
import { printAssistantReply } from './cli.js';
import { TOOLS, DEBUG_CONFIG } from './toolConfig.js';
import { ToolHandler } from './toolHandler.js';

export class ConversationHandler {
    constructor() {
        this.toolHandler = new ToolHandler();
    }

    async handleLLMResponse(response, messages, rl) {
        const choice = response.choices[0];
        const reply = choice.message.content;

        if (DEBUG_CONFIG.logLLMResponse) {
            console.log('🤖 LLM Response:', {
                content: reply,
                tool_calls: choice.message.tool_calls
            });
        }

        if (choice.message.tool_calls && choice.message.tool_calls.length > 0) {
            // Add the assistant's message with tool calls
            messages.push({
                role: 'assistant',
                content: reply,
                tool_calls: choice.message.tool_calls
            });

            // Execute all tool calls
            const toolResults = await this.toolHandler.executeAllToolCalls(choice.message.tool_calls);
            messages.push(...toolResults);

            // Get final response without tools to avoid infinite loop
            if (DEBUG_CONFIG.logLLMResponse) {
                console.log('🔄 Calling LLM again with search results...');
            }
            
            const followup = await createChatCompletion(messages, []);
            const finalChoice = followup.choices[0];
            const finalReply = finalChoice.message.content;

            printAssistantReply(finalReply);
            messages.push({ role: 'assistant', content: finalReply });
        } else {
            printAssistantReply(reply);
            messages.push({ role: 'assistant', content: reply });
        }

        rl.prompt();
    }

    async processUserInput(input, messages, rl) {
        messages.push({ role: 'user', content: input });
        
        if (DEBUG_CONFIG.logUserInput) {
            console.log('📝 User input:', input);
            console.log('📋 Current messages length:', messages.length);
        }

        try {
            const response = await createChatCompletion(messages, [TOOLS.webSearch]);
            await this.handleLLMResponse(response, messages, rl);
        } catch (error) {
            console.error('❌ Error processing input:', error);
            rl.prompt();
        }
    }
}