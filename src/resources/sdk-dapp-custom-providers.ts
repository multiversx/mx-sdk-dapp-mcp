/**
 * Custom Provider Resource
 * Comprehensive guide for creating custom signing providers in SDK-DAPP v5
 */

import { RESOURCE_URIS } from '../utils/constants.js';
import { logger } from '../utils/logger.js';

export class SDKDappCustomProviderResource {
  /**
   * Read custom provider development guide
   */
  static async read() {
    logger.debug('Reading custom provider resource');

    try {
      const customProviderGuide = {
        title: 'MultiversX SDK-DAPP v5 Custom Provider Development Guide',
        version: '5.x',
        description: 'Complete guide for creating and integrating custom signing providers',
        
        overview: {
          description: 'Custom providers extend wallet support beyond the built-in providers',
          useCases: [
            'Hardware wallet integration',
            'Server-side signing for automation',
            'Custom authentication flows',
            'Enterprise security solutions',
            'Mobile app integrations',
            'Testing and development tools'
          ],
          builtInProviders: [
            'Extension - MultiversX DeFi Wallet browser extension',
            'WebWallet - MultiversX Web Wallet redirect',
            'WalletConnect - Mobile wallet connection via QR',
            'Ledger - Hardware wallet integration'
          ]
        },

        iProviderInterface: {
          description: 'All custom providers must implement the IProvider interface',
          requiredMethods: {
            isInitialized: 'boolean - Returns whether the provider is ready for use',
            isConnected: 'boolean - Returns whether the provider has an active connection',
            getTokenLoginSignature: 'string | undefined - Returns the login signature for authentication',
            getAccount: 'IDAppProviderAccount | null - Returns the current account information',
            getAddress: 'Promise<string | undefined> - Returns the user\'s wallet address',
            init: 'Promise<boolean> - Initializes the provider',
            getType: 'string - Returns a unique identifier for this provider type',
            login: 'Promise<{address: string, signature: string}> - Handles user authentication',
            logout: 'Promise<boolean> - Handles user logout and cleanup',
            signTransactions: 'Promise<Transaction[]> - Signs an array of transactions',
            signMessage: 'Promise<Message> - Signs a message for authentication',
          },
          interfaceDefinition: `import {
  Address,
  IDAppProviderAccount,
  IProvider,
  Message,
  Transaction
} from '@multiversx/sdk-dapp';

export interface IProvider {
  isInitialized(): boolean;
  isConnected(): boolean;
  getTokenLoginSignature(): string | undefined;
  setAccount(value: IDAppProviderAccount): void;
  getAccount(): IDAppProviderAccount | null;
  getAddress(): Promise<string | undefined>;
  init(): Promise<boolean>;
  getType(): string;
  login(options?: { token?: string }): Promise<{
    address: string;
    signature: string;
  }>;
  logout(): Promise<boolean>;
  signTransactions(transactions: Transaction[]): Promise<Transaction[]>;
  signMessage(message: Message): Promise<Message>;
}`
        },

        implementationExample: {
          description: 'Complete InMemoryProvider implementation example',
          basicStructure: `import {
  Address,
  IDAppProviderAccount,
  IProvider,
  Message,
  MessageComputer,
  signTransactions,
  Transaction,
  TransactionComputer,
  UserSecretKey,
  UserSigner
} from '@multiversx/sdk-dapp';

export class InMemoryProvider implements IProvider {
  private _account: IDAppProviderAccount = { address: '' };
  private _anchor?: HTMLElement;
  private privateKey = '';

  constructor(options?: { address?: string; anchor?: HTMLElement }) {
    this._anchor = options?.anchor;
    if (options?.address) {
      this.setAccount({ address: options.address });
    }
  }

  // Required interface methods implementation
  isInitialized(): boolean {
    return Boolean(this._account.address);
  }

  isConnected(): boolean {
    return Boolean(this.privateKey);
  }

  getTokenLoginSignature(): string | undefined {
    return this._account.signature;
  }

  setAccount(value: IDAppProviderAccount): void {
    this._account = value;
  }

  getAccount(): IDAppProviderAccount | null {
    return this._account;
  }

  async getAddress(): Promise<string | undefined> {
    return this._account.address;
  }

  async init(): Promise<boolean> {
    return true;
  }

  getType(): string {
    return 'inMemoryProvider';
  }
}`,

          loginImplementation: `async login(options?: { token?: string }): Promise<{
  address: string;
  signature: string;
}> {
  return new Promise(async (resolve, reject) => {
    // Custom UI to get user credentials
    const { address, privateKey: userPrivateKey } = await this.showLoginModal({
      needsAddress: true,
      anchor: this._anchor
    });

    if (!address || !userPrivateKey) {
      return reject('User cancelled login');
    }

    this.privateKey = userPrivateKey;
    this.setAccount({ address });
    
    const token = options?.token;
    if (!token) {
      resolve({ address, signature: '' });
      return;
    }

    // Sign the authentication token
    const message = \`\${address}\${token}{}\`;
    const msg = new Message({
      address: new Address(address),
      data: new Uint8Array(Buffer.from(message))
    });
    
    const signedMessage = await this.signMessage(msg);
    const signature = signedMessage.signature 
      ? Buffer.from(signedMessage.signature).toString('hex')
      : '';

    this.setAccount({ address, signature });
    resolve({ address, signature });
  });
}`,

          signTransactionImplementation: `async signTransaction(transaction: Transaction): Promise<Transaction> {
  const privateKey = await this.getPrivateKey('signTransaction');
  const signer = new UserSigner(UserSecretKey.fromString(privateKey));
  const transactionComputer = new TransactionComputer();
  
  const bytesToSign = transactionComputer.computeBytesForSigning(transaction);
  const signature = await signer.sign(bytesToSign);
  transaction.signature = new Uint8Array(signature);
  
  return transaction;
}

async signTransactions(transactions: Transaction[]): Promise<Transaction[]> {
  const hasPrivateKey = await this.getPrivateKey('signTransactions');
  if (!hasPrivateKey) {
    throw new Error('Unable to sign transactions.');
  }
  
  return signTransactions({
    transactions,
    handleSign: async (txs: Transaction[]) => {
      const signedTransactions: Transaction[] = [];
      for (const transaction of txs) {
        const signedTransaction = await this.signTransaction(transaction);
        signedTransactions.push(signedTransaction);
      }
      return signedTransactions;
    }
  });
}`,

          signMessageImplementation: `async signMessage(message: Message): Promise<Message> {
  const privateKey = await this.getPrivateKey('signMessage');
  const signer = new UserSigner(UserSecretKey.fromString(privateKey));
  const messageComputer = new MessageComputer();

  const messageToSign = new Uint8Array(
    messageComputer.computeBytesForSigning(message)
  );

  const signature = await signer.sign(Buffer.from(messageToSign));
  message.signature = new Uint8Array(signature);

  return message;
}`,

          logoutImplementation: `async logout(): Promise<boolean> {
  this.privateKey = '';
  this._account = { address: '' };
  // Clear any additional state, close connections, etc.
  return true;
}`,

          errorHandling: `private notInitializedError = (caller: string) => () => {
  throw new Error(\`Unable to perform \${caller}, Provider not initialized\`);
};

private async getPrivateKey(action: string): Promise<string> {
  if (!this.privateKey) {
    const { privateKey: userPrivateKey } = await this.showLoginModal();
    
    if (!userPrivateKey) {
      await this.logout();
      const throwError = this.notInitializedError(action);
      return throwError();
    }
    
    this.privateKey = userPrivateKey;
  }
  return this.privateKey;
}`
        },

        uiComponents: {
          description: 'Custom providers often need UI components for user interaction',
          modalExample: `import React from 'react';
import { createPortal } from 'react-dom';
import { createRoot } from 'react-dom/client';

interface ModalProps {
  onSubmit: (values: { privateKey: string; address: string }) => void;
  onClose: () => void;
  needsAddress?: boolean;
  anchor?: HTMLElement;
}

const LoginModal = ({ onSubmit, onClose, needsAddress, anchor }: ModalProps) => {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const privateKey = formData.get('privateKey')?.toString() || '';
    const address = formData.get('address')?.toString() || '';

    if ((needsAddress && !address) || !privateKey) {
      alert(\`Please enter \${needsAddress ? 'address and' : ''} private key\`);
      return;
    }

    onSubmit({ privateKey, address });
  };

  return createPortal(
    <div className="modal-overlay">
      <div className="modal">
        <h2>Authenticate</h2>
        <form onSubmit={handleSubmit}>
          {needsAddress && (
            <div>
              <label>
                Address
                <input
                  type="text"
                  name="address"
                  placeholder="Public key"
                  required
                />
              </label>
            </div>
          )}
          <div>
            <label>
              Private Key
              <input
                type="password"
                name="privateKey"
                placeholder="Private key"
                required
              />
            </label>
          </div>
          <div className="button-group">
            <button type="button" onClick={onClose}>Cancel</button>
            <button type="submit">Submit</button>
          </div>
        </form>
      </div>
    </div>,
    anchor || document.body
  );
};`,

          modalManager: `export class LoginModal {
  private static instance: LoginModal;
  private _modalRoot: HTMLDivElement;

  private constructor() {
    this._modalRoot = document.createElement('div');
    document.body.appendChild(this._modalRoot);
  }

  public static getInstance(): LoginModal {
    if (!LoginModal.instance) {
      LoginModal.instance = new LoginModal();
    }
    return LoginModal.instance;
  }

  public showModal(options?: {
    needsAddress: boolean;
    anchor?: HTMLElement;
  }): Promise<{ privateKey: string; address: string; }> {
    return new Promise((resolve) => {
      const root = createRoot(this._modalRoot);

      const handleSubmit = (values: { privateKey: string; address: string; }) => {
        root.unmount();
        resolve(values);
      };

      const handleClose = () => {
        root.unmount();
        resolve({ privateKey: '', address: '' });
      };

      root.render(
        <LoginModal
          onSubmit={handleSubmit}
          onClose={handleClose}
          needsAddress={options?.needsAddress}
          anchor={options?.anchor}
        />
      );
    });
  }
}`
        },

        providerRegistration: {
          description: 'Two methods to register custom providers with SDK-DAPP',
          windowProviders: {
            description: 'Method 1: Register providers via window.multiversx.providers',
            example: `import { ICustomProvider, ProviderTypeEnum } from '@multiversx/sdk-dapp';
import { InMemoryProvider } from './InMemoryProvider';
import { PemProvider } from './PemProvider';
import { KeystoreProvider } from './KeystoreProvider';

// Define additional provider types
const ADDITIONAL_PROVIDERS = {
  inMemoryProvider: 'inMemoryProvider',
  pemProvider: 'pemProvider',
  keystoreProvider: 'keystoreProvider'
} as const;

export const ExtendedProviders = {
  ...ProviderTypeEnum,
  ...ADDITIONAL_PROVIDERS
} as const;

// Define provider configurations
const providers: ICustomProvider<ProviderTypeEnum>[] = [
  {
    name: 'In Memory Provider',
    type: ExtendedProviders.inMemoryProvider,
    iconUrl: \`\${window.location.origin}/multiversx-white.svg\`,
    constructor: async (options) => new InMemoryProvider(options)
  },
  {
    name: 'PEM Provider',
    type: ExtendedProviders.pemProvider,
    iconUrl: \`\${window.location.origin}/pem-icon.svg\`,
    constructor: async (options) => new PemProvider(options)
  },
  {
    name: 'Keystore Provider',
    type: ExtendedProviders.keystoreProvider,
    iconUrl: \`\${window.location.origin}/keystore-icon.svg\`,
    constructor: async (options) => new KeystoreProvider(options)
  }
];

// Register providers globally
(window as any).multiversx = {};
(window as any).multiversx.providers = providers;`
          },

          configProviders: {
            description: 'Method 2: Register providers via initApp config',
            example: `import { InitAppType, EnvironmentsEnum } from '@multiversx/sdk-dapp';

export const config: InitAppType = {
  storage: { getStorageCallback: () => sessionStorage },
  dAppConfig: {
    nativeAuth: true,
    environment: EnvironmentsEnum.devnet,
    successfulToastLifetime: 5000
  },
  // Register custom providers here
  customProviders: providers
};`
          },

          usage: {
            description: 'Using custom providers with ProviderFactory',
            example: `import { ProviderFactory } from '@multiversx/sdk-dapp';
import { ExtendedProviders } from './providers';

// Use the custom provider
const handleCustomLogin = async () => {
  try {
    const provider = await ProviderFactory.create({
      type: ExtendedProviders.inMemoryProvider,
      anchor: document.getElementById('provider-container')
    });
    
    const result = await provider.login();
    console.log('Custom provider login successful:', result);
  } catch (error) {
    console.error('Custom provider login failed:', error);
  }
};`
          }
        },

        advancedExamples: {
          description: 'Advanced custom provider implementations',
          
          pemProvider: {
            description: 'Provider that works with PEM files',
            example: `import { UserSecretKey, UserSigner } from '@multiversx/sdk-dapp';

export class PemProvider implements IProvider {
  private privateKey = '';
  private _account: IDAppProviderAccount = { address: '' };

  async login(): Promise<{ address: string; signature: string }> {
    return new Promise(async (resolve, reject) => {
      const { pemContent } = await this.showPemUploadModal();
      
      if (!pemContent) {
        return reject('User cancelled login');
      }

      try {
        const secretKey = UserSecretKey.fromPem(pemContent);
        const address = secretKey.generatePublicKey().toAddress().bech32();
        
        this.privateKey = secretKey.hex();
        this.setAccount({ address });
        
        resolve({ address, signature: '' });
      } catch (error) {
        reject('Invalid PEM file');
      }
    });
  }

  private async showPemUploadModal(): Promise<{ pemContent: string }> {
    // Implement file upload modal
    return new Promise((resolve) => {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = '.pem';
      
      input.onchange = (e) => {
        const file = (e.target as HTMLInputElement).files?.[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = (e) => {
            resolve({ pemContent: e.target?.result as string });
          };
          reader.readAsText(file);
        } else {
          resolve({ pemContent: '' });
        }
      };
      
      input.click();
    });
  }
}`
          },

          keystoreProvider: {
            description: 'Provider that works with keystore files',
            example: `import { UserSecretKey, UserWallet } from '@multiversx/sdk-dapp';

export class KeystoreProvider implements IProvider {
  private wallet?: UserWallet;
  private _account: IDAppProviderAccount = { address: '' };

  async login(): Promise<{ address: string; signature: string }> {
    return new Promise(async (resolve, reject) => {
      const { keystoreContent, password } = await this.showKeystoreModal();
      
      if (!keystoreContent || !password) {
        return reject('User cancelled login');
      }

      try {
        const wallet = UserWallet.fromSecretKey({
          secretKey: UserSecretKey.fromString(keystoreContent),
          password
        });
        
        const address = wallet.getAddress().bech32();
        this.wallet = wallet;
        this.setAccount({ address });
        
        resolve({ address, signature: '' });
      } catch (error) {
        reject('Invalid keystore file or password');
      }
    });
  }

  async signTransaction(transaction: Transaction): Promise<Transaction> {
    if (!this.wallet) {
      throw new Error('Wallet not initialized');
    }
    
    const signer = new UserSigner(this.wallet.getSecretKey());
    const transactionComputer = new TransactionComputer();
    
    const bytesToSign = transactionComputer.computeBytesForSigning(transaction);
    const signature = await signer.sign(bytesToSign);
    transaction.signature = new Uint8Array(signature);
    
    return transaction;
  }
}`
          },

          hardwareProvider: {
            description: 'Template for hardware wallet provider',
            example: `export class HardwareProvider implements IProvider {
  private device?: HardwareDevice;
  private _account: IDAppProviderAccount = { address: '' };

  async init(): Promise<boolean> {
    try {
      this.device = await this.connectToHardware();
      return Boolean(this.device);
    } catch (error) {
      console.error('Hardware connection failed:', error);
      return false;
    }
  }

  async login(): Promise<{ address: string; signature: string }> {
    if (!this.device) {
      throw new Error('Hardware device not connected');
    }

    const addresses = await this.device.getAddresses();
    const selectedAddress = await this.showAddressSelection(addresses);
    
    this.setAccount({ address: selectedAddress });
    return { address: selectedAddress, signature: '' };
  }

  async signTransaction(transaction: Transaction): Promise<Transaction> {
    if (!this.device) {
      throw new Error('Hardware device not connected');
    }

    // Show transaction details to user for confirmation
    const confirmed = await this.showTransactionConfirmation(transaction);
    if (!confirmed) {
      throw new Error('Transaction rejected by user');
    }

    const signature = await this.device.signTransaction(transaction);
    transaction.signature = signature;
    
    return transaction;
  }

  private async connectToHardware(): Promise<HardwareDevice> {
    // Implement hardware connection logic
    throw new Error('Implement hardware connection');
  }
}`
          }
        },

        bestPractices: {
          security: [
            'Never store private keys in plain text - use secure storage or prompt user each time',
            'Validate all user inputs before processing',
            'Implement proper error handling and user feedback',
            'Use secure communication channels for sensitive data',
            'Clear sensitive data from memory after use',
            'Implement session timeouts for security'
          ],

          userExperience: [
            'Provide clear feedback during all operations',
            'Show loading states during async operations',
            'Handle network errors gracefully',
            'Implement retry mechanisms for failed operations',
            'Provide clear error messages to users',
            'Support keyboard navigation in custom UI components'
          ],

          development: [
            'Implement comprehensive error handling',
            'Add logging for debugging purposes',
            'Write unit tests for all provider methods',
            'Document provider capabilities and limitations',
            'Follow TypeScript best practices',
            'Use consistent naming conventions'
          ],

          performance: [
            'Cache expensive operations when possible',
            'Implement lazy loading for UI components',
            'Minimize DOM manipulations',
            'Use efficient algorithms for cryptographic operations',
            'Implement proper cleanup in logout methods',
            'Optimize bundle size by importing only needed dependencies'
          ]
        },

        testing: {
          description: 'Testing strategies for custom providers',
          unitTesting: `import { InMemoryProvider } from './InMemoryProvider';
import { Transaction, Address } from '@multiversx/sdk-dapp';

describe('InMemoryProvider', () => {
  let provider: InMemoryProvider;

  beforeEach(() => {
    provider = new InMemoryProvider();
  });

  test('should initialize correctly', () => {
    expect(provider.getType()).toBe('inMemoryProvider');
    expect(provider.isInitialized()).toBe(false);
  });

  test('should handle login correctly', async () => {
    // Mock the modal interaction
    jest.spyOn(provider as any, 'showLoginModal').mockResolvedValue({
      address: 'erd1...',
      privateKey: 'test-private-key'
    });

    const result = await provider.login();
    
    expect(result.address).toBe('erd1...');
    expect(provider.isInitialized()).toBe(true);
  });

  test('should sign transactions correctly', async () => {
    // Setup provider with mock credentials
    await provider.login();
    
    const transaction = new Transaction({
      value: BigInt(0),
      data: new Uint8Array(),
      receiver: Address.newFromBech32('erd1...'),
      gasLimit: BigInt(50000),
      gasPrice: BigInt(1000000000),
      chainID: 'D',
      nonce: BigInt(0),
      sender: Address.newFromBech32('erd1...'),
      version: 1
    });

    const signedTransaction = await provider.signTransaction(transaction);
    expect(signedTransaction.signature).toBeDefined();
  });
});`,

          integrationTesting: `import { ProviderFactory } from '@multiversx/sdk-dapp';

describe('Custom Provider Integration', () => {
  test('should register and create custom provider', async () => {
    const provider = await ProviderFactory.create({
      type: 'inMemoryProvider'
    });

    expect(provider).toBeDefined();
    expect(provider.getType()).toBe('inMemoryProvider');
  });

  test('should handle full authentication flow', async () => {
    const provider = await ProviderFactory.create({
      type: 'inMemoryProvider'
    });

    // Mock user interaction
    const loginResult = await provider.login({
      token: 'test-token'
    });

    expect(loginResult.address).toBeDefined();
    expect(loginResult.signature).toBeDefined();
  });
});`
        },

        troubleshooting: {
          commonIssues: {
            providerNotFound: {
              problem: 'ProviderFactory cannot find custom provider',
              solutions: [
                'Ensure provider is registered via window.multiversx.providers or config.customProviders',
                'Check provider type string matches exactly',
                'Verify initApp() is called before using the provider',
                'Check browser console for registration errors'
              ]
            },
            signingErrors: {
              problem: 'Transaction signing fails',
              solutions: [
                'Verify private key format and validity',
                'Check transaction structure and required fields',
                'Ensure proper error handling in sign methods',
                'Validate network compatibility'
              ]
            },
            uiIssues: {
              problem: 'Custom UI components not appearing',
              solutions: [
                'Check if modals are properly rendered in DOM',
                'Verify z-index and positioning styles',
                'Ensure proper cleanup of DOM elements',
                'Check for React/framework-specific issues'
              ]
            }
          }
        },

        examples: {
          minimalProvider: `// Minimal custom provider example
export class MinimalProvider implements IProvider {
  private _account: IDAppProviderAccount = { address: '' };

  isInitialized = () => Boolean(this._account.address);
  isConnected = () => this.isInitialized();
  getTokenLoginSignature = () => this._account.signature;
  setAccount = (value: IDAppProviderAccount) => { this._account = value; };
  getAccount = () => this._account;
  getAddress = async () => this._account.address;
  init = async () => true;
  getType = () => 'minimal';

  login = async () => {
    // Implement your login logic
    const address = 'erd1...'; // Get from your source
    this.setAccount({ address });
    return { address, signature: '' };
  };

  logout = async () => {
    this._account = { address: '' };
    return true;
  };

  signTransactions = async (transactions: Transaction[]) => {
    // Implement signing logic
    return transactions;
  };

  signMessage = async (message: Message) => {
    // Implement message signing
    return message;
  };
}`
        },

        generatedAt: new Date().toISOString(),
        lastUpdated: new Date().toISOString()
      };

      return {
        contents: [{
          uri: RESOURCE_URIS.SDK_DAPP_CUSTOM_PROVIDERS,
          mimeType: 'application/json',
          text: JSON.stringify(customProviderGuide, null, 2),
        }],
      };

    } catch (error) {
      logger.error('Error generating custom provider guide:', error);

      const errorInfo = {
        error: {
          message: error instanceof Error ? error.message : 'Unknown error occurred',
          timestamp: new Date().toISOString(),
        },
        message: 'Failed to generate custom provider guide. Please check the logs for more details.',
        fallbackDocumentation: {
          repository: 'https://github.com/multiversx/mx-sdk-dapp',
          templateDapp: 'https://github.com/multiversx/mx-template-dapp'
        }
      };

      return {
        contents: [{
          uri: RESOURCE_URIS.SDK_DAPP_CUSTOM_PROVIDERS,
          mimeType: 'application/json',
          text: JSON.stringify(errorInfo, null, 2),
        }],
      };
    }
  }
} 