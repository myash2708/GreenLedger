const path = require('path');

module.exports = {
  // Your existing configuration...
  resolve: {
    fallback: {
      "crypto": require.resolve("crypto-browserify"),
      "buffer": require.resolve("buffer/"),
      "stream": require.resolve("stream-browserify")
    }
  },
  // Other configurations such as entry, output, etc.
};
