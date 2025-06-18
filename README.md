# MultiversX MCP Server

A Model Context Protocol (MCP) server implementation for the MultiversX blockchain ecosystem. This server provides AI agents and applications with access to MultiversX network data, wallet functionality, and blockchain operations.

## Features

### Resources
- **Network Configuration** (`mx://network/config`) - MultiversX network settings and information
- **Account Information** (`mx://account/info`) - Account details and wallet connection status
- **Transaction History** (`mx://transactions/history`) - Historical transaction data
- **Wallet Connection** (`mx://wallet/connection`) - Current wallet connection status

### Tools
- **Connect Wallet** (`mx:connect-wallet`) - Connect to MultiversX wallet providers
- **Get Network Info** (`mx:get-network-info`) - Retrieve network statistics and information
- **Query Account** (`mx:query-account`) - Query account balance and details
- **Send Transaction** (`mx:send-transaction`) - Send transactions on the MultiversX network

### Prompts
- **Transaction Template** (`mx-transaction-template`) - Template for creating transactions
- **Wallet Setup** (`mx-wallet-setup`) - Guide for setting up MultiversX wallets
- **Network Switch** (`mx-network-switch`) - Instructions for switching networks

## Installation

### Prerequisites
- Node.js (v18 or higher)
- pnpm (recommended) or npm

### Quick Setup
```bash
# Clone the repository
git clone <repository-url>
cd mx-dev-mcp

# Install dependencies (using pnpm)
pnpm install

# Or using npm
npm install

# Build the project
pnpm build
# Or: npm run build

# Test the server (optional)
pnpm start
# Or: npm start
```

## Development

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

## Configuration

### Environment Variables
- `LOG_LEVEL` - Set logging level (DEBUG, INFO, WARN, ERROR)
- `MULTIVERSX_NETWORK` - Default network (mainnet, testnet, devnet)

### Network Configuration
The server supports all MultiversX networks:
- **Mainnet** - Production network
- **Testnet** - Testing network
- **Devnet** - Development network

## Project Structure

```
src/
├── index.ts              # Main entry point
├── resources/            # MCP resources
│   ├── index.ts         # Resource handler setup
│   ├── network-config.ts # Network configuration resource
│   └── account-info.ts   # Account information resource
├── tools/               # MCP tools
│   ├── index.ts         # Tool handler setup
│   ├── connect-wallet.ts # Wallet connection tool
│   └── get-network-info.ts # Network info tool
├── prompts/             # MCP prompts
│   └── index.ts         # Prompt handler setup
└── utils/               # Utilities
    ├── logger.ts        # Logging utility
    └── constants.ts     # Constants and configurations
```

## Usage with MCP Clients

### Cursor IDE Integration

#### Step 1: Clone and Setup the Repository
```bash
# Clone this repository
git clone <repository-url>
cd mx-dev-mcp

# Install dependencies
pnpm install

# Build the project
pnpm build
```

#### Step 2: Configure Cursor MCP Settings
1. Open Cursor IDE
2. Go to Cursor Settings
3. Search for "MCP" or navigate to Features → Model Context Protocol
4. Add a new MCP server with the following configuration:

```json
{
  "mcpServers": {
    "mvx-dev-mcp": {
      "name": "MultiversX SDK development MCP Server
      "command": "node",
      "args": ["<absolute-path-to-repo>/mx-dev-mcp/dist/index.js"],
      "env": {
        "LOG_LEVEL": "INFO"
      }
    }
  }
}
```

**Important**: Replace `<absolute-path-to-repo>` with the actual absolute path to where you cloned this repository.

#### Step 3: Alternative Configuration (Using npm link)
For easier management, you can also use npm link:

```bash
# In the mx-dev-mcp directory
npm link

# Then in Cursor MCP settings, use:
{
  "name": "MultiversX MCP Server", 
  "command": "mx-dev-mcp"
}
```

#### Step 4: Restart Cursor
After adding the configuration, restart Cursor for the changes to take effect.

#### Step 5: Verify Integration
1. Open a new chat in Cursor
2. The MultiversX MCP server should automatically connect
3. You can now use MultiversX-related commands and queries

### Claude Desktop
Add to your Claude Desktop configuration file (`~/Library/Application Support/Claude/claude_desktop_config.json` on macOS):

```json
{
  "mcpServers": {
    "mvx-dev-mcp": {
      "name": "MultiversX SDK development MCP Server
      "command": "node",
      "args": ["<absolute-path-to-repo>/mx-dev-mcp/dist/index.js"],
      "env": {
        "LOG_LEVEL": "INFO"
      }
    }
  }
}
```

## Available Tools and Commands

Once integrated with Cursor, you can use the following MultiversX tools:

### Query Account Tool
Query MultiversX account information including balance, nonce, and transaction counts.

**Usage Examples:**
- "Query the MultiversX account erd1qga7ze0l03chfgru0a32wxqf2226nzrxnyhzer9lmudqhjgy7ycqjjyknz"
- "Get balance for address erd1... on testnet"
- "Show account details with transaction count for erd1..."

**Parameters:**
- `address` (required): MultiversX account address (erd1... format)
- `network`: MAINNET, TESTNET, or DEVNET (default: MAINNET)
- `withTxCount`: Include transaction count
- `withGuardianInfo`: Include guardian information
- `withScrCount`: Include smart contract results count
- `withTimestamp`: Include timestamp of last activity
- `withAssets`: Include assets (tokens/NFTs)

**Example Requests:**
- "Check the balance of erd1qga7ze0l03chfgru0a32wxqf2226nzrxnyhzer9lmudqhjgy7ycqjjyknz on mainnet"
- "Get detailed account info with transaction count for erd1... on testnet"
- "Query account erd1... and show guardian status"

## Troubleshooting

### Common Issues

#### 1. MCP Server Not Connecting in Cursor
- **Problem**: Cursor shows "MCP server failed to start" or similar error
- **Solutions**:
  - Ensure the path to `dist/index.js` is correct and absolute
  - Verify the project is built: `pnpm build`
  - Check that Node.js is installed and accessible
  - Restart Cursor after configuration changes

#### 2. "Command not found" Error
- **Problem**: Error when using `mx-dev-mcp` command after npm link
- **Solutions**:
  - Use the full path configuration instead of npm link
  - Ensure npm global bin directory is in your PATH
  - Try using the absolute path configuration

#### 3. Account Query Fails
- **Problem**: "Account not found" or API errors
- **Solutions**:
  - Verify the address format (must start with "erd1")
  - Check network connectivity
  - Try with a known valid address like: `erd1qga7ze0l03chfgru0a32wxqf2226nzrxnyhzer9lmudqhjgy7ycqjjyknz`

#### 4. Build Errors
- **Problem**: TypeScript compilation errors
- **Solutions**:
  - Ensure Node.js version is 18 or higher
  - Delete `node_modules` and reinstall: `rm -rf node_modules && pnpm install`
  - Check for TypeScript errors: `pnpm tsc --noEmit`

### Debugging

To enable debug logging, set the LOG_LEVEL environment variable:

```json
{
  "mcpServers": {
    "mvx-dev-mcp": {
      "name": "MultiversX SDK development MCP Server
      "command": "node",
      "args": ["<absolute-path-to-repo>/mx-dev-mcp/dist/index.js"],
      "env": {
        "LOG_LEVEL": "DEBUG"
      }
    }
  }
}
```

### Getting Help

If you encounter issues:
1. Check the troubleshooting section above
2. Verify your setup matches the installation instructions
3. Test the server independently: `pnpm start`
4. Check Cursor's MCP server logs in the settings

## Best Practices Implemented

1. **Modular Architecture** - Separated concerns into resources, tools, and prompts
2. **Error Handling** - Comprehensive error handling with proper error codes
3. **Logging** - Structured logging with configurable levels
4. **Type Safety** - Full TypeScript support with proper typing
5. **Code Quality** - ESLint configuration for consistent code style
6. **Documentation** - Comprehensive documentation and examples

## Security Considerations

- Server operates with appropriate access controls
- User consent required for wallet connections
- Secure handling of sensitive data
- Input validation for all tools and resources

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## License

MIT License - see LICENSE file for details

## Links

- [MultiversX Official Site](https://multiversx.com)
- [Model Context Protocol](https://modelcontextprotocol.io)
- [MultiversX SDK-Dapp](https://github.com/multiversx/mx-sdk-dapp)
