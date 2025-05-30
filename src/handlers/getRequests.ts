import { APIGatewayProxyHandlerV2 } from 'aws-lambda';
import { getRequests } from '../services/requestService';
import { Priority } from '../models/types';

export const handler: APIGatewayProxyHandlerV2 = async (event) => {
  try {
    const priority = event.queryStringParameters?.priority as
      | Priority
      | undefined;
    const requests = await getRequests(priority);
    return {
      statusCode: 200,
      body: JSON.stringify({ requests }),
    };
  } catch (err) {
    console.error('Error retrieving requests:', err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal Server Error' }),
    };
  }
};
