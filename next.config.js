const path = require('path');

module.exports = {
  reactCompiler: true,
  experimental: {
    cpus: 1,
    workerThreads: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  turbopack: {
    root: path.resolve(__dirname),
  }
};
