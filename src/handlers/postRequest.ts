import { APIGatewayProxyHandlerV2 } from 'aws-lambda';
import { saveRequest } from '@/services/requestService';

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

    if (!parsedBody.tenantId || typeof parsedBody.tenantId !== 'string') {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'tenantId must be a non-empty string' }),
      };
    }

    if (!parsedBody.message || typeof parsedBody.message !== 'string') {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'message must be a non-empty string' }),
      };
    }

    const request = await saveRequest({
      tenantId: parsedBody.tenantId.trim(),
      message: parsedBody.message.trim(),
    });

    return {
      statusCode: 201,
      body: JSON.stringify(request),
      headers: {
        'Content-Type': 'application/json',
      },
    };
  } catch (err) {
    console.error('Unexpected error in postRequest handler:', err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal server error' }),
    };
  }
};
