import {tavily} from '@tavily/core';
import { config } from './config.js';

export const tvly = tavily({ apiKey: config.TAVILY_API_KEY });

export async function webSearch(query, num_results = 3) {
    console.log(`🔍 Web search called with query: "${query}", num_results: ${num_results}`);
    try {
        // Ensure query is a string and num_results is a number
        const searchQuery = String(query);
        const maxResults = parseInt(num_results) || 3;
        
        console.log('Calling tvly.search with:', { query: searchQuery, max_results: maxResults });
        let results;
        try {
            // Format 1: max_results instead of num_results
            results = results = await tvly.search(searchQuery);
        } catch (err1) {
            console.log('Error with max_results format:', err1);
        }
        
        console.log('Search results:', results);
        if (!results || !results.results) {
            console.log('No results found');
            return 'No results found.';
        }
        const formattedResults = results.results.map(r => `${r.title}: ${r.url}`).join('\n');
        console.log('Formatted results:', formattedResults);
        return formattedResults;
    } catch (err) {
        console.error('Web search error:', err);
        return `Web search error: ${err.message || err}`;
    }
}
