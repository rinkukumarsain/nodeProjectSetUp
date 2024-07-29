const { adminV1Prefix } = require('../../config/default.json');

module.exports = (app) => {
  app.use(`${adminV1Prefix}/swagger`, require('./swaggerRoutes'));
  app.use(`${adminV1Prefix}/user`, require('./userRoutes'));
};
