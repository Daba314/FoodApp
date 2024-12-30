const authResolver = require('./auth');
const productResolver = require('./products');


const rootResolver = {
  ...authResolver,
  ...productResolver,
};

module.exports = rootResolver;