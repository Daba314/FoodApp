const { buildSchema } = require('graphql');

module.exports = buildSchema(`
    type Product {
        product_id: ID!
        product_name: String!
        calories: Float!
        created_date: String!
    }
    type User{
        id: ID!
        full_name: String!
        email: String
        password: String!
    }
    input ProductInput{
        product_name: String!
        calories: Float!
    }
    input UserInput{
        full_name: String!
        email: String
        password: String!
    }

    type RootQuery{
        products: [Product!]!
    }
    type RootMutation{
        createProduct(productInput: ProductInput ) : Product
        signup(userInput: UserInput) : User
        login(userInput: UserInput) : String
        
    }

    schema {
        query: RootQuery
        mutation: RootMutation
    }`)