/**
 * MultiversX Transaction Prompts
 * Based on SDK-DAPP-V5-GUIDE.md for comprehensive transaction handling
 */

import { logger } from '../utils/logger.js';

/**
 * Generate transaction template with comprehensive MultiversX transaction flow
 */
interface TransactionTemplateArgs {
  recipient?: string;
  amount?: string;
  data?: string;
  contractAddress?: string;
  functionName?: string;
  functionArgs?: string[];
}

export function generateTransactionTemplate(args?: TransactionTemplateArgs): string {
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
${
  isSmartContractCall
    ? `- Contract Address: ${contractAddress}
- Function: ${functionName}
- Arguments: ${functionArgs.length > 0 ? functionArgs.join(', ') : 'None'}`
    : ''
}

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
  // Validate and convert amount to wei
  value: (() => {
    const amountFloat = parseFloat('${amount}');
    if (isNaN(amountFloat) || amountFloat < 0) {
      throw new Error('Invalid amount: must be a non-negative number');
    }
    // Convert EGLD to wei (1 EGLD = 1e18 wei)
    return BigInt(Math.floor(amountFloat * 1e18));
  })(),
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
interface BatchTransactionTemplateArgs {
  transactions?: any[];
  batchType?: 'parallel' | 'sequential';
}

export function generateBatchTransactionTemplate(args?: BatchTransactionTemplateArgs): string {
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
${
  batchType === 'parallel'
    ? `
\`\`\`typescript
// Parallel execution - all transactions sent simultaneously
const txManager = TransactionManager.getInstance();
const sentTransactions = await txManager.send(signedTransactions);
\`\`\`
`
    : `
\`\`\`typescript
// Sequential execution - transactions sent in batches
const batchTransactions = [
  [signedTransactions[0]], // First batch
  [signedTransactions[1]]  // Second batch (waits for first to complete)
];
const txManager = TransactionManager.getInstance();
const sentTransactions = await txManager.send(batchTransactions);
\`\`\`
`
}

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
- ${
    batchType === 'parallel'
      ? 'Faster execution for independent transactions'
      : 'Guaranteed order of execution'
  }
- Reduced user interaction
- Better UX for complex operations
- Atomic operations when needed

**Important Notes:**
- ${
    batchType === 'parallel'
      ? 'Ensure transactions are independent'
      : 'Consider gas costs for sequential execution'
  }
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

const interaction = contract.methods.${functionName}(${functionArgs
    .map((arg: string) => `'${arg}'`)
    .join(', ')});
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
