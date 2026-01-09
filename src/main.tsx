import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

// Discord SDK initialization
const CLIENT_ID = (import.meta as any).env?.VITE_DISCORD_CLIENT_ID;
const PUBLIC_KEY = (import.meta as any).env?.VITE_DISCORD_PUBLIC_KEY;

// Validate environment variables
if (!CLIENT_ID) {
  console.warn('Missing VITE_DISCORD_CLIENT_ID environment variable - using mock mode');
} else {
  console.log('Discord Client ID configured:', CLIENT_ID.substring(0, 8) + '...');
  if (PUBLIC_KEY) {
    console.log('Discord Public Key configured');
  }
}

// Initialize Discord SDK
let discordSdk: any;

try {
  // Only initialize if we have a client ID
  if (CLIENT_ID) {
    const { DiscordSDK } = await import('@discord/embedded-app-sdk');
    discordSdk = new DiscordSDK(CLIENT_ID);
  } else {
    // Fallback mock for development
    discordSdk = {
      ready: () => Promise.resolve(),
      commands: {
        authorize: () => Promise.resolve({ code: 'mock_code' }),
        authenticate: () => Promise.resolve(),
        getUser: () => Promise.resolve({
          id: '123456789',
          username: 'TestUser',
          discriminator: '1234',
          avatar: null
        }),
        getChannel: () => Promise.resolve({
          id: '987654321',
          type: 2, // voice channel
          name: 'Game Voice'
        })
      }
    };
    console.warn('Using mock Discord SDK - set VITE_DISCORD_CLIENT_ID for real integration');
  }
} catch (error) {
  console.error('Failed to initialize Discord SDK:', error);
  // Fallback to mock
  discordSdk = {
    ready: () => Promise.resolve(),
    commands: {
      authorize: () => Promise.resolve({ code: 'mock_code' }),
      authenticate: () => Promise.resolve(),
      getUser: () => Promise.resolve({
        id: '123456789',
        username: 'TestUser',
        discriminator: '1234',
        avatar: null
      }),
      getChannel: () => Promise.resolve({
        id: '987654321',
        type: 2,
        name: 'Game Voice'
      })
    }
  };
}

// Initialize Discord SDK
async function initializeDiscordSDK() {
  try {
    // Wait for Discord to be ready
    await discordSdk.ready();

    let user, channel;

    if (CLIENT_ID) {
      // Real Discord integration
      console.log('Initializing real Discord SDK...');

      // Authenticate with Discord
      const authResult = await discordSdk.commands.authorize({
        client_id: CLIENT_ID,
        response_type: 'code',
        state: '',
        prompt: 'none',
        scope: ['identify', 'guilds'],
      });

      // Exchange code for access token (you'd typically do this on your server)
      // For development, we'll mock this part
      const access_token = authResult.code ? `token_from_${authResult.code}` : `mock_token_${Date.now()}`;
      console.log('Discord authorization successful');

      // Authenticate with the SDK
      await discordSdk.commands.authenticate({
        access_token,
      });

      // Get user and channel info
      user = await discordSdk.commands.getUser();
      channel = await discordSdk.commands.getChannel();

      console.log('Discord SDK initialized:', { user: user.username, channel: channel.name });
    } else {
      // Mock initialization for development
      user = await discordSdk.commands.getUser();
      channel = await discordSdk.commands.getChannel();

      console.log('Discord SDK initialized (mock):', { user: user.username, channel: channel.name });
    }

    return { discordSdk, user, channel };
  } catch (error) {
    console.error('Failed to initialize Discord SDK:', error);

    // Return mock data as fallback
    const user = {
      id: '123456789',
      username: 'TestUser',
      discriminator: '1234',
      avatar: null
    };
    const channel = {
      id: '987654321',
      type: 2,
      name: 'Game Voice'
    };

    console.log('Using fallback mock data due to initialization error');

    return { discordSdk, user, channel };
  }
}

// Render the app
async function renderApp() {
  try {
    const discordContext = await initializeDiscordSDK();

    ReactDOM.createRoot(document.getElementById('root')!).render(
      <React.StrictMode>
        <App discordContext={discordContext} />
      </React.StrictMode>
    );
  } catch (error) {
    console.error('Failed to render app:', error);

    // Render error fallback
    ReactDOM.createRoot(document.getElementById('root')!).render(
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        backgroundColor: '#1a1a1a',
        color: '#ffffff',
        fontFamily: 'Arial, sans-serif'
      }}>
        <div style={{ textAlign: 'center' }}>
          <h2>Connection Error</h2>
          <p>Failed to connect to Discord. Please refresh and try again.</p>
          <button
            onClick={() => window.location.reload()}
            style={{
              padding: '10px 20px',
              backgroundColor: '#5865f2',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              marginTop: '10px'
            }}
          >
            Refresh
          </button>
        </div>
      </div>
    );
  }
}

// Start the app
renderApp();
