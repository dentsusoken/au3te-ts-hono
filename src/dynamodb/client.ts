import { DynamoDBClient, DynamoDBClientConfig } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';

/**
 * Creates a DynamoDB Document Client.
 * This function initializes a DynamoDB client with optional configuration,
 * and returns a DynamoDB Document Client for simplified interaction with DynamoDB.
 *
 * @param {DynamoDBClientConfig} [config] - Optional configuration for the DynamoDB client.
 * @returns {DynamoDBDocumentClient} The initialized DynamoDB Document Client.
 */
export const createDynamoDBClient = (config?: DynamoDBClientConfig) => {
  const client = new DynamoDBClient({
    endpoint: process.env.DYNAMODB_ENDPOINT,
    region: process.env.AWS_DEFAULT_REGION,
    ...config,
  });
  return DynamoDBDocumentClient.from(client);
};
