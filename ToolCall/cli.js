import readline from 'readline';
import chalk from 'chalk';

export function createCli(promptText = 'You: ') {
    return readline.createInterface({
        input: process.stdin,
        output: process.stdout,
        prompt: chalk.blue(promptText),
    });
}

export function printAssistantReply(reply) {
    if (reply && reply.trim()) {
        console.log(chalk.green('Assistant:'), chalk.yellow(reply));
    }
}

export function printError(error) {
    console.error(chalk.red('Error:'), error);
}

export function printEnd() {
    console.log(chalk.magenta('Chat ended.'));
}
