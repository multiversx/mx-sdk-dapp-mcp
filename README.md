# MultiversX MCP Server

A comprehensive Model Context Protocol (MCP) server implementation for the MultiversX blockchain ecosystem. This server provides AI agents and applications with access to MultiversX SDK-dApp v5 documentation, development resources, and blockchain data querying capabilities.

## 🚀 Features

### 📚 Resources (Knowledge Base)

- **SDK-dApp v5 Complete Guide** (`mx://sdk-dapp-guide`) - Comprehensive MultiversX SDK-dApp v5 documentation including architecture, installation, configuration, and best practices

### 🔧 Tools (Executable Functions)

- **Query Account** (`mx-query-account`) - Retrieve account information from any MultiversX network
- **SDK-DAPP Guide** (`mx-sdk-dapp-guide`) - Fetch the latest SDK-DAPP v5 guide from GitHub with optional section extraction

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
│   ├── index.ts              # Resource handler setup
│   └── sdk-dapp-guide.ts     # Complete SDK-dApp guide
├── tools/               # MCP tools (executable functions)
│   ├── index.ts             # Tool handler setup
│   ├── query-account.ts     # Account querying tool
│   └── sdk-dapp-guide.ts    # SDK-dApp guide tool
├── prompts/             # MCP prompts (templates) - Currently empty
│   └── index.ts             # Prompt handler setup
├── utils/               # Utilities
│   ├── constants.ts         # Constants and configurations
│   └── logger.ts            # Logging utility
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

### SDK-dApp v5 Complete Guide (`mx://sdk-dapp-guide`)

Comprehensive guide covering MultiversX SDK-dApp v5 architecture, installation, configuration, provider interactions, data access patterns, transaction management, network configuration, account management, UI components, and debugging strategies.

## 🔧 Tools Documentation

### Query Account Tool (`mx-query-account`)

Query MultiversX account information including balance, nonce, transactions, guardian status, assets, and more for any network (mainnet, testnet, devnet).

**Parameters:**

- `address` (required): MultiversX account address (erd1... format)
- `network`: MAINNET, TESTNET, or DEVNET (default: MAINNET)
- `withGuardianInfo`: Include guardian information in the response (default: false)
- `withTxCount`: Include transaction count in the response (default: false)
- `withScrCount`: Include smart contract results count in the response (default: false)
- `withTimestamp`: Include timestamp of last activity in the response (default: false)
- `withAssets`: Include assets (tokens/NFTs) in the response (default: false)
- `timestamp`: Retrieve account state from a specific timestamp

**Response Format:**

- Address and balance information
- Transaction counts and activity
- Guardian status (if requested)
- Smart contract details (if applicable)
- Asset information (if requested)
- Verification status and metadata

**Usage Examples:**

```
Query the MultiversX account erd1qga7ze0l03chfgru0a32wxqf2226nzrxnyhzer9lmudqhjgy7ycqjjyknz
```

```
Get balance for address erd1qga7ze0l03chfgru0a32wxqf2226nzrxnyhzer9lmudqhjgy7ycqjjyknz on testnet
```

```
Show detailed account info with transaction count and guardian status for erd1qga7ze0l03chfgru0a32wxqf2226nzrxnyhzer9lmudqhjgy7ycqjjyknz
```

---

### SDK-DAPP Guide Tool (`mx-sdk-dapp-guide`)

Fetch the MultiversX SDK-DAPP v5 guide from the official GitHub repository, including setup and usage for React, TypeScript, JavaScript, Angular, login/logout, signing, sending, tracking transactions, signing messages, and creating custom providers. Optionally, provide a section name to extract a specific section.

**Parameters:**

- `section` (optional): The section name to extract from the guide (e.g., Installation, Configuration, Transactions, etc.)

**Response Format:**

- Markdown content of the full guide or the requested section

**Usage Examples:**

#### Basic Usage - Fetch Complete Guide

```
Fetch the complete MultiversX SDK-DAPP v5 guide
```

#### Setup SDK-dApp

```
Get the SDK-dApp installation and setup instructions
```

_Use section: "Installation"_

#### Login and Logout with SDK-dApp

```
Show me how to implement login and logout functionality with SDK-dApp
```

_Use section: "Login" or "Logout" or "Authentication"_

#### Sign/Send/Track Transactions

```
Get information about signing, sending, and tracking transactions with SDK-dApp
```

_Use section: "Transactions" or "Signing Transactions"_

#### Get Account Information

```
Show me how to get account information using SDK-dApp
```

_Use section: "Account" or "Getting account data"_

#### Sign Messages

```
Get information about signing messages with SDK-dApp
```

_Use section: "Signing Messages" or "Message Signing"_

#### Configuration and Setup

```
Get the SDK-dApp configuration and initialization guide
```

_Use section: "Configuration" or "Setup"_

#### Provider Management

```
Show me how to work with different wallet providers in SDK-dApp
```

_Use section: "Providers" or "Wallet Providers"_

#### UI Components

```
Get information about SDK-dApp UI components
```

_Use section: "UI Components" or "Components"_

#### Advanced Usage Examples

1. **Fetch specific sections:**

   ```
   Get only the "Installation" section from the SDK-DAPP guide
   ```

2. **Transaction workflow:**

   ```
   Show me the complete transaction workflow from signing to tracking
   ```

3. **Provider integration:**

   ```
   How do I integrate different wallet providers with SDK-dApp?
   ```

4. **Account management:**

   ```
   Get the account management section from the SDK-DAPP guide
   ```

5. **Network configuration:**
   ```
   Show me how to configure networks in SDK-dApp
   ```

---

## 🛠️ Tool Usage Examples

### Query Account Tool

- Query a mainnet account:
  ```
  Query the MultiversX account erd1qga7ze0l03chfgru0a32wxqf2226nzrxnyhzer9lmudqhjgy7ycqjjyknz
  ```
- Query an account on testnet:
  ```
  Get balance for address erd1qga7ze0l03chfgru0a32wxqf2226nzrxnyhzer9lmudqhjgy7ycqjjyknz on testnet
  ```
- Show detailed info with transaction count and guardian status:
  ```
  Show detailed account info with transaction count and guardian status for erd1qga7ze0l03chfgru0a32wxqf2226nzrxnyhzer9lmudqhjgy7ycqjjyknz
  ```

### SDK-DAPP Guide Tool

- Fetch the entire guide:
  ```
  Fetch the complete MultiversX SDK-DAPP v5 guide
  ```
- Fetch a specific section:
  ```
  Get only the "Installation" section from the SDK-DAPP guide
  ```
- Get setup instructions:
  ```
  Show me how to set up SDK-dApp in my project
  ```
- Get authentication guide:
  ```
  How do I implement login and logout with SDK-dApp?
  ```
- Get transaction guide:
  ```
  Show me how to sign and send transactions with SDK-dApp
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

#### 4. SDK-DAPP Guide Fetch Issues

**Problem**: Guide not loading or sections not found
**Solutions**:

- Check internet connectivity
- Verify section names are correct (case-insensitive matching)
- Try fetching the complete guide first
- Check GitHub repository accessibility

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
- Use section-specific queries when possible
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
