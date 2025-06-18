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
import { SDKDappLoginLogoutResource } from './sdk-dapp-login-logout.js';
import { SDKDappReactResource } from './sdk-dapp-react.js';
import { SDKDappTransactionsResource } from './sdk-dapp-transactions.js';
import { SDKDappCustomProviderResource } from './sdk-dapp-custom-providers.js';
import { SDKDappInitResource } from './sdk-dapp-init.js';

// Resource URIs
const RESOURCE_URIS = {
  SDK_DAPP_GUIDE: 'mx://sdk-dapp-guide',
  SDK_DAPP_LOGIN_LOGOUT: 'mx://sdk-dapp-login-logout',
  SDK_DAPP_REACT: 'mx://sdk-dapp-react',
  SDK_DAPP_TRANSACTIONS: 'mx://sdk-dapp-transactions',
  SDK_DAPP_CUSTOM_PROVIDERS: 'mx://sdk-dapp-custom-providers',
  SDK_DAPP_INIT: 'mx://sdk-dapp-init',
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
        {
          uri: RESOURCE_URIS.SDK_DAPP_LOGIN_LOGOUT,
          name: 'SDK-DAPP v5 Login & Logout Guide',
          description: 'Complete guide for implementing user authentication in MultiversX dApps',
          mimeType: 'application/json',
        },
        {
          uri: RESOURCE_URIS.SDK_DAPP_REACT,
          name: 'SDK-DAPP v5 React Hooks Guide',
          description:
            'Comprehensive guide for using reactive hooks from sdk-dapp v5 in React applications',
          mimeType: 'application/json',
        },
        {
          uri: RESOURCE_URIS.SDK_DAPP_TRANSACTIONS,
          name: 'SDK-DAPP v5 Transaction Management Guide',
          description: 'Complete guide for signing and sending different types of transactions',
          mimeType: 'application/json',
        },
        {
          uri: RESOURCE_URIS.SDK_DAPP_CUSTOM_PROVIDERS,
          name: 'SDK-DAPP v5 Custom Provider Development Guide',
          description: 'Complete guide for creating and integrating custom signing providers',
          mimeType: 'application/json',
        },
        {
          uri: RESOURCE_URIS.SDK_DAPP_INIT,
          name: 'SDK-DAPP v5 Initialization Guide',
          description:
            'Complete guide for initializing the sdk-dapp library with various configuration options',
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

        case RESOURCE_URIS.SDK_DAPP_LOGIN_LOGOUT:
          return await SDKDappLoginLogoutResource.read();

        case RESOURCE_URIS.SDK_DAPP_REACT:
          return await SDKDappReactResource.read();

        case RESOURCE_URIS.SDK_DAPP_TRANSACTIONS:
          return await SDKDappTransactionsResource.read();

        case RESOURCE_URIS.SDK_DAPP_CUSTOM_PROVIDERS:
          return await SDKDappCustomProviderResource.read();

        case RESOURCE_URIS.SDK_DAPP_INIT:
          return {
            contents: [
              {
                uri: RESOURCE_URIS.SDK_DAPP_INIT,
                mimeType: 'text/markdown',
                text: SDKDappInitResource,
              },
            ],
          };

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
