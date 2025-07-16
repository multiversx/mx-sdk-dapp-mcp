import { logger } from '../utils/logger.js';
import { ERROR_CODES } from '../utils/constants.js';
import puppeteer, { Browser, Page, LaunchOptions } from 'puppeteer';
import * as cheerio from 'cheerio';
import { promises as fs } from 'fs';
import { sleep } from '../utils/sleep.js';

/**
 * Configuration interface for web scraper
 */
interface WebScraperConfig {
  baseUrl: string;
  maxPages?: number;
  timeout?: number;
  retries?: number;
  delay?: number;
  userAgent?: string;
  headless?: boolean;
  viewport?: { width: number; height: number };
  captchaHandling?: boolean;
  outputFormat?: 'markdown' | 'json' | 'html';
}

/**
 * Scraped page data structure
 */
interface ScrapedPage {
  url: string;
  title: string;
  content: string;
  metadata: {
    timestamp: string;
    wordCount: number;
    links: string[];
  };
  section?: string;
  subsection?: string;
}

/**
 * Scraping result structure
 */
interface ScrapingResult {
  success: boolean;
  data?: ScrapedPage[];
  error?: string;
  totalPages: number;
  processingTime: number;
}

/**
 * Main web scraper class
 */
export class DocumentationScraper {
  private browser: Browser | null = null;
  private config: WebScraperConfig;
  private visitedUrls: Set<string> = new Set();
  private scrapedPages: ScrapedPage[] = [];

  constructor(config: WebScraperConfig) {
    this.config = {
      maxPages: 50,
      timeout: 30000,
      retries: 3,
      delay: 1000,
      userAgent:
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      headless: true,
      viewport: { width: 1920, height: 1080 },
      captchaHandling: true,
      outputFormat: 'markdown',
      ...config,
    };
  }

  /**
   * Initialize browser with stealth settings
   */
  private async initializeBrowser(): Promise<void> {
    const launchOptions: LaunchOptions = {
      headless: this.config.headless,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--no-first-run',
        '--no-zygote',
        '--single-process',
        '--disable-gpu',
        '--disable-background-timer-throttling',
        '--disable-backgrounding-occluded-windows',
        '--disable-renderer-backgrounding',
        '--disable-features=TranslateUI',
        '--disable-extensions',
        '--disable-default-apps',
        '--disable-sync',
        '--disable-translate',
        '--hide-scrollbars',
        '--mute-audio',
        '--no-default-browser-check',
        '--disable-plugins',
        '--disable-plugins-discovery',
        '--disable-preconnect',
      ],
    };

    this.browser = await puppeteer.launch(launchOptions);
    logger.info('Browser initialized successfully');
  }

  /**
   * Setup page with stealth configurations
   */
  private async setupPage(page: Page): Promise<void> {
    // Set viewport
    await page.setViewport(this.config.viewport!);

    // Set user agent
    await page.setUserAgent(this.config.userAgent!);

    // Set extra headers
    await page.setExtraHTTPHeaders({
      'Accept-Language': 'en-US,en;q=0.9',
      'Accept-Encoding': 'gzip, deflate, br',
      Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
      Connection: 'keep-alive',
      'Upgrade-Insecure-Requests': '1',
    });

    // Remove webdriver property
    await page.evaluateOnNewDocument(() => {
      Object.defineProperty(navigator, 'webdriver', {
        get: () => undefined,
      });
    });

    // Add stealth modifications
    await page.evaluateOnNewDocument(() => {
      // Mock plugins
      Object.defineProperty(navigator, 'plugins', {
        get: () => [1, 2, 3, 4, 5],
      });

      // Mock languages
      Object.defineProperty(navigator, 'languages', {
        get: () => ['en-US', 'en'],
      });

      // Mock permissions
      const originalQuery = window.navigator.permissions.query;
      window.navigator.permissions.query = (parameters) => {
        if (parameters.name === 'notifications') {
          // Map Notification.permission to PermissionState
          let state = Notification.permission;
          if (state === 'default') state = 'granted';
          return Promise.resolve({
            state, // now always 'granted', 'denied', or 'prompt'
            onchange: null,
            addEventListener: () => {},
            removeEventListener: () => {},
            dispatchEvent: () => false,
            name: 'notifications',
          });
        }
        return originalQuery(parameters);
      };
    });
  }

  /**
   * Handle CAPTCHA challenges
   */
  private async handleCaptcha(page: Page): Promise<boolean> {
    try {
      // Wait for potential CAPTCHA elements
      await sleep(2000);

      // Check for common CAPTCHA selectors
      const captchaSelectors = [
        'iframe[src*="recaptcha"]',
        '.g-recaptcha',
        '[data-sitekey]',
        '.captcha',
        '.hcaptcha',
        '.cf-challenge-form',
        'form[action*="challenge"]',
      ];

      for (const selector of captchaSelectors) {
        const element = await page.$(selector);
        if (element) {
          logger.warn(`CAPTCHA detected: ${selector}`);

          if (this.config.captchaHandling) {
            // Try to solve or wait for manual intervention
            await this.solveCaptcha(page, selector);
            return true;
          } else {
            throw new Error(`CAPTCHA detected but handling disabled: ${selector}`);
          }
        }
      }

      return false;
    } catch (error) {
      logger.error('CAPTCHA handling failed:', error);
      return false;
    }
  }

  /**
   * Attempt to solve CAPTCHA (simplified implementation)
   */
  private async solveCaptcha(page: Page, selector: string): Promise<void> {
    logger.info(`Attempting to solve CAPTCHA: ${selector}`);

    // For image-based CAPTCHAs, we'd need to implement image recognition
    // For now, we'll wait and hope for manual intervention or retry
    await sleep(5000);

    // Check if CAPTCHA is still present
    const stillPresent = await page.$(selector);
    if (stillPresent) {
      // In production, you might want to:
      // 1. Use a CAPTCHA solving service
      // 2. Implement manual intervention
      // 3. Use different IP/session
      logger.warn('CAPTCHA still present, continuing with caution');
    }
  }

  /**
   * Extract page content using Cheerio
   */
  private async extractPageContent(html: string, url: string): Promise<ScrapedPage> {
    const $ = cheerio.load(html);

    // Remove script and style tags
    $('script, style, noscript').remove();

    // Extract title
    const title = $('h1').first().text().trim() || $('title').text().trim() || 'Untitled Page';

    // Extract main content
    const contentSelectors = [
      'main',
      '[role="main"]',
      '.content',
      '.main-content',
      '.article-content',
      '.post-content',
      '.entry-content',
      'article',
    ];

    let content = '';
    for (const selector of contentSelectors) {
      const element = $(selector);
      if (element.length > 0) {
        content = element.html() || '';
        break;
      }
    }

    // Fallback to body content if no main content found
    if (!content) {
      content = $('body').html() || '';
    }

    // Clean up content
    const cleanContent = $(content).text().trim();

    // Extract links
    const links: string[] = [];
    $('a[href]').each((_, element) => {
      const href = $(element).attr('href');
      if (href) {
        const absoluteUrl = new URL(href, url).href;
        links.push(absoluteUrl);
      }
    });

    // Extract section information
    const breadcrumbs = $('.breadcrumb, .breadcrumbs, nav[aria-label="breadcrumb"]');
    const section = breadcrumbs.find('li').eq(-2).text().trim();
    const subsection = breadcrumbs.find('li').eq(-1).text().trim();

    return {
      url,
      title,
      content: cleanContent,
      metadata: {
        timestamp: new Date().toISOString(),
        wordCount: cleanContent.split(/\s+/).length,
        links: [...new Set(links)],
      },
      section,
      subsection,
    };
  }

  /**
   * Navigate to page with retry logic
   */
  private async navigateToPage(page: Page, url: string): Promise<void> {
    let retries = 0;

    while (retries < this.config.retries!) {
      try {
        logger.info(`Navigating to: ${url} (attempt ${retries + 1})`);

        await page.goto(url, {
          waitUntil: 'domcontentloaded',
          timeout: this.config.timeout,
        });

        // Wait for page to stabilize
        await sleep(this.config.delay!);

        // Handle CAPTCHA if present
        await this.handleCaptcha(page);

        // Check if navigation was successful
        const currentUrl = page.url();
        if (currentUrl.includes('error') || currentUrl.includes('404')) {
          throw new Error(`Navigation failed: ${currentUrl}`);
        }

        return;
      } catch (error) {
        retries++;
        logger.warn(`Navigation failed (attempt ${retries}): ${error}`);

        if (retries >= this.config.retries!) {
          throw error;
        }

        // Wait before retry
        await sleep(this.config.delay! * retries);
      }
    }
  }

  /**
   * Get pagination links from current page
   */
  private async getPaginationLinks(page: Page): Promise<string[]> {
    const links = await page.evaluate(() => {
      const paginationSelectors = [
        'a[href*="/page/"]',
        'a[href*="page="]',
        '.pagination a',
        '.pager a',
        'nav a',
        'a[href*="next"]',
        'a[rel="next"]',
      ];

      const foundLinks: string[] = [];

      for (const selector of paginationSelectors) {
        const elements = document.querySelectorAll(selector);
        elements.forEach((element) => {
          const href = (element as HTMLAnchorElement).href;
          if (href && !foundLinks.includes(href)) {
            foundLinks.push(href);
          }
        });
      }

      return foundLinks;
    });

    return links.filter(
      (link) => link.startsWith(this.config.baseUrl) && !this.visitedUrls.has(link),
    );
  }

  /**
   * Scrape single page
   */
  private async scrapePage(url: string): Promise<ScrapedPage | null> {
    if (this.visitedUrls.has(url)) {
      return null;
    }

    const page = await this.browser!.newPage();

    try {
      await this.setupPage(page);
      await this.navigateToPage(page, url);

      // Mark as visited
      this.visitedUrls.add(url);

      // Get page HTML
      const html = await page.content();

      // Extract content
      const scrapedPage = await this.extractPageContent(html, url);

      logger.info(`Successfully scraped: ${url}`);
      return scrapedPage;
    } catch (error) {
      logger.error(`Failed to scrape ${url}:`, error);
      return null;
    } finally {
      await page.close();
    }
  }

  /**
   * Main scraping method
   */
  public async scrape(startUrl: string): Promise<ScrapingResult> {
    const startTime = Date.now();

    try {
      await this.initializeBrowser();

      const urlsToScrape = [startUrl];
      let processedCount = 0;

      while (urlsToScrape.length > 0 && processedCount < this.config.maxPages!) {
        const currentUrl = urlsToScrape.shift()!;

        const scrapedPage = await this.scrapePage(currentUrl);
        if (scrapedPage) {
          this.scrapedPages.push(scrapedPage);

          // Get pagination links for further scraping
          const page = await this.browser!.newPage();
          try {
            await this.setupPage(page);
            await this.navigateToPage(page, currentUrl);

            const paginationLinks = await this.getPaginationLinks(page);
            urlsToScrape.push(...paginationLinks);
          } finally {
            await page.close();
          }
        }

        processedCount++;
      }

      const endTime = Date.now();

      return {
        success: true,
        data: this.scrapedPages,
        totalPages: this.scrapedPages.length,
        processingTime: endTime - startTime,
      };
    } catch (error) {
      logger.error('Scraping failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        totalPages: this.scrapedPages.length,
        processingTime: Date.now() - startTime,
      };
    } finally {
      if (this.browser) {
        await this.browser.close();
      }
    }
  }

  /**
   * Export scraped data to file
   */
  public async exportData(filePath: string): Promise<void> {
    const data = {
      timestamp: new Date().toISOString(),
      totalPages: this.scrapedPages.length,
      pages: this.scrapedPages,
    };

    await fs.writeFile(filePath, JSON.stringify(data, null, 2));
    logger.info(`Data exported to: ${filePath}`);
  }
}

/**
 * Handle web scraper tool requests
 */
export async function handleWebScraperTool(args: {
  url: string;
  section?: string;
  maxPages?: number;
  outputFormat?: 'markdown' | 'json' | 'html';
}): Promise<{ content: Array<{ type: string; text: string }> }> {
  try {
    logger.debug('Web scraper tool called with args:', args);

    const config: WebScraperConfig = {
      baseUrl: new URL(args.url).origin,
      maxPages: args.maxPages || 10,
      outputFormat: args.outputFormat || 'markdown',
    };

    const scraper = new DocumentationScraper(config);
    const result = await scraper.scrape(args.url);

    if (!result.success) {
      throw new Error(result.error || 'Scraping failed');
    }

    let content = '';

    if (args.section) {
      // Filter by section if specified
      const sectionLower = args.section.toLowerCase();
      const allPages = result.data || [];
      // Try exact or substring match (case-insensitive) on section or title
      let sectionPages = allPages.filter(
        (page) =>
          (page.section && page.section.toLowerCase().includes(sectionLower)) ||
          page.title.toLowerCase().includes(sectionLower),
      );

      // If not found, try fuzzy match (Levenshtein distance or similar)
      if (sectionPages.length === 0) {
        // Collect all unique section and title names
        const availableSections = [
          ...new Set(
            allPages
              .map((page) => [page.section, page.title])
              .flat()
              .filter(Boolean),
          ),
        ];
        // Try to find the closest match (simple substring or startsWith)
        const similar = availableSections
          .filter((name): name is string => typeof name === 'string' && !!name)
          .filter(
            (name) =>
              name.toLowerCase().includes(sectionLower) ||
              sectionLower.includes(name.toLowerCase()) ||
              name.toLowerCase().startsWith(sectionLower),
          );
        if (similar.length > 0) {
          content = `Section "${args.section}" not found. Did you mean: ${similar
            .map((s) => `"${s}"`)
            .join(', ')}?\n\nAvailable sections: ${availableSections
            .map((s) => `"${s}"`)
            .join(', ')}`;
        } else {
          content = `Section "${
            args.section
          }" not found in scraped content.\n\nAvailable sections: ${availableSections
            .map((s) => `"${s}"`)
            .join(', ')}`;
        }
      } else {
        content = sectionPages
          .map((page) => `# ${page.title}\n\n${page.content}`)
          .join('\n\n---\n\n');
      }
    } else {
      // Return all content
      content =
        result.data?.map((page) => `# ${page.title}\n\n${page.content}`).join('\n\n---\n\n') ||
        'No content found';
    }

    // Add metadata
    const metadata = `\n\n---\n\n**Scraping Results:**\n- Total pages: ${
      result.totalPages
    }\n- Processing time: ${result.processingTime}ms\n- Timestamp: ${new Date().toISOString()}`;

    return {
      content: [
        {
          type: 'text',
          text: content + metadata,
        },
      ],
    };
  } catch (error) {
    logger.error('Web scraper tool execution failed:', error);
    throw {
      code: ERROR_CODES.TOOL_EXECUTION_ERROR,
      message: `Web scraper failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
    };
  }
}
