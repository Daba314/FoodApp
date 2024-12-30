const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { graphqlHTTP } = require("express-graphql");
const {
  app: { PORT , ALLOWED_ORIGINS},
} = require("./config");

const graphQlSchema = require('./schema/index');
const graphQlResolvers = require('./resolver/index')

const app = express();
app.use(bodyParser.json({ limit: "50mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));

const corsOptions = {
  origin: JSON.parse(ALLOWED_ORIGINS),
  credentials: true,
  withCredentials: true,
  authenticate: true,
  authorization: true,
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));

app.listen(PORT, () => {
  console.log("Running on :", PORT);
});

//app.use("/authorization", require("./routes/authRouter"));
//app.use("/product", require("./routes/productRouter"));
app.use(
  "/graphql",
  graphqlHTTP({
    schema: graphQlSchema,
    rootValue: graphQlResolvers,
    graphiql: true,
  })
);
module.exports = app;
