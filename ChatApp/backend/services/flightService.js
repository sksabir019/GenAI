import axios from 'axios';
import { config } from '../config/config.js';
import { logger } from '../utils/logger.js';

export class FlightService {
    constructor() {
        this.apiKey = config.AVIATIONSTACK_API_KEY; // Or use Amadeus, Skyscanner API
        this.baseUrl = 'http://api.aviationstack.com/v1';
    }

    getToolDefinition() {
        return {
            type: 'function',
            function: {
                name: 'searchFlights',
                description: 'Search for flight information, schedules, and prices. Use this when users ask about flights, flight status, or travel information.',
                parameters: {
                    type: 'object',
                    properties: {
                        departure: {
                            type: 'string',
                            description: 'Departure airport code or city name (e.g., "JFK", "New York")'
                        },
                        arrival: {
                            type: 'string',
                            description: 'Arrival airport code or city name (e.g., "LAX", "Los Angeles")'
                        },
                        date: {
                            type: 'string',
                            description: 'Departure date in YYYY-MM-DD format (e.g., "2025-10-15")'
                        },
                        flight_number: {
                            type: 'string',
                            description: 'Specific flight number to check status (optional)'
                        }
                    },
                    required: ['departure', 'arrival']
                }
            }
        };
    }

    async searchFlights(departure, arrival, date = null, flightNumber = null) {
        try {
            if (!this.apiKey) {
                throw new Error('Aviation API key not configured');
            }

            logger.info('Searching flights', { departure, arrival, date, flightNumber });

            let endpoint = 'flights';
            let params = {
                access_key: this.apiKey,
                limit: 10
            };

            if (flightNumber) {
                // Search for specific flight
                params.flight_iata = flightNumber;
            } else {
                // Search by route
                params.dep_iata = departure;
                params.arr_iata = arrival;
                if (date) {
                    params.flight_date = date;
                }
            }

            const response = await axios.get(`${this.baseUrl}/${endpoint}`, {
                params,
                timeout: 15000
            });

            const flights = response.data.data;

            if (!flights || flights.length === 0) {
                return `No flights found for ${departure} to ${arrival}${date ? ` on ${date}` : ''}. Please check the airport codes and try again.`;
            }

            let formattedResponse = `Flight information for ${departure} → ${arrival}:\n\n`;

            flights.slice(0, 5).forEach((flight, index) => {
                const flightInfo = {
                    flightNumber: flight.flight?.iata || flight.flight?.icao || 'N/A',
                    airline: flight.airline?.name || 'Unknown Airline',
                    departure: {
                        airport: flight.departure?.airport || departure,
                        time: flight.departure?.scheduled || 'N/A',
                        terminal: flight.departure?.terminal || 'N/A'
                    },
                    arrival: {
                        airport: flight.arrival?.airport || arrival,
                        time: flight.arrival?.scheduled || 'N/A',
                        terminal: flight.arrival?.terminal || 'N/A'
                    },
                    status: flight.flight_status || 'Unknown',
                    aircraft: flight.aircraft?.registration || 'N/A'
                };

                formattedResponse += `✈️ Flight ${flightInfo.flightNumber} - ${flightInfo.airline}
📍 From: ${flightInfo.departure.airport} (Terminal ${flightInfo.departure.terminal})
📍 To: ${flightInfo.arrival.airport} (Terminal ${flightInfo.arrival.terminal})
🕐 Departure: ${this.formatTime(flightInfo.departure.time)}
🕐 Arrival: ${this.formatTime(flightInfo.arrival.time)}
📊 Status: ${flightInfo.status}
${index < flights.length - 1 ? '\n---\n' : ''}`;
            });

            if (flights.length > 5) {
                formattedResponse += `\n\n... and ${flights.length - 5} more flights available.`;
            }

            logger.info('Flight search completed', { 
                resultCount: flights.length,
                route: `${departure}-${arrival}` 
            });

            return formattedResponse;

        } catch (error) {
            logger.error('Error searching flights:', error);
            
            if (error.response?.status === 404) {
                return `No flights found for the specified route. Please check the airport codes.`;
            } else if (error.response?.status === 401) {
                return 'Flight search service is currently unavailable due to API authentication issues.';
            } else {
                return `Sorry, I encountered an error while searching for flights: ${error.message}`;
            }
        }
    }

    formatTime(timeString) {
        if (!timeString || timeString === 'N/A') return 'N/A';
        
        try {
            const date = new Date(timeString);
            return date.toLocaleString('en-US', {
                weekday: 'short',
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                timeZoneName: 'short'
            });
        } catch (error) {
            return timeString;
        }
    }
}