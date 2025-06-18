/**
 * SDK-DAPP v5 Guide Resource
 * Provides comprehensive information about MultiversX SDK-DAPP v5
 */

import { ReadResourceResult } from '@modelcontextprotocol/sdk/types.js';
import { logger } from '../utils/logger.js';

export interface SDKDappSection {
  title: string;
  description: string;
  content: string;
  codeExamples?: string[];
}

export interface SDKDappGuideData {
  overview: SDKDappSection;
  installation: SDKDappSection;
  configuration: SDKDappSection;
  providerInteraction: SDKDappSection;
  displayingData: SDKDappSection;
  transactions: SDKDappSection;
  internalStructure: SDKDappSection;
  network: SDKDappSection;
  providers: SDKDappSection;
  account: SDKDappSection;
  transactionManager: SDKDappSection;
  uiComponents: SDKDappSection;
  debugging: SDKDappSection;
}

export class SDKDappGuideResource {
  private static readonly guideData: SDKDappGuideData = {
    overview: {
      title: 'Overview',
      description: 'Introduction to MultiversX SDK-DAPP v5',
      content: `
MultiversX SDK-DAPP is a comprehensive library for building decentralized applications on the MultiversX blockchain.
It provides core functional logic for creating dApps with any JavaScript framework including React, Angular, Vue, 
Next.js, React Native, and more.

Key Features:
- Provider abstraction for wallet interactions
- Transaction management and tracking
- Account management and authentication
- Built-in UI components
- Network configuration management
- Store-based state management with Zustand

Architecture:
sdk-dapp acts as a middleware between signing providers & APIs and your dApp, abstracting complex blockchain interactions.
      `,
      codeExamples: [],
    },

    installation: {
      title: 'Installation',
      description: 'How to install and set up SDK-DAPP v5',
      content: `
Requirements:
- Node.js version 20.13.1+
- Npm version 10.5.2+

Installation options:
1. Full installation (with UI components)
2. Core-only installation (without UI components)

For core-only installation, create a .npmrc file to skip UI dependencies.
Important: Run your app on HTTPS, not HTTP, as some providers require secure connections.
      `,
      codeExamples: [
        'npm install @multiversx/sdk-dapp',
        'yarn add @multiversx/sdk-dapp',
        `// .npmrc for core-only installation
@multiversx/sdk-dapp:omit-optional=true`,
      ],
    },

    configuration: {
      title: 'Configuration',
      description: 'Setting up storage, network, and providers',
      content: `
Configuration is done through the initApp method, typically called in index.tsx before app rendering.

Configuration includes:
- Storage configuration (sessionStorage, localStorage)
- Chain configuration (environment, network parameters)
- Custom provider configuration
- Toast notification settings
      `,
      codeExamples: [
        `import { initApp } from '@multiversx/sdk-dapp/out/methods/initApp/initApp';
import type { InitAppType } from '@multiversx/sdk-dapp/out/methods/initApp/initApp.types';
import { EnvironmentsEnum } from '@multiversx/sdk-dapp/out/types/enums.types';

const config: InitAppType = {
  storage: { getStorageCallback: () => sessionStorage },
  dAppConfig: {
    environment: EnvironmentsEnum.devnet,
    successfulToastLifetime: 5000
  }
};

initApp(config).then(() => {
  render(() => <App />, root!);
});`,
      ],
    },

    providerInteraction: {
      title: 'Provider Interaction',
      description: 'Logging in and out with different wallet providers',
      content: `
Two main approaches for user authentication:
1. UnlockPanelManager - Provides UI for all supported providers
2. ProviderFactory - Programmatic login with specific providers

The UnlockPanelManager offers a side panel with all available providers.
ProviderFactory allows custom UI implementations and direct provider selection.
      `,
      codeExamples: [
        `// Using UnlockPanelManager
import { UnlockPanelManager } from '@multiversx/sdk-dapp/out/managers/UnlockPanelManager';

const unlockPanelManager = UnlockPanelManager.init({
  loginHandler: () => navigate('/dashboard'),
  onClose: () => navigate('/')
});

const handleConnect = () => {
  unlockPanelManager.openUnlockPanel();
};`,
        `// Using ProviderFactory
import { ProviderTypeEnum } from '@multiversx/sdk-dapp/out/providers/types/providerFactory.types';

const provider = await ProviderFactory.create({
  type: ProviderTypeEnum.extension
});
await provider.login();`,
      ],
    },

    displayingData: {
      title: 'Displaying App Data',
      description: 'Accessing and displaying user and network data',
      content: `
SDK-DAPP provides both React hooks and store selectors for accessing data:

React Hooks (for React apps):
- useGetAccount() - Access account data (address, balance, nonce)
- useGetLoginInfo() - Access login data (accessToken, provider type)
- useGetNetworkConfig() - Access network information
- useSelector() - Query store via selectors
- useGetTransactionSessions() - Access transaction sessions

Store Selectors (for non-React frameworks):
- getAccount() - Get account data
- getNetworkConfig() - Get network configuration
- Store subscriptions for live updates
      `,
      codeExamples: [
        `// React hooks usage
import { useGetAccount } from '@multiversx/sdk-dapp/out/react/account/useGetAccount';
import { useGetNetworkConfig } from '@multiversx/sdk-dapp/out/react/network/useGetNetworkConfig';

const account = useGetAccount();
const { network: { egldLabel } } = useGetNetworkConfig();

console.log(account.address);
console.log(\`\${account.balance} \${egldLabel}\`);`,
        `// Store selectors usage
import { getAccount } from '@multiversx/sdk-dapp/out/methods/account/getAccount';
import { getNetworkConfig } from '@multiversx/sdk-dapp/out/methods/network/getNetworkConfig';

const account = getAccount();
const { egldLabel } = getNetworkConfig();`,
      ],
    },

    transactions: {
      title: 'Transactions',
      description: 'Creating, signing, sending, and tracking transactions',
      content: `
Transaction workflow consists of:
1. Creating Transaction objects
2. Signing with initialized provider
3. Sending via TransactionManager
4. Tracking status and displaying feedback

Supports both parallel and batch (sequential) transaction execution.
Built-in tracking with WebSocket or polling fallback.
Toast notifications for user feedback.
      `,
      codeExamples: [
        `// Creating and signing transactions
import { Address, Transaction, TransactionPayload } from '@multiversx/sdk-core';
import { getAccountProvider } from '@multiversx/sdk-dapp/out/providers/helpers/accountProvider';

const transaction = new Transaction({
  value: BigInt(0),
  data: new TransactionPayload('pong'),
  receiver: Address.newFromBech32(contractAddress),
  gasLimit: BigInt(GAS_LIMIT),
  gasPrice: BigInt(GAS_PRICE),
  chainID: network.chainId,
  nonce: BigInt(account.nonce),
  sender: Address.newFromBech32(account.address),
  version: 1
});

const provider = getAccountProvider();
const signedTransactions = await provider.signTransactions([transaction]);`,
        `// Sending and tracking
import { TransactionManager } from '@multiversx/sdk-dapp/out/managers/TransactionManager';

const txManager = TransactionManager.getInstance();
const sentTransactions = await txManager.send(signedTransactions);

const sessionId = await txManager.track(sentTransactions, {
  transactionsDisplayInfo: {
    processingMessage: 'Processing transactions',
    errorMessage: 'Transaction failed',
    successMessage: 'Transaction successful'
  }
});`,
      ],
    },

    internalStructure: {
      title: 'Internal Structure',
      description: 'Understanding SDK-DAPP architecture and organization',
      content: `
SDK-DAPP is organized into several key modules:

Business Logic:
- apiCalls/ - API interaction methods
- constants/ - Ecosystem constants
- providers/ - Signing providers
- methods/ - Store utility functions

Persistence Layer:
- store/ - Zustand-based state management

UI Layer:
- @multiversx/sdk-dapp-ui package (webcomponents)
- controllers/ - UI business logic
- managers/ - Store-bound UI logic

The architecture follows a clear separation of concerns with business logic, 
persistence, and UI layers.
      `,
      codeExamples: [],
    },

    network: {
      title: 'Network Configuration',
      description: 'Managing blockchain network settings',
      content: `
Network configuration is handled in the initApp method.
Supports environment-based configuration (devnet, testnet, mainnet).
Allows overriding specific network parameters like wallet address, explorer address.
Network configuration is stored in the network slice of the store.

Access network parameters using getNetworkConfig method or useGetNetworkConfig hook.
      `,
      codeExamples: [
        `// Network configuration in initApp
const config: InitAppType = {
  dAppConfig: {
    environment: EnvironmentsEnum.devnet,
    network: {
      walletAddress: 'https://devnet-wallet.multiversx.com'
    }
  }
};`,
      ],
    },

    providers: {
      title: 'Signing Providers',
      description: 'Managing wallet providers and creating custom providers',
      content: `
Provider system supports:
- Built-in providers (extension, web wallet, ledger, etc.)
- Custom provider creation
- Provider initialization and session restoration
- Provider-specific methods (login, logout, signTransactions, signMessage)

Custom providers must implement the IProvider interface.
Providers can be registered via customProviders array or window object.
      `,
      codeExamples: [
        `// Creating custom provider
const ADDITIONAL_PROVIDERS = {
  myCustomProvider: 'myCustomProvider'
} as const;

const ExtendedProviders = {
  ...ProviderTypeEnum,
  ...ADDITIONAL_PROVIDERS
} as const;

const provider = await ProviderFactory.create({
  type: ExtendedProviders.myCustomProvider
});
await provider?.login();`,
      ],
    },

    account: {
      title: 'Account Management',
      description: 'Managing user account data and nonce',
      content: `
Account management includes:
- Fetching account data from API
- Storing data in the store
- Providing access methods and hooks
- Automatic nonce management

Key functions:
- getAccount() / useGetAccount()
- getAddress() / useGetAddress() 
- getIsLoggedIn() / useGetIsLoggedIn()
- getLatestNonce() / useGetLatestNonce()
- refreshAccount() for syncing with API

SDK-DAPP handles nonce incrementation automatically for new transactions.
      `,
      codeExamples: [
        `// Account data access
import { getAccount } from '@multiversx/sdk-dapp/out/methods/account/getAccount';
import { refreshAccount } from '@multiversx/sdk-dapp/out/utils/account/refreshAccount';

const account = getAccount();
await refreshAccount(); // sync with API`,
      ],
    },

    transactionManager: {
      title: 'Transaction Manager',
      description: 'Comprehensive transaction handling and tracking',
      content: `
TransactionManager features:
- Single and batch transaction support
- Automatic status tracking via WebSocket/polling
- Toast notifications with customizable messages
- Error handling and recovery
- Session-based transaction grouping

Transaction lifecycle:
1. Create Transaction objects
2. Sign with provider
3. Send via TransactionManager.send()
4. Track via TransactionManager.track()
5. Monitor status via store selectors

Supports both parallel execution and sequential batch execution.
      `,
      codeExamples: [
        `// Parallel transactions
const parallelTx = [tx1, tx2, tx3];
const sent = await txManager.send(parallelTx);

// Batch transactions (sequential)
const batchTx = [[tx1, tx2], [tx3]];
const sent = await txManager.send(batchTx);

// Tracking without login
await trackTransactions(); // enable before user login
const plainTx = { ...transaction.toPlainObject(), hash };
await txManager.track([plainTx]);`,
      ],
    },

    uiComponents: {
      title: 'UI Components',
      description: 'Working with webcomponents and UI controllers',
      content: `
SDK-DAPP uses webcomponents from @multiversx/sdk-dapp-ui package.

Component types:
1. Public components - controlled by dApp
   - MvxTransactionsTable (via TransactionsTableController)
   - MvxFormatAmount (via FormatAmountController)

2. Internal components - controlled by SDK-DAPP
   - Login/logout flows
   - Provider interactions
   - Notification toasts

Internal components use EventBus pattern for communication.
Custom implementations can follow the same API patterns.
      `,
      codeExamples: [
        `// Using TransactionsTable
import { TransactionsTableController } from '@multiversx/sdk-dapp/out/controllers/TransactionsTableController';
import { MvxTransactionsTable } from '@multiversx/sdk-dapp-ui/react';

const processedTransactions = await TransactionsTableController.processTransactions({
  address,
  egldLabel: network.egldLabel,
  explorerAddress: network.explorerAddress,
  transactions
});

<MvxTransactionsTable transactions={processedTransactions} />;`,
        `// Custom toast creation
import { createCustomToast } from '@multiversx/sdk-dapp/out/store/actions/toasts/toastsActions';

createCustomToast({
  toastId: 'custom-toast',
  icon: 'times',
  iconClassName: 'warning',
  message: 'This is a custom toast',
  title: 'My custom toast'
});`,
      ],
    },

    debugging: {
      title: 'Debugging',
      description: 'Development and debugging practices',
      content: `
Recommended debugging approaches:
1. Use lerna for local development
2. npm link with preserveSymlinks option
3. Build library with npm run build
4. Run unit tests with npm test

For server configuration when using npm link, ensure preserveSymlinks is enabled
in the resolve configuration to prevent module resolution issues.

Monitor store state changes and transaction sessions for debugging transaction flows.
      `,
      codeExamples: [
        `// Server config for npm link
resolve: {
  preserveSymlinks: true,
  alias: {
    src: "/src",
  },
}`,
        `// Debugging transaction sessions
import { getStore } from '@multiversx/sdk-dapp/out/store/store';
import { transactionsSliceSelector } from '@multiversx/sdk-dapp/out/store/selectors/transactionsSelector';

const state = transactionsSliceSelector(getStore());
Object.entries(state).forEach(([sessionKey, data]) => {
  console.log(\`Session \${sessionKey}: \${data.status}\`);
});`,
      ],
    },
  };

  /**
   * Read the SDK-DAPP guide resource
   */
  static async read(): Promise<ReadResourceResult> {
    try {
      logger.debug('Reading SDK-DAPP guide resource');

      const resourceContent = {
        guide: this.guideData,
        metadata: {
          version: 'v5',
          lastUpdated: new Date().toISOString(),
          sections: Object.keys(this.guideData),
          totalSections: Object.keys(this.guideData).length,
        },
      };

      return {
        contents: [
          {
            uri: 'mx://sdk-dapp-guide',
            mimeType: 'application/json',
            text: JSON.stringify(resourceContent, null, 2),
          },
        ],
      };
    } catch (error) {
      logger.error('Error reading SDK-DAPP guide resource:', error);
      throw error;
    }
  }

  /**
   * Get a specific section of the guide
   */
  static getSection(sectionName: keyof SDKDappGuideData): SDKDappSection | null {
    return this.guideData[sectionName] || null;
  }

  /**
   * Search for content within the guide
   */
  static search(query: string): SDKDappSection[] {
    const results: SDKDappSection[] = [];
    const searchQuery = query.toLowerCase();

    Object.values(this.guideData).forEach((section) => {
      if (
        section.title.toLowerCase().includes(searchQuery) ||
        section.description.toLowerCase().includes(searchQuery) ||
        section.content.toLowerCase().includes(searchQuery)
      ) {
        results.push(section);
      }
    });

    return results;
  }

  /**
   * Get all available sections
   */
  static getSections(): string[] {
    return Object.keys(this.guideData);
  }
}
