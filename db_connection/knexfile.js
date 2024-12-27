const {
  db: { main },
} = require("../config");

module.exports = {
  development: {
    client: main.client,
    connection: {
      host: main.connection.host,
      database: main.connection.database,
      user: main.connection.user,
      password: main.connection.password,
      server: main.connection.server,
      port: main.connection.port,
    },
  },

  staging: {
    client: "pg",
    connection: {
      database: "postgres",
      user: "postgres",
      password: "Daba3019",
    },
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      tableName: "knex_migrations",
    },
  },

  production: {
    client: "pg",
    connection: {
      database: "my_db",
      user: "username",
      password: "password",
    },
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      tableName: "knex_migrations",
    },
  },
};
