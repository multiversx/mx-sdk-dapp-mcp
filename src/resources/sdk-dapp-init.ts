/**
 * MultiversX SDK-dApp Initialization Guide
 *
 * This resource provides examples and guidance for initializing the MultiversX SDK-dApp
 * library in your application. The initialization should be done before your app renders.
 */

export const SDKDappInitResource = `
# MultiversX SDK-dApp Initialization

The sdk-dapp library must be initialized before your application starts. This is typically done in your main entry file (index.tsx, main.tsx, etc.).

## Basic Setup

### 1. Installation

First, install the required packages:

\`\`\`bash
npm install @multiversx/sdk-dapp
# or
yarn add @multiversx/sdk-dapp
\`\`\`

### 2. Basic Initialization

\`\`\`typescript
// index.tsx or main.tsx
import { initApp } from '@multiversx/sdk-dapp/out/methods/initApp/initApp';
import type { InitAppType } from '@multiversx/sdk-dapp/out/methods/initApp/initApp.types';
import { EnvironmentsEnum } from '@multiversx/sdk-dapp/out/types/enums.types';
import { App } from './App';

const config: InitAppType = {
  storage: { 
    getStorageCallback: () => sessionStorage 
  },
  dAppConfig: {
    environment: EnvironmentsEnum.devnet,
    successfulToastLifetime: 5000
  }
};

initApp(config).then(() => {
  // Render your app after initialization
  const root = document.getElementById('root');
  ReactDOM.render(<App />, root);
});
\`\`\`

## Configuration Options

### Environment Configuration

Choose from different MultiversX networks:

\`\`\`typescript
import { EnvironmentsEnum } from '@multiversx/sdk-dapp/out/types/enums.types';

// For development
environment: EnvironmentsEnum.devnet

// For testing
environment: EnvironmentsEnum.testnet

// For production
environment: EnvironmentsEnum.mainnet
\`\`\`

### Storage Configuration

Choose your preferred storage mechanism:

\`\`\`typescript
// Using sessionStorage (default, data cleared when tab closes)
storage: { 
  getStorageCallback: () => sessionStorage 
}

// Using localStorage (data persists across sessions)
storage: { 
  getStorageCallback: () => localStorage 
}
\`\`\`

### Advanced dApp Configuration

\`\`\`typescript
const config: InitAppType = {
  storage: { 
    getStorageCallback: () => sessionStorage 
  },
  dAppConfig: {
    environment: EnvironmentsEnum.mainnet,
    
    // Enable native authentication (optional)
    nativeAuth: true,
    
    // Override network configuration (optional)
    network: {
      walletAddress: 'https://wallet.multiversx.com',
      explorerAddress: 'https://explorer.multiversx.com',
      // ... other network overrides
    },
    
    // Toast notification lifetime in milliseconds
    successfulToastLifetime: 5000,
    
    // Custom API timeout (optional)
    apiTimeout: 10000
  }
};
\`\`\`

## With Custom Providers

If you have custom signing providers:

\`\`\`typescript
import { MyCustomProvider } from './providers/MyCustomProvider';

const config: InitAppType = {
  storage: { 
    getStorageCallback: () => sessionStorage 
  },
  dAppConfig: {
    environment: EnvironmentsEnum.mainnet
  },
  customProviders: [MyCustomProvider]
};
\`\`\`

## Framework-Specific Examples

### React Application

\`\`\`typescript
// index.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { initApp } from '@multiversx/sdk-dapp/out/methods/initApp/initApp';
import type { InitAppType } from '@multiversx/sdk-dapp/out/methods/initApp/initApp.types';
import { EnvironmentsEnum } from '@multiversx/sdk-dapp/out/types/enums.types';
import { App } from './App';

const config: InitAppType = {
  storage: { getStorageCallback: () => sessionStorage },
  dAppConfig: {
    environment: EnvironmentsEnum.devnet,
    successfulToastLifetime: 5000
  }
};

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

initApp(config).then(() => {
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
});
\`\`\`

### Next.js Application

\`\`\`typescript
// pages/_app.tsx or app/layout.tsx
import { useEffect, useState } from 'react';
import { initApp } from '@multiversx/sdk-dapp/out/methods/initApp/initApp';
import type { InitAppType } from '@multiversx/sdk-dapp/out/methods/initApp/initApp.types';
import { EnvironmentsEnum } from '@multiversx/sdk-dapp/out/types/enums.types';

export default function MyApp({ Component, pageProps }) {
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const config: InitAppType = {
      storage: { getStorageCallback: () => sessionStorage },
      dAppConfig: {
        environment: EnvironmentsEnum.mainnet,
        successfulToastLifetime: 5000
      }
    };

    initApp(config).then(() => {
      setIsInitialized(true);
    });
  }, []);

  if (!isInitialized) {
    return <div>Loading...</div>;
  }

  return <Component {...pageProps} />;
}
\`\`\`

### Solid.js Application

\`\`\`typescript
// index.tsx
import { render } from 'solid-js/web';
import { initApp } from '@multiversx/sdk-dapp/out/methods/initApp/initApp';
import type { InitAppType } from '@multiversx/sdk-dapp/out/methods/initApp/initApp.types';
import { EnvironmentsEnum } from '@multiversx/sdk-dapp/out/types/enums.types';
import { App } from './App';

const root = document.getElementById('root');

const config: InitAppType = {
  storage: { getStorageCallback: () => sessionStorage },
  dAppConfig: {
    environment: EnvironmentsEnum.devnet,
    successfulToastLifetime: 5000
  }
};

initApp(config).then(() => {
  render(() => <App />, root!);
});
\`\`\`

## Error Handling

Always handle initialization errors properly:

\`\`\`typescript
initApp(config)
  .then(() => {
    console.log('SDK-dApp initialized successfully');
    // Render your app
  })
  .catch((error) => {
    console.error('Failed to initialize SDK-dApp:', error);
    // Handle initialization error
  });
\`\`\`

## Production Considerations

### 1. Environment Variables

Use environment variables for different deployments:

\`\`\`typescript
const getEnvironment = () => {
  switch (process.env.NODE_ENV) {
    case 'development':
      return EnvironmentsEnum.devnet;
    case 'staging':
      return EnvironmentsEnum.testnet;
    case 'production':
      return EnvironmentsEnum.mainnet;
    default:
      return EnvironmentsEnum.devnet;
  }
};

const config: InitAppType = {
  storage: { getStorageCallback: () => sessionStorage },
  dAppConfig: {
    environment: getEnvironment(),
    successfulToastLifetime: 5000
  }
};
\`\`\`

### 2. HTTPS Requirement

Ensure your application runs on HTTPS in production, as some providers require secure connections.

### 3. Core-only Installation

If you only need core functionality without UI components:

\`\`\`bash
# Create .npmrc file
echo "@multiversx/sdk-dapp:omit-optional=true" > .npmrc

# Install without UI components
npm install @multiversx/sdk-dapp
\`\`\`

## Common Issues and Solutions

### 1. Provider Not Working
- Ensure the app runs on HTTPS
- Check if the provider is properly included in customProviders

### 2. Storage Issues
- sessionStorage: Data is lost when tab closes
- localStorage: Data persists but may cause issues with SSR

### 3. Network Configuration
- Always verify the correct network endpoints
- Use appropriate environment for your deployment

## Next Steps

After initialization, you can:
1. Set up authentication with providers
2. Configure transaction management
3. Access account data and network information
4. Implement UI components for user interaction

For more detailed examples, check the MultiversX Template dApp: https://github.com/multiversx/mx-template-dapp
`;
