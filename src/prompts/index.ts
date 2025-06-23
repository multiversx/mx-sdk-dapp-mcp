/**
 * Prompts module - handles all MCP prompts
 * Prompts are user-controlled templates for common interactions
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import {
  ListPromptsRequestSchema,
  GetPromptRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';

import { logger } from '../utils/logger.js';
import { PROMPT_NAMES, ERROR_CODES } from '../utils/constants.js';

/**
 * Setup all prompts for the MCP server
 */
export async function setupPrompts(server: Server): Promise<void> {
  logger.info('Setting up prompts...');

  // List all available prompts
  server.setRequestHandler(ListPromptsRequestSchema, async () => {
    logger.debug('Listing available prompts');

    return {
      prompts: [],
    };
  });

  // Handle prompt requests
  server.setRequestHandler(GetPromptRequestSchema, async (request) => {
    const { name, arguments: args } = request.params;
    logger.debug(`Getting prompt: ${name}`, args);

    // Lookup table for prompt handlers
    const promptHandlers: Record<
      string,
      { description: string; generator: (args: any) => string }
    > = {};

    try {
      const handler = promptHandlers[name];
      if (!handler) {
        throw new Error(`Unknown prompt: ${name}`);
      }
      return {
        description: handler.description,
        messages: [
          {
            role: 'user',
            content: {
              type: 'text',
              text: handler.generator(args),
            },
          },
        ],
      };
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
