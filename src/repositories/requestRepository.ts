import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import {
  DynamoDBDocumentClient,
  PutCommand,
  ScanCommand,
} from '@aws-sdk/lib-dynamodb';
import { MaintenanceRequest, Priority } from '../models/types';

const dynamo = DynamoDBDocumentClient.from(new DynamoDBClient({}));

const tableName = process.env.REQUESTS_TABLE_NAME;
if (!tableName) {
  throw new Error('REQUESTS_TABLE_NAME environment variable is required');
}

export const createRequest = async (
  request: Omit<MaintenanceRequest, 'createdAt'>
): Promise<MaintenanceRequest> => {
  /* In given documentation timestamp was marked as required:
  Request: { tenantId: string, message: string, timestamp: string }
  but in my opinion it could be easily manipulated by the client, so I decided to add server timestamp as "createdAt" based on given response example for: GET /requests.
  Created as close to actual write as i could (similar to MongoDB timestamps: true pattern).
  */
  const requestWithTimestamp: MaintenanceRequest = {
    ...request,
    createdAt: new Date().toISOString(),
  };

  await dynamo.send(
    new PutCommand({
      TableName: tableName,
      Item: requestWithTimestamp,
    })
  );

  return requestWithTimestamp;
};

export const getAllRequests = async (): Promise<MaintenanceRequest[]> => {
  const command = new ScanCommand({
    TableName: tableName,
  });

  const result = await dynamo.send(command);
  return result.Items as MaintenanceRequest[];
};

export const getRequestsByPriority = async (
  priority: Priority
): Promise<MaintenanceRequest[]> => {
  const command = new ScanCommand({
    TableName: tableName,
    FilterExpression: '#p = :priorityVal',
    ExpressionAttributeNames: {
      '#p': 'priority',
    },
    ExpressionAttributeValues: {
      ':priorityVal': priority,
    },
  });

  const result = await dynamo.send(command);
  return result.Items as MaintenanceRequest[];
};
