/**
 * Login and Logout Resource
 * Comprehensive guide for user authentication in SDK-DAPP v5
 */

import { RESOURCE_URIS } from '../utils/constants.js';
import { logger } from '../utils/logger.js';

export class SDKDappLoginLogoutResource {
  /**
   * Read login and logout guide
   */
  static async read() {
    logger.debug('Reading login/logout resource');

    try {
      const loginLogoutGuide = {
        title: 'MultiversX SDK-DAPP v5 Login & Logout Guide',
        version: '5.x',
        description: 'Complete guide for implementing user authentication in MultiversX dApps',
        
        overview: {
          description: 'SDK-DAPP v5 provides two main approaches for user authentication',
          approaches: [
            '1. UnlockPanelManager - Provides UI panel with all supported wallet providers',
            '2. Programmatic login - Direct provider interaction with custom UI'
          ],
          supportedProviders: [
            'MultiversX DeFi Wallet Extension',
            'MultiversX Web Wallet',
            'WalletConnect (mobile wallets)',
            'Ledger Hardware Wallet',
            'Custom providers'
          ]
        },

        unlockPanelManager: {
          description: 'Recommended approach using built-in UI with all supported providers',
          basicExample: `import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { UnlockPanelManager, useGetLoginInfo } from '@multiversx/sdk-dapp';

export const ConnectButton = () => {
  const navigate = useNavigate();
  
  const unlockPanelManager = UnlockPanelManager.init({
    loginHandler: () => {
      navigate('/dashboard');
    },
    onClose: () => {
      navigate('/');
    }
  });

  const handleConnect = () => {
    unlockPanelManager.openUnlockPanel();
  };

  return <button onClick={handleConnect}>Connect Wallet</button>;`,

          advancedExample: `import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  UnlockPanelManager, 
  useGetLoginInfo,
  ProviderFactory 
} from '@multiversx/sdk-dapp';

export const AdvancedConnect = () => {
  const navigate = useNavigate();
  const { isLoggedIn } = useGetLoginInfo();

  const unlockPanelManager = UnlockPanelManager.init({
    loginHandler: async ({ type, anchor }) => {
      // Custom logic after successful login
      const provider = await ProviderFactory.create({ type, anchor });
      const { address, signature } = await provider.login();
      
      // Save additional user data, analytics, etc.
      console.log('User connected:', address);
      navigate('/dashboard');
    },
    onClose: () => {
      navigate('/');
    }
  });

  const handleOpenUnlockPanel = () => {
    unlockPanelManager.openUnlockPanel();
  };

  useEffect(() => {
    if (isLoggedIn) {
      navigate('/dashboard');
      return;
    }
    // Auto-open panel if needed
    // handleOpenUnlockPanel();
  }, [isLoggedIn]);

  return (
    <div>
      {!isLoggedIn ? (
        <button onClick={handleOpenUnlockPanel}>
          Connect Wallet
        </button>
      ) : (
        <span>Connected!</span>
      )}
    </div>
  );
};`,

          configuration: {
            description: 'UnlockPanelManager configuration options',
            options: {
              loginHandler: 'Function called after successful login - receives provider type and anchor',
              onClose: 'Function called when unlock panel is closed',
              disableProviders: 'Array of provider types to disable',
              customProviders: 'Array of custom providers to include'
            }
          }
        },

        programmaticLogin: {
          description: 'Direct provider interaction for custom UI implementations',
          extensionWallet: `import { ProviderFactory, ProviderTypeEnum } from '@multiversx/sdk-dapp';

const handleExtensionLogin = async () => {
  try {
    const provider = await ProviderFactory.create({
      type: ProviderTypeEnum.extension
    });
    const result = await provider.login();
    console.log('Login successful:', result.address);
    // Handle successful login
  } catch (error) {
    console.error('Extension login failed:', error);
    // Handle login error
  }
};`,

          walletConnect: `const handleWalletConnectLogin = async () => {
  try {
    const provider = await ProviderFactory.create({
      type: ProviderTypeEnum.walletconnect
    });
    const result = await provider.login();
    console.log('WalletConnect login successful:', result.address);
  } catch (error) {
    console.error('WalletConnect login failed:', error);
  }
};`,

          webWallet: `const handleWebWalletLogin = async () => {
  try {
    const provider = await ProviderFactory.create({
      type: ProviderTypeEnum.webwallet
    });
    // Web wallet will redirect to wallet.multiversx.com
    await provider.login();
  } catch (error) {
    console.error('Web wallet login failed:', error);
  }
};`,

          ledger: `const handleLedgerLogin = async () => {
  try {
    const provider = await ProviderFactory.create({
      type: ProviderTypeEnum.ledger
    });
    // Ledger requires additional UI for address selection
    const result = await provider.login();
    console.log('Ledger login successful:', result.address);
  } catch (error) {
    console.error('Ledger login failed:', error);
  }
};`,

          customProvider: `// Using custom provider
const handleCustomProviderLogin = async () => {
  try {
    const provider = await ProviderFactory.create({
      type: 'myCustomProvider' // your custom provider type
    });
    const result = await provider.login();
    console.log('Custom provider login successful:', result.address);
  } catch (error) {
    console.error('Custom provider login failed:', error);
  }
};`
        },

        loginStatus: {
          description: 'Monitor login status and user information',
          reactHooks: `import { 
  useGetLoginInfo, 
  useGetAccount, 
  useGetIsLoggedIn 
} from '@multiversx/sdk-dapp';

export const UserInfo = () => {
  const { isLoggedIn, loginMethod } = useGetLoginInfo();
  const { address, balance } = useGetAccount();
  const isLoggedIn2 = useGetIsLoggedIn(); // Alternative hook

  if (!isLoggedIn) {
    return <div>Please connect your wallet</div>;
  }

  return (
    <div>
      <p>Address: {address}</p>
      <p>Balance: {balance} EGLD</p>
      <p>Login method: {loginMethod}</p>
    </div>
  );
};`,

          selectors: `import { 
  getAccount, 
  getIsLoggedIn, 
  getLoginInfo 
} from '@multiversx/sdk-dapp';

// For non-React frameworks
const account = getAccount();
const isLoggedIn = getIsLoggedIn();
const loginInfo = getLoginInfo();

console.log('User address:', account.address);
console.log('Is logged in:', isLoggedIn);
console.log('Login method:', loginInfo.loginMethod);`,

          storeSubscription: `import { getStore } from '@multiversx/sdk-dapp';

// Subscribe to store changes for reactive updates
const store = getStore();
const unsubscribe = store.subscribe((state) => {
  const isLoggedIn = state.account.address !== '';
  console.log('Login status changed:', isLoggedIn);
});

// Don't forget to unsubscribe
// unsubscribe();`
        },

        logout: {
          description: 'Implementing logout functionality',
          basicLogout: `import { getAccountProvider } from '@multiversx/sdk-dapp';

const handleLogout = async () => {
  try {
    const provider = getAccountProvider();
    await provider.logout();
    console.log('Logout successful');
    // Redirect to home page or login page
    navigate('/');
  } catch (error) {
    console.error('Logout failed:', error);
  }
};`,

          logoutWithCleanup: `import { 
  getAccountProvider,
  clearTransactions 
} from '@multiversx/sdk-dapp';

const handleLogoutWithCleanup = async () => {
  try {
    const provider = getAccountProvider();
    
    // Clear any pending transactions
    clearTransactions();
    
    // Perform logout
    await provider.logout();
    
    // Clear any local app data
    localStorage.removeItem('userPreferences');
    
    console.log('Logout successful with cleanup');
    navigate('/');
  } catch (error) {
    console.error('Logout with cleanup failed:', error);
  }
};`,

          logoutButton: `import { useGetIsLoggedIn } from '@multiversx/sdk-dapp';

export const LogoutButton = () => {
  const isLoggedIn = useGetIsLoggedIn();

  if (!isLoggedIn) {
    return null;
  }

  return (
    <button 
      onClick={handleLogout}
      className="logout-button"
    >
      Disconnect
    </button>
  );
};`
        },

        routeProtection: {
          description: 'Protect routes and redirect based on login status',
          routeGuard: `import { useGetIsLoggedIn } from '@multiversx/sdk-dapp';
import { Navigate } from 'react-router-dom';

export const ProtectedRoute = ({ children }) => {
  const isLoggedIn = useGetIsLoggedIn();

  if (!isLoggedIn) {
    return <Navigate to="/unlock" replace />;
  }

  return children;
};`,

          unlockPage: `import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { UnlockPanelManager, useGetLoginInfo } from '@multiversx/sdk-dapp';

export const UnlockPage = () => {
  const navigate = useNavigate();
  const { isLoggedIn } = useGetLoginInfo();

  const unlockPanelManager = UnlockPanelManager.init({
    loginHandler: () => {
      navigate('/dashboard');
    },
    onClose: () => {
      navigate('/');
    }
  });

  const handleOpenUnlockPanel = () => {
    unlockPanelManager.openUnlockPanel();
  };

  useEffect(() => {
    if (isLoggedIn) {
      navigate('/dashboard');
      return;
    }
    
    // Auto-open unlock panel
    handleOpenUnlockPanel();
  }, [isLoggedIn]);

  return (
    <div className="unlock-page">
      <h1>Connect Your Wallet</h1>
      <button onClick={handleOpenUnlockPanel}>
        Connect Wallet
      </button>
    </div>
  );
};`,

          appWithRoutes: `import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ProtectedRoute } from './ProtectedRoute';
import { UnlockPage } from './UnlockPage';
import { Dashboard } from './Dashboard';

export const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/unlock" element={<UnlockPage />} />
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } 
        />
      </Routes>
    </BrowserRouter>
  );
};`
        },

        errorHandling: {
          description: 'Handle common login/logout errors',
          loginErrorHandling: `const handleLoginWithErrorHandling = async (providerType) => {
  try {
    const provider = await ProviderFactory.create({ type: providerType });
    const result = await provider.login();
    
    // Success handling
    console.log('Login successful:', result);
    navigate('/dashboard');
    
  } catch (error) {
    console.error('Login error:', error);
    
    // Handle specific error types
    if (error.message?.includes('User rejected')) {
      toast.error('Login cancelled by user');
    } else if (error.message?.includes('Extension not found')) {
      toast.error('Wallet extension not installed');
    } else if (error.message?.includes('Network')) {
      toast.error('Network connection error');
    } else {
      toast.error('Login failed. Please try again.');
    }
  }
};`,

          logoutErrorHandling: `const handleLogoutWithErrorHandling = async () => {
  try {
    const provider = getAccountProvider();
    await provider.logout();
    
    toast.success('Successfully disconnected');
    navigate('/');
    
  } catch (error) {
    console.error('Logout error:', error);
    toast.error('Logout failed. Please try again.');
    
    // Force logout on critical errors
    if (error.code === 'CRITICAL_ERROR') {
      // Clear local storage and redirect
      localStorage.clear();
      sessionStorage.clear();
      window.location.href = '/';
    }
  }
};`
        },

        bestPractices: {
          security: [
            'Always run your dApp on HTTPS - some providers require secure connections',
            'Never store private keys or sensitive data in localStorage',
            'Validate user authentication on both client and server sides',
            'Implement proper session timeout and cleanup',
            'Use nativeAuth for enhanced security when available'
          ],
          
          userExperience: [
            'Provide clear feedback during login/logout processes',
            'Handle network switching gracefully',
            'Implement auto-reconnection for lost connections',
            'Show appropriate loading states during provider interactions',
            'Provide fallback options if primary login method fails'
          ],
          
          development: [
            'Test with multiple wallet providers',
            'Handle provider-specific edge cases',
            'Implement proper error boundaries',
            'Log authentication events for debugging',
            'Use development networks for testing'
          ]
        },

        commonIssues: {
          extensionNotInstalled: {
            problem: 'Extension wallet not available',
            solution: 'Check if extension is installed and provide installation links'
          },
          networkMismatch: {
            problem: 'User on wrong network',
            solution: 'Prompt user to switch networks or handle multiple networks'
          },
          connectionTimeout: {
            problem: 'Login process times out',
            solution: 'Implement timeout handling and retry mechanisms'
          },
          webWalletRedirect: {
            problem: 'Web wallet redirect not working',
            solution: 'Ensure proper URL configuration and HTTPS setup'
          }
        },

        migrationNotes: {
          fromV4: [
            'Update import paths to use @multiversx/sdk-dapp',
            'Replace deprecated login methods with UnlockPanelManager or ProviderFactory',
            'Update provider type enumerations',
            'Review and update error handling patterns'
          ]
        },

        examples: {
          minimalImplementation: `// Minimal login/logout implementation
import { 
  UnlockPanelManager, 
  useGetLoginInfo, 
  getAccountProvider 
} from '@multiversx/sdk-dapp';

export const AuthButton = () => {
  const { isLoggedIn } = useGetLoginInfo();

  const unlockPanelManager = UnlockPanelManager.init({
    loginHandler: () => console.log('Logged in!'),
  });

  const handleAuth = async () => {
    if (isLoggedIn) {
      const provider = getAccountProvider();
      await provider.logout();
    } else {
      unlockPanelManager.openUnlockPanel();
    }
  };

  return (
    <button onClick={handleAuth}>
      {isLoggedIn ? 'Logout' : 'Login'}
    </button>
  );
};`
        },

        generatedAt: new Date().toISOString(),
        lastUpdated: new Date().toISOString()
      };

      return {
        contents: [{
          uri: RESOURCE_URIS.SDK_DAPP_LOGIN_LOGOUT,
          mimeType: 'application/json',
          text: JSON.stringify(loginLogoutGuide, null, 2),
        }],
      };

    } catch (error) {
      logger.error('Error generating login/logout guide:', error);

      const errorInfo = {
        error: {
          message: error instanceof Error ? error.message : 'Unknown error occurred',
          timestamp: new Date().toISOString(),
        },
        message: 'Failed to generate login/logout guide. Please check the logs for more details.',
        fallbackDocumentation: {
          repository: 'https://github.com/multiversx/mx-sdk-dapp',
          templateDapp: 'https://github.com/multiversx/mx-template-dapp'
        }
      };

      return {
        contents: [{
          uri: RESOURCE_URIS.SDK_DAPP_LOGIN_LOGOUT,
          mimeType: 'application/json',
          text: JSON.stringify(errorInfo, null, 2),
        }],
      };
    }
  }
} 