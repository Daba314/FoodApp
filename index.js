const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const {graphqlHTTP} = require("express-graphql")
const {buildSchema,} = require('graphql')
const {
  app: { PORT },
} = require("./config");
const { schema } = require("./db_connection/db");

const app = express();
app.use(bodyParser.json({ limit: "50mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));

// const corsOptions = {
//   origin: JSON.parse(ALLOWED_ORIGINS),
//   credentials: true,
//   withCredentials: true,
//   authenticate: true,
//   authorization: true,
//   optionsSuccessStatus: 200,
// };

app.use(cors());

app.listen(PORT, () => {
  console.log("Running on :", PORT);
});

//app.use("/authorization", require("./routes/authRouter"));
//app.use("/product", require("./routes/productRouter"));
app.use("/graphql", graphqlHTTP({
    schema: buildSchema(`
        type RootQuery{
            products: [String!]!
        }
        type RootMutation{
            createProduct(product_name :String) : String
        }
        schema {
            query: RootQuery
            mutation: RootMutation
        }`),
    rootValue: {
        products: () =>{
            return ['daba', 'dashiev']
        },
        createProduct: (args) =>{
            const product_name = args.product_name
            return product_name
        }
    },
    graphiql:true
}))
module.exports = app;
