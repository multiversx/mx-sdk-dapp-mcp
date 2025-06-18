/**
 * Prompts module - handles all MCP prompts
 * Prompts are user-controlled templates for common interactions
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { 
  ListPromptsRequestSchema,
  GetPromptRequestSchema 
} from '@modelcontextprotocol/sdk/types.js';

import { logger } from '../utils/logger.js';
import { PROMPT_NAMES, ERROR_CODES } from '../utils/constants.js';
import { 
  generateTransactionTemplate,
  generateBatchTransactionTemplate,
  generateSmartContractTemplate,
  generateTransactionMonitoringTemplate,
  generateWalletSetupGuide,
  generateNetworkSwitchInstructions
} from './sdk-dapp-transaction.js';

/**
 * Setup all prompts for the MCP server
 */
export async function setupPrompts(server: Server): Promise<void> {
  logger.info('Setting up prompts...');

  // List all available prompts
  server.setRequestHandler(ListPromptsRequestSchema, async () => {
    logger.debug('Listing available prompts');
    
    return {
      prompts: [
        {
          name: PROMPT_NAMES.TRANSACTION_TEMPLATE,
          description: 'Comprehensive template for creating MultiversX transactions with full workflow',
          arguments: [
            {
              name: 'recipient',
              description: 'The recipient address',
              required: true,
            },
            {
              name: 'amount',
              description: 'The amount to send (in EGLD)',
              required: true,
            },
            {
              name: 'data',
              description: 'Optional transaction data',
              required: false,
            },
            {
              name: 'contractAddress',
              description: 'Smart contract address (for contract interactions)',
              required: false,
            },
            {
              name: 'functionName',
              description: 'Smart contract function name',
              required: false,
            },
            {
              name: 'functionArgs',
              description: 'Smart contract function arguments (array)',
              required: false,
            },
          ],
        },
        {
          name: PROMPT_NAMES.BATCH_TRANSACTION_TEMPLATE,
          description: 'Template for creating batch transactions (parallel or sequential)',
          arguments: [
            {
              name: 'batchType',
              description: 'Type of batch execution: "parallel" or "sequential"',
              required: false,
            },
            {
              name: 'transactions',
              description: 'Array of transaction objects',
              required: false,
            },
          ],
        },
        {
          name: PROMPT_NAMES.SMART_CONTRACT_TEMPLATE,
          description: 'Template for smart contract interactions with detailed workflow',
          arguments: [
            {
              name: 'contractAddress',
              description: 'The smart contract address',
              required: true,
            },
            {
              name: 'functionName',
              description: 'The function to call',
              required: true,
            },
            {
              name: 'functionArgs',
              description: 'Array of function arguments',
              required: false,
            },
            {
              name: 'value',
              description: 'EGLD value to send with the transaction',
              required: false,
            },
          ],
        },
        {
          name: PROMPT_NAMES.TRANSACTION_MONITORING_TEMPLATE,
          description: 'Template for monitoring transaction status and handling results',
          arguments: [
            {
              name: 'sessionId',
              description: 'Transaction session ID to monitor',
              required: false,
            },
            {
              name: 'includeWebSocket',
              description: 'Include WebSocket monitoring examples',
              required: false,
            },
          ],
        },
        {
          name: PROMPT_NAMES.WALLET_SETUP_GUIDE,
          description: 'Guide for setting up MultiversX wallets and providers',
          arguments: [
            {
              name: 'provider',
              description: 'Preferred wallet provider',
              required: false,
            },
          ],
        },
        {
          name: PROMPT_NAMES.NETWORK_SWITCH_INSTRUCTIONS,
          description: 'Instructions for switching between MultiversX networks',
          arguments: [
            {
              name: 'targetNetwork',
              description: 'Target network (mainnet, testnet, devnet)',
              required: false,
            },
          ],
        },
      ],
    };
  });

  // Handle prompt requests
  server.setRequestHandler(GetPromptRequestSchema, async (request) => {
    const { name, arguments: args } = request.params;
    logger.debug(`Getting prompt: ${name}`, args);

    try {
      switch (name) {
        case PROMPT_NAMES.TRANSACTION_TEMPLATE:
          return {
            description: 'Comprehensive template for creating MultiversX transactions with full workflow',
            messages: [
              {
                role: 'user',
                content: {
                  type: 'text',
                  text: generateTransactionTemplate(args),
                },
              },
            ],
          };
        case PROMPT_NAMES.BATCH_TRANSACTION_TEMPLATE:
          return {
            description: 'Template for creating batch transactions (parallel or sequential)',
            messages: [
              {
                role: 'user',
                content: {
                  type: 'text',
                  text: generateBatchTransactionTemplate(args),
                },
              },
            ],
          };
        case PROMPT_NAMES.SMART_CONTRACT_TEMPLATE:
          return {
            description: 'Template for smart contract interactions with detailed workflow',
            messages: [
              {
                role: 'user',
                content: {
                  type: 'text',
                  text: generateSmartContractTemplate(args),
                },
              },
            ],
          };
        case PROMPT_NAMES.TRANSACTION_MONITORING_TEMPLATE:
          return {
            description: 'Template for monitoring transaction status and handling results',
            messages: [
              {
                role: 'user',
                content: {
                  type: 'text',
                  text: generateTransactionMonitoringTemplate(args),
                },
              },
            ],
          };
        case PROMPT_NAMES.WALLET_SETUP_GUIDE:
          return {
            description: 'Guide for setting up MultiversX wallets and providers',
            messages: [
              {
                role: 'user',
                content: {
                  type: 'text',
                  text: generateWalletSetupGuide(args),
                },
              },
            ],
          };
        case PROMPT_NAMES.NETWORK_SWITCH_INSTRUCTIONS:
          return {
            description: 'Instructions for switching between MultiversX networks',
            messages: [
              {
                role: 'user',
                content: {
                  type: 'text',
                  text: generateNetworkSwitchInstructions(args),
                },
              },
            ],
          };
        default:
          throw new Error(`Unknown prompt: ${name}`);
      }
    } catch (error) {
      logger.error(`Error getting prompt ${name}:`, error);
      throw {
        code: ERROR_CODES.INVALID_PARAMS,
        message: `Failed to get prompt: ${name}`,
      };
    }
  });

  logger.info('Prompts setup completed');
}

 