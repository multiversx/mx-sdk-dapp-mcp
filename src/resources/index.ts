/**
 * Resources module - handles all MCP resources
 * Resources provide contextual data to language models
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import {
  ListResourcesRequestSchema,
  ReadResourceRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';

import { logger } from '../utils/logger.js';
import { ERROR_CODES } from '../utils/constants.js';
import { SDKDappGuideResource } from './sdk-dapp-guide.js';

// Resource URIs
const RESOURCE_URIS = {
  SDK_DAPP_GUIDE: 'mx://sdk-dapp-guide',
} as const;

/**
 * Setup all resources for the MCP server
 */
export async function setupResources(server: Server): Promise<void> {
  logger.info('Setting up resources...');

  // List all available resources
  server.setRequestHandler(ListResourcesRequestSchema, async () => {
    logger.debug('Listing available resources');

    return {
      resources: [
        {
          uri: RESOURCE_URIS.SDK_DAPP_GUIDE,
          name: 'SDK-DAPP v5 Complete Guide',
          description:
            'Comprehensive guide for SDK-DAPP v5 usage, initialization, and best practices',
          mimeType: 'application/json',
        },
      ],
    };
  });

  // Handle resource reading
  server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
    const { uri } = request.params;
    logger.debug(`Reading resource: ${uri}`);

    try {
      switch (uri) {
        case RESOURCE_URIS.SDK_DAPP_GUIDE:
          return await SDKDappGuideResource.read();

        default:
          throw new Error(`Unknown resource: ${uri}`);
      }
    } catch (error) {
      logger.error(`Error reading resource ${uri}:`, error);
      throw {
        code: ERROR_CODES.RESOURCE_NOT_FOUND,
        message: `Resource not found: ${uri}`,
      };
    }
  });

  logger.info('Resources setup completed');
}
