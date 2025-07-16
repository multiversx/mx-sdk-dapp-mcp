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
          description: `Retrieves comprehensive documentation for the MultiversX SDK-DAPP v5 library from DeepWiki. This tool provides access to the complete developer guide including installation, configuration, core concepts, API reference, and advanced topics. The documentation is specifically tailored for React developers building decentralized applications on the MultiversX blockchain.\n\nKey capabilities:\n- Fetch complete sections of the SDK-DAPP v5 documentation\n- Access installation and setup guides\n- Retrieve API reference documentation for hooks, functions, and types\n- Get configuration and integration examples\n- Access advanced topics like native authentication and WebView integration\n- Supports intelligent section matching with fuzzy search\n\nThe tool automatically maps user-friendly section names to the corresponding documentation pages and provides fallback mechanisms for robust operation.`,
          inputSchema: {
            type: 'object',
            properties: {
              section: {
                type: 'string',
                description: `Optional. Specify which section of the SDK-DAPP documentation to retrieve. \n\nAvailable sections include:\n• Getting Started: \"overview\", \"getting-started\"\n• Installation: \"installation\", \"setup\", \"configuration\"\n• Core Concepts: \"authentication\", \"transactions\", \"state-management\"\n• API Reference: \"react-hooks\", \"core-functions\", \"provider-types\", \"transaction-types\", \"network-configuration\", \"constants-and-utilities\"\n• Advanced Topics: \"native-authentication\", \"webview-integration\", \"custom-providers\"\n\nYou can use either human-friendly names (e.g., \"React Hooks\") or exact section identifiers (e.g., \"4.2-react-hooks\"). The tool includes fuzzy matching to find the most relevant section even with partial matches.\n\nExamples:\n- \"installation\" → Installation and setup guide\n- \"hooks\" → React hooks documentation\n- \"authentication\" → Authentication and provider setup\n- \"transactions\" → Transaction management guide\n- \"configuration\" → Basic configuration guide\n\nIf no section is specified, the tool returns the overview documentation.`,
                examples: [
                  'installation',
                  'react-hooks',
                  'authentication',
                  'transactions',
                  'configuration',
                  'native-authentication',
                  'webview-integration',
                ],
              },
            },
            required: [],
          },
          annotations: {
            title: 'MultiversX SDK-DAPP Documentation Retriever',
            readOnlyHint: true,
            idempotentHint: true,
            openWorldHint: true,
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
