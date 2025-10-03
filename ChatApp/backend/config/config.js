import dotenv from 'dotenv';

dotenv.config();

export const config = {
    // Server configuration
    PORT: process.env.PORT || 3001,
    NODE_ENV: process.env.NODE_ENV || 'development',
    CLIENT_URL: process.env.CLIENT_URL || 'http://localhost:3000',
    
    // API Keys
    GROQ_API_KEY: process.env.GROQ_API_KEY,
    TAVILY_API_KEY: process.env.TAVILY_API_KEY,
    
    // Chat configuration
    MAX_COMPLETION_TOKENS: parseInt(process.env.MAX_COMPLETION_TOKENS) || 1000,
    TEMPERATURE: parseFloat(process.env.TEMPERATURE) || 0.7,
    TOP_P: parseFloat(process.env.TOP_P) || 0.9,
    
    // Tool configuration
    MAX_SEARCH_RESULTS: parseInt(process.env.MAX_SEARCH_RESULTS) || 5,
    
    // Additional tool API keys
    OPENWEATHER_API_KEY: process.env.OPENWEATHER_API_KEY,
    AVIATIONSTACK_API_KEY: process.env.AVIATIONSTACK_API_KEY,
    BOOKING_API_KEY: process.env.BOOKING_API_KEY,
    
    // Security
    RATE_LIMIT_WINDOW: parseInt(process.env.RATE_LIMIT_WINDOW) || 900000, // 15 minutes
    RATE_LIMIT_MAX: parseInt(process.env.RATE_LIMIT_MAX) || 100,
    
    // Debug
    DEBUG_MODE: process.env.DEBUG_MODE === 'true',
    LOG_LEVEL: process.env.LOG_LEVEL || 'info'
};

// Validate required environment variables
const requiredEnvVars = ['GROQ_API_KEY', 'TAVILY_API_KEY'];

for (const envVar of requiredEnvVars) {
    if (!config[envVar]) {
        throw new Error(`Missing required environment variable: ${envVar}`);
    }
}