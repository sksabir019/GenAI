import dotenv from 'dotenv';
dotenv.config();

function getEnvVar(key, required = true) {
    const value = process.env[key];
    if (required && (!value || value.trim() === '')) {
        throw new Error(`Missing required environment variable: ${key}`);
    }
    return value;
}

export const config = {
    GROQ_API_KEY: getEnvVar('GROQ_API_KEY'),
    TAVILY_API_KEY: getEnvVar('TAVILY_API_KEY'),
};
