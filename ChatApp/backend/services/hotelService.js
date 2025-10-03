import axios from 'axios';
import { config } from '../config/config.js';
import { logger } from '../utils/logger.js';

export class HotelService {
    constructor() {
        this.apiKey = config.BOOKING_API_KEY; // Or use Hotels.com, Expedia API
        this.baseUrl = 'https://booking-com.p.rapidapi.com/v1';
    }

    getToolDefinition() {
        return {
            type: 'function',
            function: {
                name: 'searchHotels',
                description: 'Search for hotels, accommodations, and their availability. Use this when users ask about hotels, accommodations, or places to stay.',
                parameters: {
                    type: 'object',
                    properties: {
                        location: {
                            type: 'string',
                            description: 'City, location, or hotel name to search for (e.g., "New York", "Paris", "Times Square")'
                        },
                        checkin_date: {
                            type: 'string',
                            description: 'Check-in date in YYYY-MM-DD format (e.g., "2025-10-15")'
                        },
                        checkout_date: {
                            type: 'string',
                            description: 'Check-out date in YYYY-MM-DD format (e.g., "2025-10-17")'
                        },
                        adults: {
                            type: 'string',
                            description: 'Number of adult guests',
                            default: '2'
                        },
                        rooms: {
                            type: 'string',
                            description: 'Number of rooms needed',
                            default: '1'
                        }
                    },
                    required: ['location']
                }
            }
        };
    }

    async searchHotels(location, checkinDate = null, checkoutDate = null, adults = '2', rooms = '1') {
        try {
            if (!this.apiKey) {
                // Fallback to web search if no hotel API available
                return `I can help you search for hotels in ${location}. Here are some popular booking sites you can check:

🏨 **Recommended Hotel Booking Sites:**
• Booking.com - Wide selection and free cancellation
• Hotels.com - Loyalty rewards program
• Expedia - Package deals with flights
• Airbnb - Unique stays and apartments
• Agoda - Great for Asia-Pacific regions

🔍 **Search Tips:**
• Compare prices across multiple sites
• Check for free cancellation policies
• Read recent guest reviews
• Consider location vs. price
• Look for amenities that matter to you

${checkinDate && checkoutDate ? 
`📅 **Your Search:** ${location} from ${checkinDate} to ${checkoutDate} for ${adults} adult(s), ${rooms} room(s)` : 
`💡 **Tip:** Provide check-in and check-out dates for more specific results!`}`;
            }

            logger.info('Searching hotels', { location, checkinDate, checkoutDate });

            // This is a simplified example - actual implementation would vary by API
            const searchParams = {
                'X-RapidAPI-Key': this.apiKey,
                'X-RapidAPI-Host': 'booking-com.p.rapidapi.com'
            };

            // For demo purposes, return a structured response
            const mockHotels = [
                {
                    name: `Grand Hotel ${location}`,
                    rating: 4.5,
                    price: '$150/night',
                    amenities: ['Free WiFi', 'Pool', 'Gym', 'Restaurant'],
                    distance: '0.5 miles from city center'
                },
                {
                    name: `Budget Inn ${location}`,
                    rating: 3.8,
                    price: '$80/night',
                    amenities: ['Free WiFi', 'Breakfast', 'Parking'],
                    distance: '2 miles from city center'
                },
                {
                    name: `Luxury Resort ${location}`,
                    rating: 4.9,
                    price: '$350/night',
                    amenities: ['Spa', 'Pool', 'Fine Dining', 'Concierge'],
                    distance: '1 mile from city center'
                }
            ];

            let formattedResponse = `🏨 Hotels in ${location}:\n\n`;

            mockHotels.forEach((hotel, index) => {
                formattedResponse += `${index + 1}. **${hotel.name}**
⭐ Rating: ${hotel.rating}/5
💰 Price: ${hotel.price}
📍 Location: ${hotel.distance}
🎯 Amenities: ${hotel.amenities.join(', ')}
${index < mockHotels.length - 1 ? '\n---\n' : ''}`;
            });

            if (checkinDate && checkoutDate) {
                formattedResponse += `\n\n📅 **Dates:** ${checkinDate} to ${checkoutDate}`;
                formattedResponse += `\n👥 **Guests:** ${adults} adult(s), ${rooms} room(s)`;
            }

            formattedResponse += `\n\n💡 **Tip:** Visit the hotel websites or booking platforms for real-time availability and booking.`;

            return formattedResponse;

        } catch (error) {
            logger.error('Error searching hotels:', error);
            return `Sorry, I encountered an error while searching for hotels in ${location}. Please try again or search directly on hotel booking websites.`;
        }
    }
}