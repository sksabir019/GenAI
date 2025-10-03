
import { createCli, printError, printEnd } from './cli.js';
import { SYSTEM_MESSAGE } from './toolConfig.js';
import { ConversationHandler } from './conversationHandler.js';

class ChatApplication {
    constructor() {
        this.rl = createCli('You: ');
        this.messages = [SYSTEM_MESSAGE];
        this.conversationHandler = new ConversationHandler();
        this.setupEventHandlers();
    }

    setupEventHandlers() {
        this.rl.on('line', async (input) => {
            await this.conversationHandler.processUserInput(input, this.messages, this.rl);
        });

        this.rl.on('close', () => {
            printEnd();
            process.exit(0);
        });
    }

    start() {
        console.log('🚀 Chat application started. Type your questions!');
        this.rl.prompt();
    }
}

// Start the application
const app = new ChatApplication();
app.start();
