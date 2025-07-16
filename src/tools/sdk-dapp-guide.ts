import { logger } from '../utils/logger.js';

// Base DeepWiki endpoint (all pages are markdown rendered through RSC)
const DEEPWIKI_BASE_URL = 'https://deepwiki.com/multiversx/mx-sdk-dapp';

// Map of common guide topics -> DeepWiki pathname
// This map allows the tool to correlate human friendly section names with
// the corresponding DeepWiki endpoint. Keep this list in sync with DeepWiki.
// Fallback logic below makes the tool resilient even when a topic is missing.
const TOPIC_TO_PATH: Record<string, string> = {
  // Overview & getting started
  overview: '1-overview',
  'getting-started': '2-getting-started',

  // Installation / configuration
  installation: '2.1-installation-and-setup',
  'installation-and-setup': '2.1-installation-and-setup',
  install: '2.1-installation-and-setup',
  setup: '2.1-installation-and-setup',
  'basic-configuration': '2.2-basic-configuration',
  configuration: '2.2-basic-configuration',

  // Core concepts
  'core-concepts': '3-core-concepts',
  concepts: '3-core-concepts',
  authentication: '3.1-authentication-and-providers',
  'authentication-and-providers': '3.1-authentication-and-providers',
  providers: '3.1-authentication-and-providers',
  'transaction-management': '3.2-transaction-management',
  transactions: '3.2-transaction-management',
  'state-management': '3.3-state-management',
  state: '3.3-state-management',

  // API reference
  'api-reference': '4-api-reference',
  api: '4-api-reference',
  'core-functions': '4.1-core-functions',
  functions: '4.1-core-functions',
  'react-hooks': '4.2-react-hooks',
  hooks: '4.2-react-hooks',
  'provider-types': '4.3-provider-types',
  'transaction-types': '4.4-transaction-types',
  'network-configuration': '4.5-network-configuration',
  network: '4.5-network-configuration',
  'constants-and-utilities': '4.6-constants-and-utilities',
  constants: '4.6-constants-and-utilities',
  utilities: '4.6-constants-and-utilities',

  // Advanced topics
  'advanced-topics': '5-advanced-topics',
  advanced: '5-advanced-topics',
  'native-authentication': '5.1-native-authentication',
  'native-auth': '5.1-native-authentication',
  'webview-integration': '5.2-webview-integration',
  webview: '5.2-webview-integration',
  'custom-providers': '5.3-custom-providers',
  'custom-provider': '5.3-custom-providers',
};

/**
 * Very small slug-ify helper used to normalise user provided section names.
 */
function slugify(str: string): string {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Determine the DeepWiki path that best matches a requested topic/section.
 * Falls back to the overview page when a match is not found.
 */
function resolvePath(section?: string): string {
  if (!section) {
    return '1-overview';
  }

  // If the caller passed what already looks like a DeepWiki path (contains a digit + dash)
  // we optimistically use it as-is. This allows future pages to be accessed without
  // updating this map.
  if (/^\d/.test(section)) {
    return section;
  }

  const slug = slugify(section);
  if (TOPIC_TO_PATH[slug]) {
    return TOPIC_TO_PATH[slug];
  }

  // Attempt to find a fuzzy match by checking if the slug is contained inside any known path slug.
  for (const path of Object.values(TOPIC_TO_PATH)) {
    const pathSlug = slugify(path.replace(/^\d+(?:\.\d+)?-/, '')); // strip numeric prefix
    if (pathSlug.includes(slug) || slug.includes(pathSlug)) {
      return path;
    }
  }

  logger.warn(`Could not map section "${section}" to a DeepWiki page. Falling back to overview.`);
  return '1-overview';
}

/**
 * Extract raw markdown out of DeepWiki's RSC (React Server Components) response.
 * The current heuristic simply finds the first markdown heading ("# ") and
 * returns everything from that point onwards. This keeps the implementation
 * lightweight while still producing clean markdown content for the vast
 * majority of pages.
 */
function extractMarkdownFromDeepWiki(rscText: string): string {
  const match = rscText.match(/(?:^|\n)# .*/s);
  return match ? match[0].trim() : rscText.trim();
}

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
    const path = resolvePath(args?.section);
    const url = `${DEEPWIKI_BASE_URL}/${path}`;

    logger.debug(`Fetching SDK-DAPP guide from DeepWiki: ${url}`);
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch guide: ${response.status} ${response.statusText}`);
    }

    const rawText = await response.text();
    const markdownText = extractMarkdownFromDeepWiki(rawText);

    return {
      content: [
        {
          type: 'text',
          text: markdownText,
        },
      ],
    };
  } catch (error) {
    logger.error('Error fetching SDK-DAPP guide:', error);
    throw error;
  }
}
