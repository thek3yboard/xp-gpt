import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY, dangerouslyAllowBrowser: true
});

export async function sendMessageToOpenAI(message: string) {
    const chatCompletion = await openai.chat.completions.create({
        response_format: { "type": "json_object" },
        messages: [
            { 
                role: 'system',
                content: `You are a helpful assistant designed to output this JSON format:
                {
                    "answer": "<your to the user's question>"
                }`
            },
            { 
                role: 'user',
                content: message
            },
        ],
        model: 'gpt-3.5-turbo',
    });
    
    return chatCompletion.choices[0].message.content;
}

export async function generateImage(message: string) {
    const response = await openai.images.generate({
        model: "dall-e-3",
        prompt: `${message}`,
        size: "1024x1024",
        quality: "standard",
        n: 1,
    });
    
    return response.data[0].url;
}