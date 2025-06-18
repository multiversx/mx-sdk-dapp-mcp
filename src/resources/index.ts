/**
 * Resources module - handles all MCP resources
 * Resources provide contextual data to language models
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { 
  ListResourcesRequestSchema,
  ReadResourceRequestSchema 
} from '@modelcontextprotocol/sdk/types.js';

import { logger } from '../utils/logger.js';
import { RESOURCE_URIS, ERROR_CODES } from '../utils/constants.js';
import { SDKDappInitResource } from './sdk-dapp-init.js';
import { SDKDappLoginLogoutResource } from './sdk-dapp-login-logout.js';
import { SDKDappCustomProviderResource } from './sdk-dapp-custom-providers.js';
import { SDKDappTransactionsResource } from './sdk-dapp-transactions.js';
import { SDKDappReactResource } from './sdk-dapp-react.js';

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
          uri: RESOURCE_URIS.SDK_DAPP_INIT,
          name: 'SDK Dapp Initialization Guide',
          description: 'Complete guide for initializing and configuring SDK-DAPP v5',
          mimeType: 'application/json',
        },
        {
          uri: RESOURCE_URIS.SDK_DAPP_LOGIN_LOGOUT,
          name: 'Login & Logout Guide',
          description: 'Complete guide for implementing user authentication in SDK-DAPP v5',
          mimeType: 'application/json',
        },
        {
          uri: RESOURCE_URIS.SDK_DAPP_CUSTOM_PROVIDERS,
          name: 'Custom Provider Development Guide',
          description: 'Complete guide for creating and integrating custom signing providers in SDK-DAPP v5',
          mimeType: 'application/json',
        },
        {
          uri: RESOURCE_URIS.SDK_DAPP_TRANSACTIONS,
          name: 'Transaction Management Guide',
          description: 'Complete guide for signing and sending different types of transactions in SDK-DAPP v5',
          mimeType: 'application/json',
        },
        {
          uri: RESOURCE_URIS.SDK_DAPP_REACT,
          name: 'React Hooks Guide',
          description: 'Comprehensive guide for using reactive hooks from SDK-DAPP v5 in React',
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
        case RESOURCE_URIS.SDK_DAPP_INIT:
          return await SDKDappInitResource.read();

        case RESOURCE_URIS.SDK_DAPP_LOGIN_LOGOUT:
          return await SDKDappLoginLogoutResource.read();

        case RESOURCE_URIS.SDK_DAPP_CUSTOM_PROVIDERS:
          return await SDKDappCustomProviderResource.read();

        case RESOURCE_URIS.SDK_DAPP_TRANSACTIONS:
          return await SDKDappTransactionsResource.read();

        case RESOURCE_URIS.SDK_DAPP_REACT:
          return await SDKDappReactResource.read();

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