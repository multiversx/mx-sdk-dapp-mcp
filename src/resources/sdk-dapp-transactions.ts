/**
 * Transaction Management Resource
 * Comprehensive guide for signing and sending different types of transactions in SDK-DAPP v5
 */

import { RESOURCE_URIS } from '../utils/constants.js';
import { logger } from '../utils/logger.js';

export class SDKDappTransactionsResource {
  /**
   * Read transaction management guide
   */
  static async read() {
    logger.debug('Reading transaction management resource');

    const transactionGuide = {
      title: 'MultiversX SDK-DAPP v5 Transaction Management Guide',
      version: '5.x',
      description: 'Complete guide for signing and sending different types of transactions',
      
      overview: {
        description: 'SDK-DAPP v5 provides comprehensive transaction management capabilities',
        transactionFlow: [
          '1. Create Transaction object from @multiversx/sdk-core',
          '2. Sign the transaction with the initialized provider',
          '3. Send the signed transaction using TransactionManager',
          '4. Track transaction status and display feedback to user'
        ],
        transactionTypes: [
          'Simple EGLD transfers',
          'Smart contract interactions',
          'ESDT token transfers',
          'NFT transfers',
          'Batch transactions'
        ]
      },

      basicTransactionFlow: {
        description: 'Standard flow for creating, signing, and sending transactions',
        helperFunction: `import {
  getAccountProvider,
  Transaction,
  TransactionManager,
  TransactionsDisplayInfoType
} from '@multiversx/sdk-dapp';

type SignAndSendTransactionsProps = {
  transactions: Transaction[];
  transactionsDisplayInfo?: TransactionsDisplayInfoType;
};

export const signAndSendTransactions = async ({
  transactions,
  transactionsDisplayInfo
}: SignAndSendTransactionsProps) => {
  const provider = getAccountProvider();
  const txManager = TransactionManager.getInstance();

  // Sign transactions with the user's provider
  const signedTransactions = await provider.signTransactions(transactions);
  
  // Send signed transactions to the network
  const sentTransactions = await txManager.send(signedTransactions);
  
  // Track transaction status and show user feedback
  const sessionId = await txManager.track(sentTransactions, {
    transactionsDisplayInfo
  });

  return sessionId;
};`,

        usage: `// Use the helper function
const sessionId = await signAndSendTransactions({
  transactions: [myTransaction],
  transactionsDisplayInfo: {
    processingMessage: 'Processing transaction...',
    errorMessage: 'Transaction failed',
    successMessage: 'Transaction successful'
  }
});`
      },

      smartContractTransactions: {
        description: 'Examples based on ping-pong contract interactions',
        
        manualPingTransaction: `import {
  Address,
  Transaction,
  TransactionPayload,
  GAS_PRICE
} from '@multiversx/sdk-dapp';
import { useGetAccount, useGetNetworkConfig } from '@multiversx/sdk-dapp';

const PING_TRANSACTION_INFO = {
  processingMessage: 'Processing Ping transaction',
  errorMessage: 'An error has occured during Ping',
  successMessage: 'Ping transaction successful'
};

export const useSendPingPongTransaction = () => {
  const { network } = useGetNetworkConfig();
  const { address, nonce } = useGetAccount();

  const sendPingTransaction = async (amount: string) => {
    const pingTransaction = new Transaction({
      value: BigInt(amount),
      data: new TransactionPayload('ping'),
      receiver: Address.newFromBech32(contractAddress),
      gasLimit: BigInt(6000000),
      gasPrice: BigInt(GAS_PRICE),
      chainID: network.chainId,
      nonce: BigInt(nonce),
      sender: Address.newFromBech32(address),
      version: 1
    });

    await signAndSendTransactions({
      transactions: [pingTransaction],
      transactionsDisplayInfo: PING_TRANSACTION_INFO
    });
  };

  return { sendPingTransaction };
};`,

        abiBasedPingTransaction: `import axios from 'axios';
import {
  AbiRegistry,
  Address,
  SmartContractTransactionsFactory,
  TransactionsFactoryConfig
} from '@multiversx/sdk-dapp';

export const usePingPongWithAbi = () => {
  const { network } = useGetNetworkConfig();
  const { address } = useGetAccount();

  const getSmartContractFactory = async () => {
    const response = await axios.get('src/contracts/ping-pong.abi.json');
    const abi = AbiRegistry.create(response.data);
    const scFactory = new SmartContractTransactionsFactory({
      config: new TransactionsFactoryConfig({
        chainID: network.chainId
      }),
      abi
    });

    return scFactory;
  };

  const sendPingTransactionFromAbi = async (amount: string) => {
    const scFactory = await getSmartContractFactory();
    const pingTransaction = scFactory.createTransactionForExecute(
      Address.newFromBech32(address),
      {
        gasLimit: BigInt(6000000),
        function: 'ping',
        contract: Address.newFromBech32(contractAddress),
        nativeTransferAmount: BigInt(amount)
      }
    );

    const sessionId = await signAndSendTransactions({
      transactions: [pingTransaction],
      transactionsDisplayInfo: PING_TRANSACTION_INFO
    });

    return sessionId;
  };

  const sendPongTransactionFromAbi = async () => {
    const scFactory = await getSmartContractFactory();
    const pongTransaction = scFactory.createTransactionForExecute(
      Address.newFromBech32(address),
      {
        gasLimit: BigInt(6000000),
        function: 'pong',
        contract: Address.newFromBech32(contractAddress),
        nativeTransferAmount: BigInt(0)
      }
    );

    const sessionId = await signAndSendTransactions({
      transactions: [pongTransaction],
      transactionsDisplayInfo: {
        processingMessage: 'Processing Pong transaction',
        errorMessage: 'An error has occured during Pong',
        successMessage: 'Pong transaction successful'
      }
    });

    return sessionId;
  };

  return { sendPingTransactionFromAbi, sendPongTransactionFromAbi };
};`
      },

      transactionFromService: {
        description: 'Using pre-built transactions from services',
        example: `// Using transactions created by external services
const sendPingTransactionFromService = async (
  transactions: Transaction[]
) => {
  await signAndSendTransactions({
    transactions,
    transactionsDisplayInfo: PING_TRANSACTION_INFO
  });
};

const sendPongTransactionFromService = async (
  transactions: Transaction[]
) => {
  const sessionId = await signAndSendTransactions({
    transactions,
    transactionsDisplayInfo: PONG_TRANSACTION_INFO
  });

  return sessionId;
};`
      },

      batchTransactions: {
        description: 'Sending multiple transactions in parallel or sequential batches',
        
        parallelTransactions: `// Parallel Transaction Execution - All at once
const sendParallelTransactions = async () => {
  const transactions = [transaction1, transaction2, transaction3];
  
  return await signAndSendTransactions({
    transactions,
    transactionsDisplayInfo: {
      processingMessage: 'Processing batch transactions',
      errorMessage: 'Batch transaction failed',
      successMessage: 'All transactions completed successfully'
    }
  });
};`,

        sequentialBatches: `// Sequential Batch Execution - One batch after another
const sendSequentialBatches = async () => {
  const batch1 = [transaction1, transaction2];
  const batch2 = [transaction3];
  
  const provider = getAccountProvider();
  const txManager = TransactionManager.getInstance();

  // Sign all batches
  const signedBatch1 = await provider.signTransactions(batch1);
  const signedBatch2 = await provider.signTransactions(batch2);
  const batchedTransactions = [signedBatch1, signedBatch2];

  // Send batches sequentially  
  const sentTransactions = await txManager.send(batchedTransactions);
  
  return await txManager.track(sentTransactions, {
    transactionsDisplayInfo: {
      processingMessage: 'Processing sequential batches',
      errorMessage: 'Batch execution failed',
      successMessage: 'All batches completed successfully'
    }
  });
};`
      },

      bestPractices: {
        security: [
          'Always validate transaction parameters before signing',
          'Use proper gas limits to avoid failed transactions',  
          'Implement proper error handling and user feedback',
          'Validate recipient addresses before sending'
        ],
        
        performance: [
          'Batch related transactions when possible',
          'Cache ABI data to avoid repeated network calls',
          'Use appropriate gas limits',
          'Refresh account nonce before transactions'
        ],
        
        userExperience: [
          'Show clear transaction status updates',  
          'Provide links to blockchain explorer',
          'Handle network switching gracefully',
          'Display transaction costs before confirmation'
        ]
      },

      generatedAt: new Date().toISOString()
    };

    return {
      contents: [{
        uri: RESOURCE_URIS.SDK_DAPP_TRANSACTIONS,
        mimeType: 'application/json',
        text: JSON.stringify(transactionGuide, null, 2),
      }],
    };
  }
} 