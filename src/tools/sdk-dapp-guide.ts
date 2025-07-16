import { logger } from '../utils/logger.js';
import { handleWebScraperTool } from './web-scraper-tool.js';

export async function handleSdkDappGuide(args?: { section?: string }): Promise<{
  content: Array<{ type: string; text: string }>;
}> {
  try {
    logger.debug('Redirecting SDK_DAPP_GUIDE to web scraper tool', args);
    return await handleWebScraperTool({
      url: 'https://deepwiki.com/multiversx/mx-sdk-dapp',
      section: args?.section,
      maxPages: 50,
      outputFormat: 'markdown',
    });
  } catch (error) {
    logger.error('Error executing web scraper for SDK_DAPP_GUIDE:', error);
    throw error;
  }
}
