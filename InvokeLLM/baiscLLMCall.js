import Groq from 'groq-sdk';
import readline from 'readline';
import chalk from 'chalk';

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY,
});

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: chalk.blue('You: '),
});

const messages = [
    { role: 'system', content: 'You are a helpful assistant.' }
];

async function invokeLLM() {
    rl.prompt();
    rl.on('line', async (input) => {
        messages.push({ role: 'user', content: input });
        try {
            const response = await groq.chat.completions.create({
                model: 'llama-3.3-70b-versatile',      // model to use
                messages,                              // conversation history
                temperature: 0.7,                      // randomness in output
                top_p: 0.9,                            // nucleus sampling
                stop: ['\nUser:', '\nAssistant:'],     // stop sequences
                max_completion_tokens: 150,            // max tokens in response
                frequency_penalty: 1,                  // discourage repetition / overuse / penalty for frequent tokens
                presence_penalty: 1,                   // encourage new topics / ideas / penalty for frequent tokens
                // response_format: { type: 'json_object' }, // response format
            });
            const reply = response.choices[0].message.content;
            console.log(chalk.green('Assistant:'), chalk.yellow(reply));
            console.log('');
            messages.push({ role: 'assistant', content: reply });
        } catch (error) {
            console.error(chalk.red('Error:'), error);
        }
        rl.prompt();
    }).on('close', () => {
        console.log(chalk.magenta('Chat ended.'));
        process.exit(0);
    });
}

invokeLLM();
