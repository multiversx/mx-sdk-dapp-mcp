/**
 * Tools module - handles all MCP tools
 * Tools are functions that AI models can execute
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { ListToolsRequestSchema, CallToolRequestSchema } from '@modelcontextprotocol/sdk/types.js';

import { logger } from '../utils/logger.js';
import { TOOL_NAMES, ERROR_CODES, NETWORKS } from '../utils/constants.js';
import { handleQueryAccount } from './query-account.js';
import { handleSdkDappGuide } from './sdk-dapp-guide.js';

/**
 * Setup all tools for the MCP server
 */
export async function setupTools(server: Server): Promise<void> {
  logger.info('Setting up tools...');

  // List all available tools
  server.setRequestHandler(ListToolsRequestSchema, async () => {
    logger.debug('Listing available tools');

    return {
      tools: [
        {
          name: TOOL_NAMES.QUERY_ACCOUNT,
          description:
            'Query MultiversX account information including balance, nonce, transactions, and guardian status for any network (mainnet, testnet, devnet)',
          inputSchema: {
            type: 'object',
            properties: {
              address: {
                type: 'string',
                description: 'The MultiversX account address to query (erd... format)',
              },
              network: {
                type: 'string',
                enum: ['MAINNET', 'TESTNET', 'DEVNET'],
                description: 'The MultiversX network to query (default: MAINNET)',
                default: 'MAINNET',
              },
              withGuardianInfo: {
                type: 'boolean',
                description: 'Include guardian information in the response',
                default: false,
              },
              withTxCount: {
                type: 'boolean',
                description: 'Include transaction count in the response',
                default: false,
              },
              withScrCount: {
                type: 'boolean',
                description: 'Include smart contract results count in the response',
                default: false,
              },
              withTimestamp: {
                type: 'boolean',
                description: 'Include timestamp of last activity in the response',
                default: false,
              },
              withAssets: {
                type: 'boolean',
                description: 'Include assets (tokens/NFTs) in the response',
                default: false,
              },
              timestamp: {
                type: 'number',
                description: 'Retrieve account state from a specific timestamp',
              },
            },
            required: ['address'],
          },
        },
        {
          name: TOOL_NAMES.SDK_DAPP_GUIDE,
          description:
            'Fetch the MultiversX SDK-DAPP v5 documentation from DeepWiki (https://deepwiki.com/multiversx/mx-sdk-dapp). Provide an optional topic/section name (e.g. "React Hooks", "Transaction Management") and the tool will automatically retrieve the corresponding markdown page.',
          inputSchema: {
            type: 'object',
            properties: {
              section: {
                type: 'string',
                description:
                  'Optional. The section name to extract from the guide (e.g., Installation, Configuration, Transactions, etc.)',
              },
            },
            required: [],
          },
        },
      ],
    };
  });

  // Handle tool calls
  server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const { name, arguments: args } = request.params;
    logger.debug(`Calling tool: ${name}`, args);

    try {
      switch (name) {
        case TOOL_NAMES.QUERY_ACCOUNT:
          return await handleQueryAccount(args);
        case TOOL_NAMES.SDK_DAPP_GUIDE:
          // Fetch and return the latest SDK-DAPP guide from remote, with optional section extraction
          return await handleSdkDappGuide(args);
        default:
          throw new Error(`Unknown tool: ${name}`);
      }
    } catch (error) {
      logger.error(`Error executing tool ${name}:`, error);
      throw {
        code: ERROR_CODES.TOOL_EXECUTION_ERROR,
        message: `Failed to execute tool: ${name}. ${
          error instanceof Error ? error.message : 'Unknown error'
        }`,
      };
    }
  });

  logger.info('Tools setup completed');
}
