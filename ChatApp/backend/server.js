import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { config } from './config/config.js';
import { logger } from './utils/logger.js';
import { ChatService } from './services/chatService.js';
import { errorHandler } from './middleware/errorHandler.js';

class ChatServer {
    constructor() {
        this.app = express();
        this.server = createServer(this.app);
        this.io = new Server(this.server, {
            cors: {
                origin: config.CLIENT_URL,
                methods: ["GET", "POST"],
                credentials: true
            }
        });
        this.chatService = new ChatService();
        this.setupMiddleware();
        this.setupRoutes();
        this.setupSocketHandlers();
        this.setupErrorHandling();
    }

    setupMiddleware() {
        // Security middleware
        this.app.use(helmet({
            contentSecurityPolicy: {
                directives: {
                    defaultSrc: ["'self'"],
                    styleSrc: ["'self'", "'unsafe-inline'"],
                    scriptSrc: ["'self'"],
                    imgSrc: ["'self'", "data:", "https:"],
                }
            }
        }));

        // CORS
        this.app.use(cors({
            origin: config.CLIENT_URL,
            credentials: true
        }));

        // Rate limiting
        const limiter = rateLimit({
            windowMs: 15 * 60 * 1000, // 15 minutes
            max: 100, // limit each IP to 100 requests per windowMs
            message: {
                error: 'Too many requests from this IP, please try again later.'
            }
        });
        this.app.use(limiter);

        // Body parsing
        this.app.use(express.json({ limit: '10mb' }));
        this.app.use(express.urlencoded({ extended: true }));

        // Logging middleware
        this.app.use((req, res, next) => {
            logger.info(`${req.method} ${req.path}`, {
                ip: req.ip,
                userAgent: req.get('User-Agent')
            });
            next();
        });
    }

    setupRoutes() {
        // Health check
        this.app.get('/health', (req, res) => {
            res.json({
                status: 'OK',
                timestamp: new Date().toISOString(),
                environment: config.NODE_ENV
            });
        });

        // API routes
        this.app.get('/api/status', (req, res) => {
            res.json({
                message: 'Chat API is running',
                version: '1.0.0'
            });
        });
    }

    setupSocketHandlers() {
        this.io.on('connection', (socket) => {
            logger.info(`Client connected: ${socket.id}`);

            // Handle chat messages
            socket.on('chat_message', async (data) => {
                try {
                    const { message, sessionId } = data;
                    
                    if (!message || typeof message !== 'string') {
                        socket.emit('error', { message: 'Invalid message format' });
                        return;
                    }

                    // Emit typing indicator
                    socket.emit('assistant_typing', { typing: true });

                    // Process message through chat service
                    const response = await this.chatService.processMessage(message, sessionId);

                    // Send response back
                    socket.emit('assistant_message', {
                        message: response.message,
                        timestamp: response.timestamp,
                        sessionId: response.sessionId
                    });

                    socket.emit('assistant_typing', { typing: false });

                } catch (error) {
                    logger.error('Error processing chat message:', error);
                    socket.emit('error', {
                        message: 'Failed to process message',
                        timestamp: new Date().toISOString()
                    });
                    socket.emit('assistant_typing', { typing: false });
                }
            });

            // Handle disconnect
            socket.on('disconnect', (reason) => {
                logger.info(`Client disconnected: ${socket.id}, reason: ${reason}`);
            });

            // Handle connection errors
            socket.on('error', (error) => {
                logger.error(`Socket error for ${socket.id}:`, error);
            });
        });
    }

    setupErrorHandling() {
        this.app.use(errorHandler);

        // Handle uncaught exceptions
        process.on('uncaughtException', (error) => {
            logger.error('Uncaught Exception:', error);
            process.exit(1);
        });

        // Handle unhandled promise rejections
        process.on('unhandledRejection', (reason, promise) => {
            logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
            process.exit(1);
        });
    }

    start() {
        this.server.listen(config.PORT, () => {
            logger.info(`🚀 Server running on port ${config.PORT} in ${config.NODE_ENV} mode`);
            logger.info(`🌐 Client URL: ${config.CLIENT_URL}`);
        });
    }
}

// Start the server
const server = new ChatServer();
server.start();

export default ChatServer;