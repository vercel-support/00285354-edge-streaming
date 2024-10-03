import { streamText } from 'ai';
import { openai } from '@ai-sdk/openai';

export const runtime = 'edge';
// This method must be named GET
export async function GET() {
  // Make a request to OpenAI's API based on
  // a placeholder prompt
  const response = await streamText({
    model: openai('gpt-4o-mini'),
    messages: [{ role: 'user', content: 'Say this is a test.' }],
  });
  // Respond with the stream
  return response.toTextStreamResponse({
    headers: {
      'Content-Type': 'text/event-stream',
    },
  });
}
