/**
 * MultiversX Transaction Prompts
 * Based on SDK-DAPP-V5-GUIDE.md for comprehensive transaction handling
 */

import { logger } from '../utils/logger.js';

/**
 * Generate transaction template with comprehensive MultiversX transaction flow
 */
export function generateTransactionTemplate(args: any): string {
  const recipient = args?.recipient || '[RECIPIENT_ADDRESS]';
  const amount = args?.amount || '[AMOUNT]';
  const data = args?.data || '';
  const contractAddress = args?.contractAddress || '[CONTRACT_ADDRESS]';
  const functionName = args?.functionName || '';
  const functionArgs = args?.functionArgs || [];

  const isSmartContractCall = functionName && contractAddress;

  return `Create a MultiversX transaction with the following details:

**Transaction Details:**
- Recipient: ${recipient}
- Amount: ${amount} EGLD
- Data: ${data || 'No additional data'}
${isSmartContractCall ? `- Contract Address: ${contractAddress}
- Function: ${functionName}
- Arguments: ${functionArgs.length > 0 ? functionArgs.join(', ') : 'None'}` : ''}

**Step 1: Create Transaction Object**
\`\`\`typescript
import { Address, Transaction, TransactionPayload } from '@multiversx/sdk-core';
import {
  GAS_PRICE,
  GAS_LIMIT
} from '@multiversx/sdk-dapp/out/constants/mvx.constants';
import { getAccount } from '@multiversx/sdk-dapp/out/methods/account/getAccount';
import { getNetworkConfig } from '@multiversx/sdk-dapp/out/methods/network/getNetworkConfig';

const account = getAccount();
const network = getNetworkConfig();

const transaction = new Transaction({
  value: BigInt('${amount}' + '0'.repeat(18)), // Convert EGLD to wei
  data: new TransactionPayload('${data}'),
  receiver: Address.newFromBech32('${recipient}'),
  gasLimit: BigInt(GAS_LIMIT),
  gasPrice: BigInt(GAS_PRICE),
  chainID: network.chainId,
  nonce: BigInt(account.nonce),
  sender: Address.newFromBech32(account.address),
  version: 1
});
\`\`\`

**Step 2: Sign Transaction**
\`\`\`typescript
import { getAccountProvider } from '@multiversx/sdk-dapp/out/providers/helpers/accountProvider';
import { refreshAccount } from '@multiversx/sdk-dapp/out/utils/account/refreshAccount';

await refreshAccount(); // Get latest nonce
const provider = getAccountProvider();
const signedTransactions = await provider.signTransactions([transaction]);
\`\`\`

**Step 3: Send and Track Transaction**
\`\`\`typescript
import { TransactionManager } from '@multiversx/sdk-dapp/out/managers/TransactionManager';
import type { TransactionsDisplayInfoType } from '@multiversx/sdk-dapp/out/types/transactions.types';

const txManager = TransactionManager.getInstance();
const sentTransactions = await txManager.send(signedTransactions);

const toastInformation: TransactionsDisplayInfoType = {
  processingMessage: 'Processing transaction',
  errorMessage: 'Transaction failed',
  successMessage: 'Transaction successful'
};

const sessionId = await txManager.track(sentTransactions, {
  transactionsDisplayInfo: toastInformation
});
\`\`\`

**Step 4: Monitor Transaction Status**
\`\`\`typescript
import { getStore } from '@multiversx/sdk-dapp/out/store/store';
import { transactionsSliceSelector } from '@multiversx/sdk-dapp/out/store/selectors/transactionsSelector';

const state = transactionsSliceSelector(getStore().getState());
const currentSession = state[sessionId];
const currentSessionStatus = currentSession?.status;
\`\`\`

**Important Security Notes:**
- Always double-check the recipient address
- Validate the transaction amount
- Ensure sufficient balance for transaction + gas fees
- Consider the current network gas costs
- Keep your private keys secure during signing
- Monitor the transaction status after broadcasting

**Gas Estimation:**
- Standard transfer: ~50,000 gas units
- Smart contract call: varies (typically 200,000-6,000,000)
- Current gas price: check network status

**Network Considerations:**
- Mainnet: Real EGLD transactions
- Testnet: Test tokens for development
- Devnet: Development environment

**Error Handling:**
- Insufficient balance
- Invalid recipient address
- Network connectivity issues
- Gas limit too low
- Nonce synchronization problems`;
}

/**
 * Generate batch transaction template
 */
export function generateBatchTransactionTemplate(args: any): string {
  const transactions = args?.transactions || [];
  const batchType = args?.batchType || 'parallel'; // 'parallel' or 'sequential'

  return `Create a MultiversX batch transaction:

**Batch Configuration:**
- Type: ${batchType}
- Number of transactions: ${transactions.length || '[NUMBER_OF_TRANSACTIONS]'}

**Step 1: Create Multiple Transactions**
\`\`\`typescript
import { Address, Transaction, TransactionPayload } from '@multiversx/sdk-core';
import { getAccount, getNetworkConfig } from '@multiversx/sdk-dapp/out/methods';

const account = getAccount();
const network = getNetworkConfig();

const transactions = [
  // Transaction 1
  new Transaction({
    value: BigInt(0),
    data: new TransactionPayload('transaction1Data'),
    receiver: Address.newFromBech32('erd1...'),
    gasLimit: BigInt(50000),
    gasPrice: BigInt(1000000000),
    chainID: network.chainId,
    nonce: BigInt(account.nonce),
    sender: Address.newFromBech32(account.address),
    version: 1
  }),
  // Transaction 2
  new Transaction({
    value: BigInt(0),
    data: new TransactionPayload('transaction2Data'),
    receiver: Address.newFromBech32('erd1...'),
    gasLimit: BigInt(50000),
    gasPrice: BigInt(1000000000),
    chainID: network.chainId,
    nonce: BigInt(account.nonce + 1),
    sender: Address.newFromBech32(account.address),
    version: 1
  })
];
\`\`\`

**Step 2: Sign Batch Transactions**
\`\`\`typescript
const provider = getAccountProvider();
const signedTransactions = await provider.signTransactions(transactions);
\`\`\`

**Step 3: Send Batch**
${batchType === 'parallel' ? `
\`\`\`typescript
// Parallel execution - all transactions sent simultaneously
const txManager = TransactionManager.getInstance();
const sentTransactions = await txManager.send(signedTransactions);
\`\`\`
` : `
\`\`\`typescript
// Sequential execution - transactions sent in batches
const batchTransactions = [
  [signedTransactions[0]], // First batch
  [signedTransactions[1]]  // Second batch (waits for first to complete)
];
const txManager = TransactionManager.getInstance();
const sentTransactions = await txManager.send(batchTransactions);
\`\`\`
`}

**Step 4: Track Batch**
\`\`\`typescript
const sessionId = await txManager.track(sentTransactions, {
  transactionsDisplayInfo: {
    processingMessage: 'Processing batch transactions',
    errorMessage: 'Batch transaction failed',
    successMessage: 'Batch transaction successful'
  }
});
\`\`\`

**Batch Transaction Benefits:**
- ${batchType === 'parallel' ? 'Faster execution for independent transactions' : 'Guaranteed order of execution'}
- Reduced user interaction
- Better UX for complex operations
- Atomic operations when needed

**Important Notes:**
- ${batchType === 'parallel' ? 'Ensure transactions are independent' : 'Consider gas costs for sequential execution'}
- Monitor all transactions in the batch
- Handle partial failures appropriately
- Consider network congestion impact`;
}

/**
 * Generate smart contract interaction template
 */
export function generateSmartContractTemplate(args: any): string {
  const contractAddress = args?.contractAddress || '[CONTRACT_ADDRESS]';
  const functionName = args?.functionName || '[FUNCTION_NAME]';
  const functionArgs = args?.functionArgs || [];
  const value = args?.value || '0';

  return `Interact with MultiversX Smart Contract:

**Contract Details:**
- Contract Address: ${contractAddress}
- Function: ${functionName}
- Arguments: ${functionArgs.length > 0 ? functionArgs.join(', ') : 'None'}
- Value: ${value} EGLD

**Step 1: Prepare Contract Interaction**
\`\`\`typescript
import { 
  Address, 
  Transaction, 
  TransactionPayload,
  ContractFunction,
  ResultsParser
} from '@multiversx/sdk-core';
import { SmartContract } from '@multiversx/sdk-core';

const contract = new SmartContract({
  address: Address.newFromBech32('${contractAddress}')
});

const interaction = contract.methods.${functionName}(${functionArgs.map((arg: string) => `'${arg}'`).join(', ')});
const transaction = interaction.buildTransaction();
\`\`\`

**Step 2: Configure Transaction**
\`\`\`typescript
const account = getAccount();
const network = getNetworkConfig();

transaction.setNonce(BigInt(account.nonce));
transaction.setSender(Address.newFromBech32(account.address));
transaction.setChainID(network.chainId);
transaction.setGasLimit(BigInt(6000000)); // Adjust based on function complexity
transaction.setValue(BigInt('${value}' + '0'.repeat(18)));
\`\`\`

**Step 3: Execute Transaction**
\`\`\`typescript
const provider = getAccountProvider();
const signedTransactions = await provider.signTransactions([transaction]);

const txManager = TransactionManager.getInstance();
const sentTransactions = await txManager.send(signedTransactions);

const sessionId = await txManager.track(sentTransactions, {
  transactionsDisplayInfo: {
    processingMessage: 'Executing smart contract function',
    errorMessage: 'Smart contract execution failed',
    successMessage: 'Smart contract executed successfully'
  }
});
\`\`\`

**Step 4: Parse Results (for view functions)**
\`\`\`typescript
import { ResultsParser } from '@multiversx/sdk-core';

const resultsParser = new ResultsParser();
const queryResponse = await networkProvider.queryContract(query);
const parsedResults = resultsParser.parseQueryResponse(queryResponse, endpoint);
\`\`\`

**Gas Estimation Guidelines:**
- Simple functions: 200,000 - 500,000 gas
- Complex functions: 1,000,000 - 6,000,000 gas
- Storage operations: Higher gas requirements
- Multiple contract calls: Multiply by number of calls

**Common Function Types:**
- View functions: Read-only, no gas required for queries
- Payable functions: Accept EGLD value
- Storage functions: Modify contract state
- Event emitters: Generate blockchain events

**Error Handling:**
- Check contract deployment status
- Validate function arguments
- Ensure sufficient gas limit
- Handle contract-specific errors`;
}

/**
 * Generate transaction monitoring template
 */
export function generateTransactionMonitoringTemplate(args: any): string {
  const sessionId = args?.sessionId || '[SESSION_ID]';
  const includeWebSocket = args?.includeWebSocket !== false;

  return `Monitor MultiversX Transaction Status:

**Session ID:** ${sessionId}

**Method 1: Using Store Selectors**
\`\`\`typescript
import { 
  getStore,
  transactionsSliceSelector,
  pendingTransactionsSessionsSelector
} from '@multiversx/sdk-dapp/out/store';

const store = getStore();
const state = store.getState();

// Get all transaction sessions
const allSessions = transactionsSliceSelector(state);
const currentSession = allSessions['${sessionId}'];

// Check if session is pending
const pendingSessions = pendingTransactionsSessionsSelector(state);
const isSessionPending = Object.keys(pendingSessions).includes('${sessionId}');

console.log('Session Status:', currentSession?.status);
console.log('Is Pending:', isSessionPending);
\`\`\`

**Method 2: Using React Hooks**
\`\`\`typescript
import { 
  useGetTransactionSessions,
  useGetPendingTransactionsSessions 
} from '@multiversx/sdk-dapp/out/react/transactions';

const { allSessions } = useGetTransactionSessions();
const { pendingSessions } = useGetPendingTransactionsSessions();

const currentSession = allSessions['${sessionId}'];
const isSessionPending = pendingSessions['${sessionId}'] !== undefined;
\`\`\`

**Method 3: Transaction Status Tracking**
\`\`\`typescript
import { TransactionWatcher } from '@multiversx/sdk-transaction-watcher';

const watcher = new TransactionWatcher({
  getTransaction: async (hash: string) => {
    // Implement transaction fetching logic
    const response = await fetch(\`\${apiUrl}/transactions/\${hash}\`);
    return response.json();
  }
});

await watcher.awaitCompleted(transactionHash);
\`\`\`

**Transaction Status Types:**
- \`pending\`: Transaction submitted but not yet processed
- \`sent\`: Transaction broadcast to network
- \`successful\`: Transaction executed successfully
- \`failed\`: Transaction failed during execution
- \`invalid\`: Transaction rejected due to validation errors
- \`timedOut\`: Transaction timed out waiting for confirmation

**Real-time Monitoring:**
${includeWebSocket ? `
\`\`\`typescript
// WebSocket connection for real-time updates
const wsUrl = 'wss://your-websocket-endpoint';
const socket = new WebSocket(wsUrl);

socket.onmessage = (event) => {
  const data = JSON.parse(event.data);
  if (data.sessionId === '${sessionId}') {
    console.log('Transaction update:', data);
  }
};
\`\`\`
` : ''}

**Custom Notification Handling:**
\`\`\`typescript
import { createCustomToast } from '@multiversx/sdk-dapp/out/store/actions/toasts/toastsActions';

// Create custom toast for transaction updates
createCustomToast({
  toastId: 'tx-${sessionId}',
  message: 'Transaction status updated',
  title: 'Transaction Update',
  icon: 'check'
});
\`\`\`

**Monitoring Best Practices:**
- Check transaction status regularly but not too frequently
- Handle timeout scenarios gracefully
- Provide clear user feedback
- Log transaction hashes for debugging
- Implement retry mechanisms for failed transactions
- Use WebSocket for real-time updates when available`;
}

/**
 * Generate wallet setup guide
 */
export function generateWalletSetupGuide(args: any): string {
  const provider = args?.provider || 'any supported provider';

  return `Setting up a MultiversX wallet using ${provider}:

**Available Wallet Options:**
1. **MultiversX DeFi Wallet Extension** - Browser extension for Chrome/Firefox
2. **MultiversX Web Wallet** - Web-based wallet at wallet.multiversx.com
3. **WalletConnect** - Connect mobile wallets via QR code
4. **Ledger Hardware Wallet** - Hardware wallet for maximum security

**Setup Process:**
1. Choose your preferred wallet provider
2. Install the wallet software/extension
3. Create a new wallet or import existing one
4. Secure your seed phrase (write it down safely!)
5. Fund your wallet if needed
6. Connect to your application

**Security Best Practices:**
- Never share your seed phrase with anyone
- Use hardware wallets for large amounts
- Enable all available security features
- Keep your wallet software updated
- Always verify transaction details before signing

**SDK-dApp Integration:**
\`\`\`typescript
import { initApp } from '@multiversx/sdk-dapp/out/methods/initApp/initApp';
import type { InitAppType } from '@multiversx/sdk-dapp/out/methods/initApp/initApp.types';
import { EnvironmentsEnum } from '@multiversx/sdk-dapp/out/types/enums.types';

const config: InitAppType = {
  storage: { getStorageCallback: () => sessionStorage },
  dAppConfig: {
    environment: EnvironmentsEnum.devnet, // or testnet/mainnet
    successfulToastLifetime: 5000
  }
};

initApp(config).then(() => {
  // Your app initialization code
});
\`\`\`

**Provider Setup with UnlockPanelManager:**
\`\`\`typescript
import { UnlockPanelManager } from '@multiversx/sdk-dapp/out/managers/UnlockPanelManager';

const unlockPanelManager = UnlockPanelManager.init({
  loginHandler: () => {
    // Handle successful login
    navigate('/dashboard');
  },
  onClose: () => {
    // Handle panel close
    navigate('/');
  },
});

const handleConnect = () => {
  unlockPanelManager.openUnlockPanel();
};
\`\`\`

**Programmatic Provider Login:**
\`\`\`typescript
import { ProviderFactory } from '@multiversx/sdk-dapp/out/providers/ProviderFactory';
import { ProviderTypeEnum } from '@multiversx/sdk-dapp/out/providers/types/providerFactory.types';

// Extension wallet login
const extensionProvider = await ProviderFactory.create({
  type: ProviderTypeEnum.extension
});
await extensionProvider.login();

// WalletConnect login
const walletConnectProvider = await ProviderFactory.create({
  type: ProviderTypeEnum.walletconnect
});
await walletConnectProvider.login();
\`\`\``;
}

/**
 * Generate network switch instructions
 */
export function generateNetworkSwitchInstructions(args: any): string {
  const targetNetwork = args?.targetNetwork || '[TARGET_NETWORK]';

  return `Switching to MultiversX ${targetNetwork}:

**Available Networks:**
- **Mainnet** - Production network with real EGLD
- **Testnet** - Testing network with test tokens
- **Devnet** - Development network for testing

**Switch Instructions:**
1. Open your MultiversX wallet
2. Look for network selector (usually in settings or top bar)
3. Select "${targetNetwork}" from the dropdown
4. Wait for the wallet to connect to the new network
5. Verify you're on the correct network by checking:
   - Network name in wallet interface
   - Explorer URL matches the target network
   - Account balance reflects the correct network

**SDK-dApp Network Configuration:**
\`\`\`typescript
import { initApp } from '@multiversx/sdk-dapp/out/methods/initApp/initApp';
import { EnvironmentsEnum } from '@multiversx/sdk-dapp/out/types/enums.types';

// Configure for different networks
const config = {
  storage: { getStorageCallback: () => sessionStorage },
  dAppConfig: {
    environment: EnvironmentsEnum.${targetNetwork.toLowerCase()}, // devnet, testnet, or mainnet
    // Optional network overrides
    network: {
      walletAddress: 'https://${targetNetwork.toLowerCase()}-wallet.multiversx.com',
      explorerAddress: 'https://${targetNetwork.toLowerCase()}-explorer.multiversx.com',
      apiAddress: 'https://${targetNetwork.toLowerCase()}-api.multiversx.com'
    }
  }
};
\`\`\`

**Network Configuration Constants:**
\`\`\`typescript
const NETWORK_CONFIG = {
  mainnet: {
    chainId: '1',
    name: 'Mainnet',
    explorerUrl: 'https://explorer.multiversx.com',
    apiUrl: 'https://api.multiversx.com',
    walletUrl: 'https://wallet.multiversx.com'
  },
  testnet: {
    chainId: 'T',
    name: 'Testnet',
    explorerUrl: 'https://testnet-explorer.multiversx.com',
    apiUrl: 'https://testnet-api.multiversx.com',
    walletUrl: 'https://testnet-wallet.multiversx.com'
  },
  devnet: {
    chainId: 'D',
    name: 'Devnet',
    explorerUrl: 'https://devnet-explorer.multiversx.com',
    apiUrl: 'https://devnet-api.multiversx.com',
    walletUrl: 'https://devnet-wallet.multiversx.com'
  }
};
\`\`\`

**Detecting Current Network:**
\`\`\`typescript
import { useGetNetworkConfig } from '@multiversx/sdk-dapp/out/react/network/useGetNetworkConfig';

const { network } = useGetNetworkConfig();
console.log('Current network:', network.chainId);
console.log('Network name:', network.name);
console.log('Explorer URL:', network.explorerAddress);
\`\`\`

**Important Network Considerations:**
- Tokens on different networks are separate
- Use testnet/devnet for development and testing
- Always verify network before making transactions
- Some dApps may require specific networks
- Contract addresses differ between networks
- Always double-check network before signing transactions
- Gas costs may vary between networks`;
} 