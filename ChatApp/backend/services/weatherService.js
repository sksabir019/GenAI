import axios from 'axios';
import { config } from '../config/config.js';
import { logger } from '../utils/logger.js';

export class WeatherService {
    constructor() {
        this.apiKey = config.OPENWEATHER_API_KEY;
        this.baseUrl = 'https://api.openweathermap.org/data/2.5';
    }

    getToolDefinition() {
        return {
            type: 'function',
            function: {
                name: 'getWeather',
                description: 'Get current weather information for a specific location. Use this when users ask about weather, temperature, or weather conditions.',
                parameters: {
                    type: 'object',
                    properties: {
                        location: {
                            type: 'string',
                            description: 'The city name, state, and/or country (e.g., "New York, NY", "London, UK", "Tokyo")'
                        },
                        units: {
                            type: 'string',
                            description: 'Temperature units',
                            enum: ['metric', 'imperial', 'kelvin'],
                            default: 'metric'
                        }
                    },
                    required: ['location']
                }
            }
        };
    }

    async getCurrentWeather(location, units = 'metric') {
        try {
            if (!this.apiKey) {
                throw new Error('OpenWeather API key not configured');
            }

            logger.info('Fetching weather data', { location, units });

            const response = await axios.get(`${this.baseUrl}/weather`, {
                params: {
                    q: location,
                    appid: this.apiKey,
                    units: units
                },
                timeout: 10000
            });

            const data = response.data;
            
            const weatherInfo = {
                location: `${data.name}, ${data.sys.country}`,
                temperature: Math.round(data.main.temp),
                feelsLike: Math.round(data.main.feels_like),
                description: data.weather[0].description,
                humidity: data.main.humidity,
                pressure: data.main.pressure,
                windSpeed: data.wind?.speed || 0,
                windDirection: data.wind?.deg || 0,
                visibility: data.visibility ? (data.visibility / 1000).toFixed(1) : 'N/A',
                uvIndex: data.uvi || 'N/A',
                units: units
            };

            const unitSymbol = units === 'metric' ? '°C' : units === 'imperial' ? '°F' : 'K';
            const speedUnit = units === 'metric' ? 'm/s' : 'mph';

            const formattedResponse = `Current weather in ${weatherInfo.location}:
🌡️ Temperature: ${weatherInfo.temperature}${unitSymbol} (feels like ${weatherInfo.feelsLike}${unitSymbol})
🌤️ Conditions: ${weatherInfo.description}
💧 Humidity: ${weatherInfo.humidity}%
🌪️ Wind: ${weatherInfo.windSpeed} ${speedUnit}
👁️ Visibility: ${weatherInfo.visibility} km
🔽 Pressure: ${weatherInfo.pressure} hPa`;

            logger.info('Weather data retrieved successfully', { 
                location: weatherInfo.location,
                temperature: weatherInfo.temperature 
            });

            return formattedResponse;

        } catch (error) {
            logger.error('Error fetching weather data:', error);
            
            if (error.response?.status === 404) {
                return `Sorry, I couldn't find weather information for "${location}". Please check the location name and try again.`;
            } else if (error.response?.status === 401) {
                return 'Weather service is currently unavailable due to API authentication issues.';
            } else {
                return `Sorry, I encountered an error while fetching weather information: ${error.message}`;
            }
        }
    }
}