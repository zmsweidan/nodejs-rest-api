/**
 * security schemes
 */
module.exports = {
  bearer: {
    type: 'http',
    scheme: 'bearer',
    bearerFormat: 'JWT',
  },
  api_key: {
    type: 'apiKey',
    name: 'api_key',
    'in': 'header'
  }
}