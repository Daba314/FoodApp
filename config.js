// server path config
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, ".env") });

module.exports = Object.freeze({
  app: {
    PORT: process.env.PORT,
    COOKIE_SECRET: process.env.COOKIE_SECRET,
    ALLOWED_ORIGINS: process.env.ALLOWED_ORIGINS
  },
  db: {
    main: {
      client: process.env.DB_CLIENT,
      connection: {
        host: process.env.DB_IPADDR,
        server: process.env.DB_SERVER,
        database: process.env.DB_INSTANCE,
        user: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        port: process.env.DB_PORT,
      },
    },
  },
  MBLAPP_USERS: "mblapp.user",
  MBLAPP_PRODUCTS: "mblapp.product",
  MBLAPP_USER_PRODUCT_XREF: "mblapp.user_product_xref",
});
