/**
 * SDK Initialization Resource
 * Provides comprehensive guide for initializing SDK-DAPP v5
 */

import { RESOURCE_URIS } from '../utils/constants.js';
import { logger } from '../utils/logger.js';

export class SDKDappInitResource {
  /**
   * Read SDK initialization guide
   */
  static async read() {
    logger.debug('Reading SDK initialization resource');

    try {
      const initializationGuide = {
        title: 'MultiversX SDK-DAPP v5 Initialization Guide',
        version: '5.x',
        description: 'Complete guide for initializing and configuring sdk-dapp v5 in your MultiversX dApp',
        
        requirements: {
          node: 'Node.js version 20.13.1+',
          npm: 'Npm version 10.5.2+',
          https: 'Application must run on HTTPS (not HTTP) for some providers to work',
        },

        installation: {
          npm: 'npm install @multiversx/sdk-dapp',
          yarn: 'yarn add @multiversx/sdk-dapp',
          coreOnly: {
            description: 'Install core functionality only (without UI components)',
            npmrc: `## .npmrc
@multiversx/sdk-dapp:omit-optional=true
## enable the option when needed with:
## @multiversx/sdk-dapp:omit-optional=false`,
            command: 'npm install'
          }
        },

        basicInitialization: {
          description: 'Basic initialization in your main entry file (e.g., index.tsx)',
          example: `import { initApp } from '@multiversx/sdk-dapp/out/methods/initApp/initApp';
import type { InitAppType } from '@multiversx/sdk-dapp/out/methods/initApp/initApp.types';
import { EnvironmentsEnum } from '@multiversx/sdk-dapp/out/types/enums.types';
import { App } from "./App";

const config: InitAppType = {
  storage: { getStorageCallback: () => sessionStorage },
  dAppConfig: {
    environment: EnvironmentsEnum.devnet,
    successfulToastLifetime: 5000
  }
};

initApp(config).then(() => {
  render(() => <App />, root!); // render your app
});`,
          note: 'Call initApp() before rendering your application to ensure sdk-dapp internal functions are initialized'
        },

        advancedConfiguration: {
          description: 'Advanced configuration options for production environments',
          example: `const config: InitAppType = {
  storage: { 
    getStorageCallback: () => localStorage // or sessionStorage
  },
  dAppConfig: {
    // Enable native authentication (optional)
    nativeAuth: true,
    
    // Set environment
    environment: EnvironmentsEnum.mainnet, // devnet, testnet, mainnet
    
    // Override network configuration (optional)
    network: {
      walletAddress: 'https://wallet.multiversx.com',
      explorerAddress: 'https://explorer.multiversx.com',
      apiAddress: 'https://api.multiversx.com'
    },
    
    // Toast notification settings
    successfulToastLifetime: 5000,
    
    // Custom app metadata
    appName: 'My MultiversX DApp',
    appVersion: '1.0.0'
  },
  
  // Add custom signing providers (optional)
  customProviders: [myCustomProvider]
};`,
          environments: {
            mainnet: 'EnvironmentsEnum.mainnet - Production network',
            testnet: 'EnvironmentsEnum.testnet - Testing network',
            devnet: 'EnvironmentsEnum.devnet - Development network'
          }
        },

        storageConfiguration: {
          description: 'Configure storage mechanism for persisting user sessions',
          options: {
            sessionStorage: {
              description: 'Data persists only for the browser session',
              example: 'storage: { getStorageCallback: () => sessionStorage }'
            },
            localStorage: {
              description: 'Data persists across browser sessions',
              example: 'storage: { getStorageCallback: () => localStorage }'
            },
            custom: {
              description: 'Implement custom storage mechanism',
              example: `storage: { 
  getStorageCallback: () => ({
    getItem: (key) => { /* custom get */ },
    setItem: (key, value) => { /* custom set */ },
    removeItem: (key) => { /* custom remove */ }
  })
}`
            }
          }
        },

        customProviders: {
          description: 'Add custom signing providers to extend wallet support',
          steps: [
            '1. Create a custom provider implementing the IProvider interface',
            '2. Include it in the customProviders array during initialization',
            '3. Use ProviderFactory.create() to instantiate and login'
          ],
          example: `// 1. Define custom provider
const ADDITIONAL_PROVIDERS = {
  myCustomProvider: 'myCustomProvider'
} as const;

// 2. Initialize with custom provider
const config: InitAppType = {
  // ... other config
  customProviders: [myCustomProvider]
};

// 3. Use the custom provider
const provider = await ProviderFactory.create({
  type: 'myCustomProvider'
});
await provider?.login();`
        },

        transactionTracking: {
          description: 'Enable transaction tracking without user login (for server-sent transactions)',
          example: `import { trackTransactions } from '@multiversx/sdk-dapp/out/methods/trackTransactions/trackTransactions';

initApp(config).then(async () => {
  // Enable tracking before user login for server-sent transactions
  await trackTransactions();
  render(() => <App />, root!);
});`
        },

        nextSteps: {
          description: 'After initialization, you can proceed with:',
          steps: [
            '1. Provider interaction - Logging in and out, signing transactions/messages',
            '2. Presenting data - Get store data (balance, address, etc.) using hooks or selectors',
            '3. Transactions - Sending, tracking, and displaying transaction history',
            '4. UI Components - Use @multiversx/sdk-dapp-ui for pre-built components'
          ]
        },

        commonPatterns: {
          reactHooks: {
            description: 'Access app state using React hooks',
            examples: [
              'useGetAccount() - Get account data (address, balance, nonce)',
              'useGetLoginInfo() - Get login data (accessToken, provider type)',
              'useGetNetworkConfig() - Get network info (chainId, egldLabel)',
              'useGetTransactionSessions() - Get transaction sessions'
            ]
          },
          selectors: {
            description: 'Access app state using selectors (for non-React frameworks)',
            examples: [
              'getAccount() - Get account data',
              'getNetworkConfig() - Get network configuration',
              'Store subscriptions for reactive updates'
            ]
          }
        },

        troubleshooting: {
          httpsRequirement: 'Ensure your app runs on HTTPS - some wallet providers require secure connections',
          storageIssues: 'Check browser storage permissions and available space',
          networkConfiguration: 'Verify network configuration matches your target environment',
          providerCompatibility: 'Ensure wallet providers are compatible with your target networks'
        },

        documentation: {
          repository: 'https://github.com/multiversx/mx-sdk-dapp',
          templateDapp: 'https://github.com/multiversx/mx-template-dapp',
          migrationGuide: 'Available for transitioning from sdk-dapp@4.x to v5',
          liveDemo: 'https://template-dapp.multiversx.com/'
        },

        generatedAt: new Date().toISOString(),
        lastUpdated: new Date().toISOString()
      };

      return {
        contents: [{
          uri: RESOURCE_URIS.SDK_DAPP_INIT,
          mimeType: 'application/json',
          text: JSON.stringify(initializationGuide, null, 2),
        }],
      };

    } catch (error) {
      logger.error('Error generating SDK initialization guide:', error);

      const errorInfo = {
        error: {
          message: error instanceof Error ? error.message : 'Unknown error occurred',
          timestamp: new Date().toISOString(),
        },
        message: 'Failed to generate SDK initialization guide. Please check the logs for more details.',
        fallbackDocumentation: {
          repository: 'https://github.com/multiversx/mx-sdk-dapp',
          templateDapp: 'https://github.com/multiversx/mx-template-dapp'
        }
      };

      return {
        contents: [{
          uri: RESOURCE_URIS.SDK_DAPP_INIT,
          mimeType: 'application/json',
          text: JSON.stringify(errorInfo, null, 2),
        }],
      };
    }
  }
} 