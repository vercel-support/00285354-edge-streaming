import OpenAI from 'openai';

export const maxDuration = 300;
export const runtime = 'edge';

export async function GET(): Promise<Response> {
  const encoder = new TextEncoder();
  const openAI = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  const completionStream = await openAI.chat.completions.create({
    messages: [
      {
        role: 'user',
        content: 'Why is the sky blue?',
      },
    ],
    model: 'gpt-4o-mini',
    stream: true,
  });

  const streamResponse = new ReadableStream({
    async start(controller) {
      for await (const chunk of completionStream) {
        // OpenAI expects the line to start with data: and to end with double newlines
        controller.enqueue(
          encoder.encode(`data: ${JSON.stringify(chunk)}\n\n`)
        );
      }
    },
  });

  const headers = new Headers();
  headers.set('Content-Type', 'text/event-stream');
  headers.set('Cache-Control', 'no-cache');
  headers.set('Connection', 'keep-alive');
  return new Response(streamResponse, { headers });
}
