import { APIGatewayProxyHandlerV2 } from 'aws-lambda';
import { saveRequest } from '../services/requestService';

export const handler: APIGatewayProxyHandlerV2 = async (event) => {
  try {
    if (!event.body) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Request body is required' }),
      };
    }

    const body = JSON.parse(event.body);

    if (!body.tenantId || !body.message) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          error: 'tenantId and message are required',
        }),
      };
    }

    /* In given documentation timestamp was marked as required:
    Request: { tenantId: string, message: string, timestamp: string }
    but in my opinion it could be easily manipulated by the client, so I decided to add server timestamp as "createdAt" based on given response example for: GET /requests.
    */
    const requestWithTimestamp = {
      ...body,
      createdAt: new Date().toISOString(),
    };

    const request = await saveRequest(requestWithTimestamp);
    return {
      statusCode: 201,
      body: JSON.stringify(request),
    };
  } catch (err) {
    console.error('Error saving request:', err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal Server Error' }),
    };
  }
};
