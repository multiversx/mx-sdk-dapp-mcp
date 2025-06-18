# MultiversX MCP Server

A comprehensive Model Context Protocol (MCP) server implementation for the MultiversX blockchain ecosystem. This server provides AI agents and applications with access to MultiversX SDK-dApp v5 documentation, development resources, transaction templates, and blockchain data querying capabilities.

## 🚀 Features

### 📚 Resources (Knowledge Base)

Comprehensive MultiversX SDK-dApp v5 documentation and guides:

- **SDK-dApp v5 Complete Guide** (`mx://sdk-dapp-guide`) - Architecture, installation, configuration, and best practices
- **Login & Logout Guide** (`mx://sdk-dapp-login-logout`) - Complete authentication implementation
- **React Hooks Guide** (`mx://sdk-dapp-react`) - Reactive hooks for React applications
- **Transaction Management** (`mx://sdk-dapp-transactions`) - Transaction creation, signing, and tracking
- **Custom Providers** (`mx://sdk-dapp-custom-providers`) - Creating custom wallet providers
- **Initialization Guide** (`mx://sdk-dapp-init`) - App setup and configuration

### 🔧 Tools (Executable Functions)

Blockchain interaction capabilities:

- **Query Account** (`mx:query-account`) - Retrieve account information from any MultiversX network

### 📝 Prompts (Templates)

Ready-to-use templates for common development tasks:

- **Transaction Template** (`mx-transaction-template`) - Complete transaction workflow
- **Batch Transaction Template** (`mx-batch-transaction-template`) - Parallel/sequential batching
- **Smart Contract Template** (`mx-smart-contract-template`) - Contract interaction workflows

## 📦 Installation

### Prerequisites

- Node.js (v18 or higher)
- pnpm (recommended) or npm

### Quick Setup

```bash
# Clone the repository
git clone <repository-url>
cd mx-dev-mcp

# Install dependencies
pnpm install

# Build the project
pnpm build

# Test the server (optional)
pnpm start
```

## 🔧 Development

```bash
# Watch mode for development
npm run watch

# Run in development mode
npm run dev

# Run linting
npm run lint

# Run tests
npm test

# Clean build artifacts
npm run clean
```

## ⚙️ Configuration

### Environment Variables

- `LOG_LEVEL` - Set logging level (DEBUG, INFO, WARN, ERROR)
- `MULTIVERSX_NETWORK` - Default network (mainnet, testnet, devnet)

### Network Support

The server supports all MultiversX networks:

- **Mainnet** - Production network
- **Testnet** - Testing network
- **Devnet** - Development network

## 🏗️ Project Structure

```
src/
├── index.ts              # Main entry point
├── resources/            # MCP resources (documentation)
│   ├── index.ts         # Resource handler setup
│   ├── sdk-dapp-guide.ts    # Complete SDK-dApp guide
│   ├── sdk-dapp-init.ts     # Initialization guide
│   ├── sdk-dapp-login-logout.ts # Authentication guide
│   ├── sdk-dapp-react.ts    # React hooks guide
│   ├── sdk-dapp-transactions.ts # Transaction guide
│   └── sdk-dapp-custom-providers.ts # Custom providers guide
├── tools/               # MCP tools (executable functions)
│   ├── index.ts         # Tool handler setup
│   └── query-account.ts # Account querying tool
├── prompts/             # MCP prompts (templates)
│   ├── index.ts         # Prompt handler setup
│   └── sdk-dapp-transaction.ts # Transaction templates
└── utils/               # Utilities
    ├── logger.ts        # Logging utility
    └── constants.ts     # Constants and configurations
```

## 🔌 Client Integration

### Cursor IDE Integration

#### Step 1: Clone and Setup

```bash
git clone <repository-url>
cd mx-dev-mcp
pnpm install && pnpm build
```

#### Step 2: Configure Cursor MCP Settings

Add to Cursor Settings → Features → Model Context Protocol:

```json
{
  "mcpServers": {
    "mvx-dev-mcp": {
      "name": "MultiversX SDK development MCP Server",
      "command": "node",
      "args": ["<absolute-path-to-repo>/mx-dev-mcp/dist/index.js"],
      "env": {
        "LOG_LEVEL": "INFO"
      }
    }
  }
}
```

**Important**: Replace `<absolute-path-to-repo>` with the actual absolute path.

#### Step 3: Alternative Configuration (npm link)

```bash
# In the mx-dev-mcp directory
npm link

# Then in Cursor MCP settings:
{
  "name": "MultiversX MCP Server",
  "command": "mx-dev-mcp"
}
```

### Claude Desktop Integration

Add to `~/Library/Application Support/Claude/claude_desktop_config.json` (macOS):

```json
{
  "mcpServers": {
    "mvx-dev-mcp": {
      "name": "MultiversX SDK development MCP Server",
      "command": "node",
      "args": ["<absolute-path-to-repo>/mx-dev-mcp/dist/index.js"],
      "env": {
        "LOG_LEVEL": "INFO"
      }
    }
  }
}
```

## 📚 Resources Documentation

### 1. SDK-dApp v5 Complete Guide (`mx://sdk-dapp-guide`)

Comprehensive guide covering:

- Overview and architecture
- Installation and setup
- Configuration options
- Provider interactions
- Data access patterns
- Transaction management
- Internal structure
- Network configuration
- Account management
- UI components
- Debugging strategies

### 2. Login & Logout Guide (`mx://sdk-dapp-login-logout`)

Complete authentication implementation:

- UnlockPanelManager usage
- Programmatic login approaches
- Supported wallet providers
- Login status monitoring
- Logout implementation
- Route protection
- Error handling
- Best practices

### 3. React Hooks Guide (`mx://sdk-dapp-react`)

Reactive hooks for React applications:

- `useGetAccount()` - Account data access
- `useGetLoginInfo()` - Login status and method
- `useGetNetworkConfig()` - Network configuration
- `useGetTransactionSessions()` - Transaction tracking
- `useSelector()` - Custom store queries
- Practical usage examples
- Best practices and troubleshooting

### 4. Transaction Management (`mx://sdk-dapp-transactions`)

Complete transaction handling:

- Transaction creation workflow
- Signing processes
- Batch transactions (parallel/sequential)
- Smart contract interactions
- ABI-based transactions
- Transaction tracking
- Status monitoring
- Error handling

### 5. Custom Providers (`mx://sdk-dapp-custom-providers`)

Creating custom wallet providers:

- IProvider interface implementation
- Provider registration methods
- UI component integration
- Advanced examples (PEM, Keystore, Hardware)
- Security best practices
- Testing strategies
- Troubleshooting guide

### 6. Initialization Guide (`mx://sdk-dapp-init`)

App setup and configuration:

- Basic initialization
- Environment configuration
- Storage options
- Network settings
- Custom provider setup
- Framework-specific examples (React, Next.js, Solid.js)
- Production considerations
- Common issues and solutions

## 🔧 Tools Documentation

### Query Account Tool (`mx:query-account`)

Query MultiversX account information including balance, nonce, transactions, and guardian status.

**Parameters:**

- `address` (required): MultiversX account address (erd1... format)
- `network`: MAINNET, TESTNET, or DEVNET (default: MAINNET)
- `withTxCount`: Include transaction count (default: false)
- `withGuardianInfo`: Include guardian information (default: false)
- `withScrCount`: Include smart contract results count (default: false)
- `withTimestamp`: Include timestamp of last activity (default: false)
- `withAssets`: Include assets (tokens/NFTs) (default: false)
- `timestamp`: Retrieve account state from specific timestamp

**Usage Examples:**

```
Query the MultiversX account erd1qga7ze0l03chfgru0a32wxqf2226nzrxnyhzer9lmudqhjgy7ycqjjyknz
```

```
Get balance for address erd1qga7ze0l03chfgru0a32wxqf2226nzrxnyhzer9lmudqhjgy7ycqjjyknz on testnet
```

```
Show detailed account info with transaction count for erd1qga7ze0l03chfgru0a32wxqf2226nzrxnyhzer9lmudqhjgy7ycqjjyknz
```

**Response Format:**

- Address and balance information
- Transaction counts and activity
- Guardian status (if requested)
- Smart contract details (if applicable)
- Asset information (if requested)
- Verification status and metadata

## 📝 Prompts Documentation

### 1. Transaction Template (`mx-transaction-template`)

Comprehensive template for creating MultiversX transactions with complete workflow.

**Arguments:**

- `recipient` (optional): The recipient address
- `amount` (optional): The amount to send (in EGLD)
- `data` (optional): Optional transaction data
- `contractAddress` (optional): Smart contract address
- `functionName` (optional): Smart contract function name
- `functionArgs` (optional): Smart contract function arguments array

**Generated Workflow:**

1. Transaction object creation with validation
2. Amount conversion (EGLD to wei)
3. Provider-based transaction signing
4. Transaction broadcasting
5. Status tracking and monitoring
6. Error handling and security notes

**Usage Examples:**

```
Create a transaction template for sending 1 EGLD to erd1qga7ze0l03chfgru0a32wxqf2226nzrxnyhzer9lmudqhjgy7ycqjjyknz
```

```
Generate smart contract interaction template for contract erd1qqqqqqqqqqqqqpgqak8zt22wl2ph4tswtyc39namqx6ysa2sd8ss4xmlj with function ping
```

### 2. Batch Transaction Template (`mx-batch-transaction-template`)

Template for creating batch transactions with parallel or sequential execution.

**Arguments:**

- `batchType` (optional): "parallel" or "sequential" (default: parallel)
- `transactions` (optional): Array of transaction objects

**Generated Workflow:**

1. Multiple transaction creation
2. Batch configuration (parallel vs sequential)
3. Batch signing process
4. Execution strategy implementation
5. Comprehensive tracking
6. Error handling for batch operations

**Usage Examples:**

```
Create a parallel batch transaction template for multiple transfers
```

```
Generate sequential batch transaction template for dependent operations
```

### 3. Smart Contract Template (`mx-smart-contract-template`)

Template for smart contract interactions with detailed workflow.

**Arguments:**

- `contractAddress` (optional): The smart contract address
- `functionName` (optional): The function to call
- `functionArgs` (optional): Array of function arguments
- `value` (optional): EGLD value to send with transaction

**Generated Workflow:**

1. Contract interaction preparation
2. Transaction configuration with proper gas limits
3. Function call setup
4. Transaction execution
5. Result parsing (for view functions)
6. Gas estimation guidelines
7. Error handling strategies

**Usage Examples:**

```
Create smart contract interaction template for ping-pong contract
```

```
Generate contract template for token transfer function
```

## 🔍 Usage Examples

### Querying Account Information

```
"Query the MultiversX account erd1qga7ze0l03chfgru0a32wxqf2226nzrxnyhzer9lmudqhjgy7ycqjjyknz on mainnet"
```

```
"Get detailed account info with transaction count and guardian status for erd1qga7ze0l03chfgru0a32wxqf2226nzrxnyhzer9lmudqhjgy7ycqjjyknz"
```

### Accessing Documentation

```
"Show me the SDK-dApp login implementation guide"
```

```
"How do I use React hooks with MultiversX SDK-dApp?"
```

```
"What are the best practices for custom provider development?"
```

### Generating Transaction Templates

```
"Create a transaction template for sending 5 EGLD to erd1..."
```

```
"Generate a smart contract interaction template for a token swap"
```

```
"Show me how to create batch transactions for multiple operations"
```

## 🔧 Troubleshooting

### Common Issues

#### 1. MCP Server Not Connecting

**Problem**: Cursor shows "MCP server failed to start"
**Solutions**:

- Ensure absolute path is correct in configuration
- Verify project is built: `pnpm build`
- Check Node.js installation and accessibility
- Restart Cursor after configuration changes

#### 2. Account Query Failures

**Problem**: "Account not found" or API errors
**Solutions**:

- Verify address format (must start with "erd1")
- Check network connectivity
- Try with known valid address: `erd1qga7ze0l03chfgru0a32wxqf2226nzrxnyhzer9lmudqhjgy7ycqjjyknz`
- Ensure correct network selection

#### 3. Build Errors

**Problem**: TypeScript compilation errors
**Solutions**:

- Ensure Node.js version 18+
- Clean install: `rm -rf node_modules && pnpm install`
- Check TypeScript errors: `pnpm tsc --noEmit`

#### 4. Template Generation Issues

**Problem**: Prompts not generating correctly
**Solutions**:

- Verify prompt arguments are properly formatted
- Check for required parameters
- Review generated templates for completeness

### Debug Mode

Enable debug logging:

```json
{
  "env": {
    "LOG_LEVEL": "DEBUG"
  }
}
```

### Getting Help

If you encounter issues:

1. Check troubleshooting section
2. Verify setup against installation instructions
3. Test server independently: `pnpm start`
4. Check MCP server logs in client settings
5. Review console output for error details

## 🏆 Best Practices

### Security

- Always validate addresses before querying
- Use appropriate network for development/production
- Follow SDK-dApp security guidelines
- Implement proper error handling

### Performance

- Cache frequently accessed documentation
- Use batch operations when possible
- Monitor API rate limits
- Optimize query parameters

### Development

- Use development networks for testing
- Follow TypeScript best practices
- Implement comprehensive error handling
- Document custom implementations

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details

## 🔗 Links

- [MultiversX Official Site](https://multiversx.com)
- [Model Context Protocol](https://modelcontextprotocol.io)
- [MultiversX SDK-dApp](https://github.com/multiversx/mx-sdk-dapp)
- [Template dApp](https://github.com/multiversx/mx-template-dapp)
- [MultiversX Documentation](https://docs.multiversx.com)
