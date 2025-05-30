import { v4 as uuidv4 } from 'uuid';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import {
  DynamoDBDocumentClient,
  PutCommand,
  ScanCommand,
} from '@aws-sdk/lib-dynamodb';
import {
  MaintenanceRequestInput,
  MaintenanceRequest,
  Priority,
} from '../models/types';
import { analyzeMessage as analyzeMessageService } from './analysisService';

const dynamo = DynamoDBDocumentClient.from(new DynamoDBClient({}));

const tableName = process.env.REQUESTS_TABLE_NAME;
if (!tableName) {
  throw new Error('REQUESTS_TABLE_NAME environment variable is required');
}

export const saveRequest = async (
  input: MaintenanceRequestInput & { createdAt: string }
): Promise<MaintenanceRequest> => {
  const id = uuidv4();

  const analysis = analyzeMessageService(input.message);

  const request: MaintenanceRequest = {
    id,
    tenantId: input.tenantId,
    message: input.message,
    createdAt: input.createdAt,
    priority: analysis.priority,
    analyzedFactors: analysis,
    resolved: false,
  };

  await dynamo.send(
    new PutCommand({
      TableName: tableName,
      Item: request,
    })
  );

  return request;
};

export const getRequests = async (
  priority?: Priority
): Promise<MaintenanceRequest[]> => {
  if (priority) {
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
  }

  const command = new ScanCommand({
    TableName: tableName,
  });

  const result = await dynamo.send(command);
  return result.Items as MaintenanceRequest[];
};
