/**
 * React Hooks Resource
 * Comprehensive guide for using reactive hooks from SDK-DAPP v5
 */

import { RESOURCE_URIS } from '../utils/constants.js';
import { logger } from '../utils/logger.js';

export class SDKDappReactResource {
  /**
   * Read React hooks usage guide
   */
  static async read() {
    logger.debug('Reading React hooks resource');

    try {
      const reactHooksGuide = {
        title: 'MultiversX SDK-DAPP v5 React Hooks Guide',
        version: '5.x',
        description: 'Comprehensive guide for using reactive hooks from sdk-dapp v5 in React applications',
        
        overview: {
          description: 'sdk-dapp v5 provides a set of React hooks for accessing and reacting to MultiversX dApp state, such as account, login, network, and transactions.',
          mainHooks: [
            'useGetAccount - Access account data (address, balance, nonce)',
            'useGetLoginInfo - Access login status and method',
            'useGetNetworkConfig - Access network configuration (chainId, egldLabel)',
            'useGetTransactionSessions - Access all transaction sessions',
            'useSelector - Query the store with custom selectors',
            'useGetPendingTransactionsSessions - Access pending transaction sessions',
            'useGetPendingTransactions - Access pending signed transactions'
          ]
        },

        installation: {
          description: 'Install sdk-dapp and ensure your project is set up for React.',
          npm: 'npm install @multiversx/sdk-dapp',
          yarn: 'yarn add @multiversx/sdk-dapp'
        },

        usage: {
          description: 'Import hooks from @multiversx/sdk-dapp/out/react/** and use them in your React components.',
          example: `import { 
  useGetAccount, 
  useGetLoginInfo, 
  useGetNetworkConfig, 
  useGetTransactionSessions, 
  useSelector 
} from '@multiversx/sdk-dapp/out/react';

const account = useGetAccount();
const { isLoggedIn, loginMethod } = useGetLoginInfo();
const { network } = useGetNetworkConfig();
const transactionSessions = useGetTransactionSessions();

// Custom selector usage
import { transactionsSliceSelector } from '@multiversx/sdk-dapp/out/store/selectors/transactionsSelector';
const sessions = useSelector(transactionsSliceSelector);`
        },

        practicalExamples: {
          accountInfo: {
            description: 'Display user address and balance:',
            code: `import { useGetAccount, useGetNetworkConfig } from '@multiversx/sdk-dapp/out/react';

const AccountInfo = () => {
  const account = useGetAccount();
  const { network: { egldLabel } } = useGetNetworkConfig();

  return (
    <div>
      <p>Address: {account.address}</p>
      <p>Balance: {account.balance} {egldLabel}</p>
    </div>
  );
};`
          },
          loginStatus: {
            description: 'Show login status and method:',
            code: `import { useGetLoginInfo } from '@multiversx/sdk-dapp/out/react';

const LoginStatus = () => {
  const { isLoggedIn, loginMethod } = useGetLoginInfo();
  return (
    <div>
      {isLoggedIn ? (
        <span>Logged in via {loginMethod}</span>
      ) : (
        <span>Not logged in</span>
      )}
    </div>
  );
};`
          },
          transactionSessions: {
            description: 'List all transaction sessions:',
            code: `import { useGetTransactionSessions } from '@multiversx/sdk-dapp/out/react/transactions/useGetTransactionSessions';

const TransactionSessions = () => {
  const sessions = useGetTransactionSessions();
  return (
    <ul>
      {Object.entries(sessions).map(([sessionId, session]) => (
        <li key={sessionId}>
          Session {sessionId}: Status {session.status}
        </li>
      ))}
    </ul>
  );
};`
          },
          customSelector: {
            description: 'Use useSelector for custom store queries:',
            code: `import { useSelector } from '@multiversx/sdk-dapp/out/react/store/useSelector';
import { transactionsSliceSelector } from '@multiversx/sdk-dapp/out/store/selectors/transactionsSelector';

const CustomSessions = () => {
  const sessions = useSelector(transactionsSliceSelector);
  // ...
};`
          }
        },

        bestPractices: {
          tips: [
            'Always use hooks inside React function components.',
            'Combine hooks for richer UI (e.g., show balance and login status together).',
            'Use useSelector for advanced or custom store queries.',
            'Handle loading and error states for better UX.',
            'Memoize expensive computations based on hook data.'
          ]
        },

        troubleshooting: {
          commonIssues: [
            'Hooks must be called in the same order on every render.',
            'Do not use hooks inside loops or conditions.',
            'If data is undefined, ensure sdk-dapp is initialized before rendering components.',
            'Check that you are importing hooks from the correct sdk-dapp version.'
          ]
        },

        references: {
          documentation: 'https://github.com/multiversx/mx-sdk-dapp',
          templateDapp: 'https://github.com/multiversx/mx-template-dapp',
          liveDemo: 'https://template-dapp.multiversx.com/'
        },

        generatedAt: new Date().toISOString(),
        lastUpdated: new Date().toISOString()
      };

      return {
        contents: [{
          uri: RESOURCE_URIS.SDK_DAPP_REACT,
          mimeType: 'application/json',
          text: JSON.stringify(reactHooksGuide, null, 2),
        }],
      };

    } catch (error) {
      logger.error('Error generating React hooks guide:', error);

      const errorInfo = {
        error: {
          message: error instanceof Error ? error.message : 'Unknown error occurred',
          timestamp: new Date().toISOString(),
        },
        message: 'Failed to generate React hooks guide. Please check the logs for more details.',
        fallbackDocumentation: {
          repository: 'https://github.com/multiversx/mx-sdk-dapp',
          templateDapp: 'https://github.com/multiversx/mx-template-dapp'
        }
      };

      return {
        contents: [{
          uri: RESOURCE_URIS.SDK_DAPP_REACT,
          mimeType: 'application/json',
          text: JSON.stringify(errorInfo, null, 2),
        }],
      };
    }
  }
} 
// Add RESOURCE_URIS.SDK_DAPP_REACT to RESOURCE_URIS in constants.ts if not already present. 