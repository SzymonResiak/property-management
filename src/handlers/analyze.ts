import { APIGatewayProxyHandlerV2 } from 'aws-lambda';
import { analyzeMessage } from '../services/analysisService';

export const handler: APIGatewayProxyHandlerV2 = async (event) => {
  try {
    if (!event.body) return { statusCode: 400, body: 'Missing body' };

    const { message } = JSON.parse(event.body);

    if (!message) return { statusCode: 400, body: "Missing 'message' in body" };

    const analysis = analyzeMessage(message);

    return {
      statusCode: 200,
      body: JSON.stringify(analysis),
      headers: {
        'Content-Type': 'application/json',
      },
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: (error as Error).message }),
    };
  }
};
