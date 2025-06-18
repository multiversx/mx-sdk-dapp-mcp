/**
 * Tools module - handles all MCP tools
 * Tools are functions that AI models can execute
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { 
  ListToolsRequestSchema,
  CallToolRequestSchema 
} from '@modelcontextprotocol/sdk/types.js';
import { z } from 'zod';

import { logger } from '../utils/logger.js';
import { TOOL_NAMES, ERROR_CODES, NETWORKS } from '../utils/constants.js';
import { handleQueryAccount } from './query-account.js';

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
          description: 'Query MultiversX account information including balance, nonce, transactions, and guardian status for any network (mainnet, testnet, devnet)',
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
        
        default:
          throw new Error(`Unknown tool: ${name}`);
      }
    } catch (error) {
      logger.error(`Error executing tool ${name}:`, error);
      throw {
        code: ERROR_CODES.TOOL_EXECUTION_ERROR,
        message: `Failed to execute tool: ${name}. ${error instanceof Error ? error.message : 'Unknown error'}`,
      };
    }
  });

  logger.info('Tools setup completed');
} 