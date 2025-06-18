#!/usr/bin/env node

/**
 * MultiversX MCP Server
 * Main entry point for the Model Context Protocol server
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { CallToolRequestSchema } from '@modelcontextprotocol/sdk/types.js';

import { setupResources } from './resources/index.js';
import { setupTools } from './tools/index.js';
import { setupPrompts } from './prompts/index.js';
import { logger } from './utils/logger.js';
import { ERROR_CODES } from './utils/constants.js';

/**
 * Create and configure the MCP server
 */
async function createServer(): Promise<Server> {
  const server = new Server(
    {
      name: 'mx-dev-mcp',
      version: '1.0.0',
      description: 'MCP server for MultiversX SDK-Dapp integration',
    },
    {
      capabilities: {
        resources: {},
        tools: {},
        prompts: {},
        logging: {},
      },
    }
  );

  // Setup error handling
  server.onerror = (error) => {
    logger.error('Server error:', error);
  };

  // Setup server capabilities
  await setupResources(server);
  await setupTools(server);
  await setupPrompts(server);

  return server;
}

/**
 * Main function to start the MCP server
 */
async function main(): Promise<void> {
  try {
    logger.info('Starting MultiversX MCP Server...');
    
    const server = await createServer();
    const transport = new StdioServerTransport();
    
    await server.connect(transport);
    
    logger.info('MultiversX MCP Server started successfully');
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
}

// Handle graceful shutdown
process.on('SIGINT', () => {
  logger.info('Received SIGINT, shutting down gracefully...');
  process.exit(0);
});

process.on('SIGTERM', () => {
  logger.info('Received SIGTERM, shutting down gracefully...');
  process.exit(0);
});

// Start the server
main().catch((error) => {
  logger.error('Unhandled error in main:', error);
  process.exit(1);
}); 