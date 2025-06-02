import { APIGatewayProxyHandlerV2 } from 'aws-lambda';
import { analyzeMessage } from '../services/analysisService';

export const handler: APIGatewayProxyHandlerV2 = async (event) => {
  try {
    if (!event.body) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Request body is required' }),
      };
    }

    let parsedBody;
    try {
      parsedBody = JSON.parse(event.body);
    } catch {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Invalid JSON format' }),
      };
    }

    const { message } = parsedBody;

    if (!message || typeof message !== 'string') {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Message must be a non-empty string' }),
      };
    }

    if (message.length > 5000) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          error: 'Message too long (max 5000 characters)',
        }),
      };
    }

    const analysis = analyzeMessage(message.trim());

    return {
      statusCode: 200,
      body: JSON.stringify(analysis),
      headers: {
        'Content-Type': 'application/json',
      },
    };
  } catch (error) {
    console.error('Unexpected error in analyze handler:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal server error' }),
    };
  }
};
