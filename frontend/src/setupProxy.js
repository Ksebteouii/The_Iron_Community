const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/profile',
    createProxyMiddleware({
      target: 'http://127.0.0.1:5000', // changed from localhost to 127.0.0.1
      changeOrigin: true,
      timeout: 60000, // increase timeout to 60 seconds
      proxyTimeout: 60000, // increase proxy timeout to 60 seconds
    })
  );
};
