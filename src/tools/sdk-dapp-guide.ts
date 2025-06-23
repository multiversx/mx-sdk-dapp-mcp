import { logger } from '../utils/logger.js';

const REMOTE_GUIDE_URL =
  'https://raw.githubusercontent.com/multiversx/mx-sdk-dapp/refs/heads/main/README.md';

/**
 * Extracts a section from markdown text by header name (case-insensitive, matches closest ## or ### header)
 */
function extractSection(markdown: string, section: string): string | null {
  const lines = markdown.split('\n');
  const sectionPattern = new RegExp(
    `^#{2,3}\\s+${section.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`,
    'i',
  );
  let startIdx = -1;
  let endIdx = lines.length;

  // Find the start of the section
  for (let i = 0; i < lines.length; i++) {
    if (sectionPattern.test(lines[i].trim())) {
      startIdx = i;
      break;
    }
  }
  if (startIdx === -1) return null;

  // Find the next section header of the same or higher level
  const currentHeaderLevel = (lines[startIdx].match(/^#+/) || [''])[0].length;
  for (let i = startIdx + 1; i < lines.length; i++) {
    const match = lines[i].match(/^(#{2,})\s+/);
    if (match && match[1].length <= currentHeaderLevel) {
      endIdx = i;
      break;
    }
  }
  return lines.slice(startIdx, endIdx).join('\n').trim();
}

/**
 * Fetches the latest MultiversX SDK-DAPP v5 guide from the remote README.md
 * If args.section is provided, returns only that section.
 */
export async function handleSdkDappGuide(args?: { section?: string }): Promise<{
  content: Array<{ type: string; text: string }>;
}> {
  try {
    logger.debug(`Fetching SDK-DAPP guide from remote: ${REMOTE_GUIDE_URL}`);
    const response = await fetch(REMOTE_GUIDE_URL);
    if (!response.ok) {
      throw new Error(`Failed to fetch guide: ${response.status} ${response.statusText}`);
    }
    const text = await response.text();
    if (args?.section) {
      const sectionContent = extractSection(text, args.section);
      if (!sectionContent) {
        return {
          content: [
            {
              type: 'text',
              text: `Section not found: ${args.section}`,
            },
          ],
        };
      }
      return {
        content: [
          {
            type: 'text',
            text: sectionContent,
          },
        ],
      };
    }
    return {
      content: [
        {
          type: 'text',
          text,
        },
      ],
    };
  } catch (error) {
    logger.error('Error fetching SDK-DAPP guide:', error);
    throw error;
  }
}
