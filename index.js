const {ApolloServer} = require("apollo-server")
const gpl = require ('graphql-tag')
const mongoose = require('mongoose')
const  {MONGODB} = require ('./config.js')

const typeDefs = gpl `
    type Query {
        sayHi: String
    }
`

const resolvers = {
    Query: {
        sayHi: () => "hello world!!!"
    }
}

const server = new ApolloServer({
    typeDefs,
    resolvers
})

mongoose.connect(MONGODB , {useNewUrlParser: true})
    .then(() => {
        console.log('MongoDB connected')
        return server.listen({port:5000})
    }).then(res => {
        console.log(`server running at ${res.url}`)
    })