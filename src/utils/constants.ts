/**
 * Constants for the MultiversX MCP server
 */

// Error codes for MCP responses
export const ERROR_CODES = {
  INVALID_REQUEST: -32600,
  METHOD_NOT_FOUND: -32601,
  INVALID_PARAMS: -32602,
  INTERNAL_ERROR: -32603,
  PARSE_ERROR: -32700,
  // Custom error codes
  RESOURCE_NOT_FOUND: -1001,
  TOOL_EXECUTION_ERROR: -1002,
  NETWORK_ERROR: -1003,
  VALIDATION_ERROR: -1004,
} as const;

// MultiversX network configurations
export const NETWORKS = {
  MAINNET: {
    chainId: '1',
    name: 'Mainnet',
    explorerUrl: 'https://explorer.multiversx.com',
    apiUrl: 'https://api.multiversx.com',
  },
  TESTNET: {
    chainId: 'T',
    name: 'Testnet',
    explorerUrl: 'https://testnet-explorer.multiversx.com',
    apiUrl: 'https://testnet-api.multiversx.com',
  },
  DEVNET: {
    chainId: 'D',
    name: 'Devnet',
    explorerUrl: 'https://devnet-explorer.multiversx.com',
    apiUrl: 'https://devnet-api.multiversx.com',
  },
} as const;

// Resource URIs
export const RESOURCE_URIS = {
  SDK_DAPP_INIT: 'mx://sdk-dapp-init',
  SDK_DAPP_LOGIN_LOGOUT: 'mx://sdk-dapp-login-logout',
  SDK_DAPP_CUSTOM_PROVIDERS: 'mx://sdk-dapp-custom-providers',
  SDK_DAPP_TRANSACTIONS: 'mx://sdk-dapp-transactions',
  SDK_DAPP_REACT: 'urn:sdk-dapp-react',
} as const;

// Tool names
export const TOOL_NAMES = {
  QUERY_ACCOUNT: 'mx:query-account',
} as const;

// Prompt names
export const PROMPT_NAMES = {
  TRANSACTION_TEMPLATE: 'mx-transaction-template',
  BATCH_TRANSACTION_TEMPLATE: 'mx-batch-transaction-template',
  SMART_CONTRACT_TEMPLATE: 'mx-smart-contract-template',
  TRANSACTION_MONITORING_TEMPLATE: 'mx-transaction-monitoring-template',
  WALLET_SETUP_GUIDE: 'mx-wallet-setup-guide',
  NETWORK_SWITCH_INSTRUCTIONS: 'mx-network-switch-instructions',
} as const; 