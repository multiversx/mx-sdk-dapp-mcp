# MultiversX MCP Server

A comprehensive Model Context Protocol (MCP) server implementation for the MultiversX blockchain ecosystem. This server provides AI agents and applications with access to MultiversX SDK-dApp v5 documentation, development resources, and blockchain data querying capabilities.

## 🚀 Features

### 📚 Resources (Knowledge Base)

- **SDK-dApp v5 Complete Guide** (`mx://sdk-dapp-guide`) - Comprehensive MultiversX SDK-dApp v5 documentation including architecture, installation, configuration, and best practices

### 🔧 Tools (Executable Functions)

- **Query Account** (`mx-query-account`) - Retrieve account information from any MultiversX network
- **SDK-DAPP Guide** (`mx-sdk-dapp-guide`) - Retrieves comprehensive documentation for the MultiversX SDK-DAPP v5 library from DeepWiki, with intelligent section matching and advanced topic support

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

Retrieves comprehensive documentation for the MultiversX SDK-DAPP v5 library from DeepWiki. This tool provides access to the complete developer guide including installation, configuration, core concepts, API reference, and advanced topics. The documentation is specifically tailored for React developers building decentralized applications on the MultiversX blockchain.

**Key capabilities:**

- Fetch complete sections of the SDK-DAPP v5 documentation
- Access installation and setup guides
- Retrieve API reference documentation for hooks, functions, and types
- Get configuration and integration examples
- Access advanced topics like native authentication and WebView integration
- Supports intelligent section matching with fuzzy search

The tool automatically maps user-friendly section names to the corresponding documentation pages and provides fallback mechanisms for robust operation.

**Parameters:**

- `section` (optional): Specify which section of the SDK-DAPP documentation to retrieve.

  Available sections include:

  - Getting Started: `"overview"`, `"getting-started"`
  - Installation: `"installation"`, `"setup"`, `"configuration"`
  - Core Concepts: `"authentication"`, `"transactions"`, `"state-management"`
  - API Reference: `"react-hooks"`, `"core-functions"`, `"provider-types"`, `"transaction-types"`, `"network-configuration"`, `"constants-and-utilities"`
  - Advanced Topics: `"native-authentication"`, `"webview-integration"`, `"custom-providers"`

  You can use either human-friendly names (e.g., `"React Hooks"`) or exact section identifiers (e.g., `"4.2-react-hooks"`). The tool includes fuzzy matching to find the most relevant section even with partial matches.

  **Examples:**

  - `"installation"` → Installation and setup guide
  - `"hooks"` → React hooks documentation
  - `"authentication"` → Authentication and provider setup
  - `"transactions"` → Transaction management guide
  - `"configuration"` → Basic configuration guide
  - `"native-authentication"` → Native authentication guide
  - `"webview-integration"` → WebView integration guide

  If no section is specified, the tool returns the overview documentation.

**Response Format:**

- Markdown content of the full guide or the requested section

**Usage Examples:**

#### Basic Usage - Fetch Complete Guide

```
Fetch the complete MultiversX SDK-DAPP v5 guide
```

#### Fetch a Specific Section

```
Get only the "Installation" section from the SDK-DAPP guide
```

#### Fuzzy Section Matching

```
Show me the React Hooks documentation from the SDK-DAPP guide
```

#### Advanced Topics

```
How do I use native authentication with SDK-dApp?
```

```
Show me the WebView integration section from the SDK-DAPP guide
```

#### Configuration and Setup

```
Get the SDK-dApp configuration and initialization guide
```

#### API Reference

```
Show me the available core functions in SDK-dApp
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
