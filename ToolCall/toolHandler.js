import { webSearch } from './tavilyClient.js';
import { DEBUG_CONFIG } from './toolConfig.js';

export class ToolHandler {
    constructor() {
        this.toolMap = {
            webSearch: this.handleWebSearch.bind(this)
        };
    }

    async handleWebSearch(args) {
        const { query, num_results = 3 } = args;
        if (DEBUG_CONFIG.logToolCalls) {
            console.log('📞 Calling webSearch with:', { query, num_results });
        }
        const results = await webSearch(query, num_results);
        if (DEBUG_CONFIG.logToolCalls) {
            console.log('✅ Search completed');
        }
        return results;
    }

    async executeToolCall(toolCall) {
        const { name } = toolCall.function;
        const args = JSON.parse(toolCall.function.arguments);
        
        if (!this.toolMap[name]) {
            throw new Error(`Unknown tool: ${name}`);
        }
        
        const result = await this.toolMap[name](args);
        
        return {
            role: 'tool',
            tool_call_id: toolCall.id,
            content: result
        };
    }

    async executeAllToolCalls(toolCalls) {
        const results = [];
        for (const toolCall of toolCalls) {
            if (DEBUG_CONFIG.logToolCalls) {
                console.log('🔧 Processing tool call:', toolCall);
            }
            const result = await this.executeToolCall(toolCall);
            results.push(result);
        }
        return results;
    }
}