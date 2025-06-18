/**
 * MultiversX Account Query Tool
 * Handles querying account information from MultiversX networks
 */

import { logger } from '../utils/logger.js';
import { NETWORKS } from '../utils/constants.js';

// Type definitions for MultiversX account response
export interface MultiversXAccount {
  address: string;
  balance: string;
  nonce: number;
  timestamp: number;
  shard: number;
  ownerAddress?: string;
  assets?: Record<string, any>;
  deployedAt?: number;
  deployTxHash?: Record<string, any>;
  ownerAssets?: Record<string, any>;
  isVerified?: boolean;
  txCount?: number;
  scrCount?: number;
  transfersLast24h?: number;
  code?: string;
  codeHash?: string;
  rootHash?: string;
  username?: Record<string, any>;
  developerReward?: string;
  isUpgradeable?: boolean;
  isReadable?: boolean;
  isPayable?: boolean;
  isPayableBySmartContract?: boolean;
  scamInfo?: {
    type: string;
    info: string;
  };
  nftCollections?: boolean;
  nfts?: boolean;
  activeGuardianActivationEpoch?: number;
  activeGuardianAddress?: string;
  activeGuardianServiceUid?: string;
  pendingGuardianActivationEpoch?: number;
  pendingGuardianAddress?: string;
  pendingGuardianServiceUid?: string;
  isGuarded?: boolean;
}

// Query options interface
export interface QueryAccountOptions {
  withGuardianInfo?: boolean;
  withTxCount?: boolean;
  withScrCount?: boolean;
  withTimestamp?: boolean;
  withAssets?: boolean;
  timestamp?: number;
}

/**
 * Query MultiversX account information
 */
export async function queryAccount(
  address: string,
  network: keyof typeof NETWORKS = 'MAINNET',
  options: QueryAccountOptions = {}
): Promise<MultiversXAccount> {
  const networkConfig = NETWORKS[network];
  if (!networkConfig) {
    throw new Error(`Invalid network: ${network}`);
  }

  // Build query parameters
  const queryParams = new URLSearchParams();
  if (options.withGuardianInfo) queryParams.append('withGuardianInfo', 'true');
  if (options.withTxCount) queryParams.append('withTxCount', 'true');
  if (options.withScrCount) queryParams.append('withScrCount', 'true');
  if (options.withTimestamp) queryParams.append('withTimestamp', 'true');
  if (options.withAssets) queryParams.append('withAssets', 'true');
  if (options.timestamp) queryParams.append('timestamp', options.timestamp.toString());

  const url = `${networkConfig.apiUrl}/accounts/${address}${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;

  logger.debug(`Querying account from: ${url}`);

  try {
    const response = await fetch(url);
    
    if (!response.ok) {
      if (response.status === 404) {
        throw new Error(`Account not found: ${address}`);
      }
      throw new Error(`API request failed: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data as MultiversXAccount;
  } catch (error) {
    logger.error(`Failed to query account ${address} on ${network}:`, error);
    throw error;
  }
}

/**
 * Format account information for display
 */
export function formatAccountInfo(account: MultiversXAccount, network: string): string {
  const balance = account.balance ? (parseFloat(account.balance) / Math.pow(10, 18)).toFixed(6) : '0';
  
  let result = `**MultiversX Account Information (${network})**\n\n`;
  result += `**Address:** ${account.address}\n`;
  result += `**Balance:** ${balance} EGLD\n`;
  result += `**Nonce:** ${account.nonce}\n`;
  result += `**Shard:** ${account.shard}\n`;
  
  if (account.timestamp) {
    const date = new Date(account.timestamp * 1000);
    result += `**Last Activity:** ${date.toISOString()}\n`;
  }

  if (account.isVerified !== undefined) {
    result += `**Verified:** ${account.isVerified ? 'Yes' : 'No'}\n`;
  }

  if (account.txCount !== undefined) {
    result += `**Transaction Count:** ${account.txCount}\n`;
  }

  if (account.scrCount !== undefined) {
    result += `**Smart Contract Results Count:** ${account.scrCount}\n`;
  }

  if (account.transfersLast24h !== undefined) {
    result += `**Transfers (Last 24h):** ${account.transfersLast24h}\n`;
  }

  if (account.ownerAddress) {
    result += `**Owner Address:** ${account.ownerAddress}\n`;
  }

  if (account.code) {
    result += `**Contract Code:** Present\n`;
    result += `**Code Hash:** ${account.codeHash || 'N/A'}\n`;
    result += `**Upgradeable:** ${account.isUpgradeable ? 'Yes' : 'No'}\n`;
    result += `**Readable:** ${account.isReadable ? 'Yes' : 'No'}\n`;
    result += `**Payable:** ${account.isPayable ? 'Yes' : 'No'}\n`;
    result += `**Payable by SC:** ${account.isPayableBySmartContract ? 'Yes' : 'No'}\n`;
  }

  if (account.username && Object.keys(account.username).length > 0) {
    result += `**Username:** ${JSON.stringify(account.username)}\n`;
  }

  if (account.isGuarded) {
    result += `**Guardian Status:** Guarded\n`;
    if (account.activeGuardianAddress) {
      result += `**Active Guardian:** ${account.activeGuardianAddress}\n`;
    }
    if (account.pendingGuardianAddress) {
      result += `**Pending Guardian:** ${account.pendingGuardianAddress}\n`;
    }
  }

  if (account.scamInfo) {
    result += `**⚠️ Scam Warning:** ${account.scamInfo.type} - ${account.scamInfo.info}\n`;
  }

  return result;
}

/**
 * Validate MultiversX address format
 */
export function validateAddress(address: string): void {
  if (!address) {
    throw new Error('Address parameter is required');
  }

  if (!address.startsWith('erd1')) {
    throw new Error('Invalid MultiversX address format. Address must start with "erd1"');
  }
}

/**
 * Handle the query account tool execution
 */
export async function handleQueryAccount(args: any): Promise<{ content: Array<{ type: string; text: string }> }> {
  const address = args?.address as string;
  const network = (args?.network as keyof typeof NETWORKS) || 'MAINNET';
  const options: QueryAccountOptions = {
    withGuardianInfo: args?.withGuardianInfo as boolean,
    withTxCount: args?.withTxCount as boolean,
    withScrCount: args?.withScrCount as boolean,
    withTimestamp: args?.withTimestamp as boolean,
    withAssets: args?.withAssets as boolean,
    timestamp: args?.timestamp as number,
  };

  validateAddress(address);

  const account = await queryAccount(address, network, options);
  const formattedInfo = formatAccountInfo(account, network);

  return {
    content: [{
      type: 'text',
      text: formattedInfo,
    }],
  };
} 