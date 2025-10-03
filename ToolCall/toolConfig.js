// Tool definitions and configurations
export const TOOLS = {
    webSearch: {
        type: 'function',
        function: {
            name: 'webSearch',
            description: 'Search the latest news or data from the web for information',
            parameters: {
                type: 'object',
                properties: {
                    query: { type: 'string', description: 'The search query' },
                    num_results: { type: 'integer', description: 'Number of results to return', default: 3 },
                },
                required: ['query'],
            },
        }
    }
};

export const SYSTEM_MESSAGE = {
    role: 'system',
    content: 'You are a helpful assistant. You have access to the following tool: webSearch'
};

export const DEBUG_CONFIG = {
    enabled: true,
    logUserInput: true,
    logLLMResponse: true,
    logToolCalls: true
};