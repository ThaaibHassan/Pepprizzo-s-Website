const redis = require('redis');

let client = null;

// Skip Redis in development mode if not explicitly enabled
if (process.env.NODE_ENV === 'development' && !process.env.ENABLE_REDIS) {
  console.log('ℹ️  Redis disabled in development mode');
} else {
  try {
    client = redis.createClient({
      url: process.env.REDIS_URL || 'redis://localhost:6379',
      retry_strategy: function(options) {
        if (options.error && options.error.code === 'ECONNREFUSED') {
          // End reconnecting on a specific error and flush all commands with a individual error
          return new Error('The server refused the connection');
        }
        if (options.total_retry_time > 1000 * 60 * 60) {
          // End reconnecting after a specific timeout and flush all commands with a individual error
          return new Error('Retry time exhausted');
        }
        if (options.attempt > 10) {
          // End reconnecting with built in error
          return undefined;
        }
        // Reconnect after
        return Math.min(options.attempt * 100, 3000);
      }
    });

    client.on('connect', () => {
      console.log('✅ Connected to Redis');
    });

    client.on('error', (err) => {
      if (process.env.NODE_ENV === 'development') {
        // Only log once in development mode
        if (!client._errorLogged) {
          console.warn('⚠️  Redis not available (development mode - continuing without Redis)');
          client._errorLogged = true;
        }
      } else {
        console.error('❌ Redis Client Error:', err);
      }
    });

    client.on('ready', () => {
      console.log('✅ Redis client ready');
    });

    client.on('end', () => {
      console.log('❌ Redis client disconnected');
    });

    // Connect to Redis
    client.connect().catch(() => {
      // Silently handle connection errors in development
      if (process.env.NODE_ENV !== 'development') {
        console.error('Failed to connect to Redis');
      }
    });
  } catch (error) {
    console.warn('⚠️  Redis not available (development mode - continuing without Redis)');
  }
}

module.exports = client;
