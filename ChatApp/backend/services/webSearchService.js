import { tavily } from '@tavily/core';
import { config } from '../config/config.js';
import { logger } from '../utils/logger.js';

export class WebSearchService {
    constructor() {
        this.client = tavily({
            apiKey: config.TAVILY_API_KEY
        });
    }

    getToolDefinition() {
        return {
            type: 'function',
            function: {
                name: 'webSearch',
                description: 'Search the web for current information, recent events, news, or specific factual data. Use this when you need up-to-date information that might not be in your training data.',
                parameters: {
                    type: 'object',
                    properties: {
                        query: {
                            type: 'string',
                            description: 'The search query. Be specific and use relevant keywords.'
                        },
                        num_results: {
                            type: 'string',
                            description: 'Number of search results to return (default: 3, max: 10)',
                            default: "3"
                        }
                    },
                    required: ['query']
                }
            }
        };
    }

    async search(query, numResults = 3) {
        try {
            // Validate inputs
            if (!query || typeof query !== 'string') {
                throw new Error('Query must be a non-empty string');
            }

            // Convert numResults to integer if it's a string
            numResults = typeof numResults === 'string' ? parseInt(numResults) : numResults;
            if (isNaN(numResults) || numResults < 1) {
                numResults = 3;
            }

            if (numResults > config.MAX_SEARCH_RESULTS) {
                numResults = config.MAX_SEARCH_RESULTS;
            }

            logger.info('Performing web search', { 
                query: query.substring(0, 100), 
                numResults 
            });

            const response = await this.client.search(query);

            if (!response || !response.results) {
                logger.warn('No search results returned', { query });
                return 'No search results found for the given query.';
            }

            // Format results for the LLM
            const formattedResults = this.formatSearchResults(response);
            
            logger.info('Web search completed', { 
                query: query.substring(0, 100),
                resultCount: response.results.length,
                hasAnswer: !!response.answer
            });

            return formattedResults;

        } catch (error) {
            logger.error('Web search error:', {
                query: query?.substring(0, 100),
                error: error.message,
                status: error.status
            });

            // Handle specific Tavily API errors
            if (error.status === 401) {
                throw new Error('Invalid Tavily API key');
            } else if (error.status === 429) {
                throw new Error('Search rate limit exceeded. Please try again later.');
            } else if (error.status >= 500) {
                throw new Error('Search service unavailable. Please try again later.');
            }

            throw new Error(`Web search failed: ${error.message}`);
        }
    }

    formatSearchResults(response) {
        let formatted = '';

        // Add answer if available
        if (response.answer) {
            formatted += `## Search Summary:\n${response.answer}\n\n`;
        }

        // Add search results
        if (response.results && response.results.length > 0) {
            formatted += '## Search Results:\n\n';
            
            response.results.forEach((result, index) => {
                formatted += `### ${index + 1}. ${result.title}\n`;
                formatted += `**Source:** ${result.url}\n`;
                if (result.content) {
                    // Truncate content if too long
                    const content = result.content.length > 500 
                        ? result.content.substring(0, 500) + '...' 
                        : result.content;
                    formatted += `**Content:** ${content}\n`;
                }
                if (result.published_date) {
                    formatted += `**Published:** ${result.published_date}\n`;
                }
                formatted += '\n';
            });
        }

        return formatted;
    }

    async validateConnection() {
        try {
            await this.search('test query', 1);
            return true;
        } catch (error) {
            logger.error('Tavily connection validation failed:', error);
            return false;
        }
    }
}