const {ApolloServer}= require ("apollo-server")
const {PubSub} = require ('graphql-subscriptions')
const mongoose= require ('mongoose')

const {MONGODB}= require ('./config.js')
const resolvers=require ('./graphql/resolvers')
const typeDefs = require('./graphql/typeDefs')

const PORT = process.env.port || 5000;

const pubsub = new PubSub();

const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({req})=>({req, pubsub})
})

console.log(MONGODB)

mongoose.connect(MONGODB , {useNewUrlParser: true})
    .then(() => {
        console.log('MongoDB connected')

        return server.listen({port: PORT})
    }).then(res => {
        console.log(`server running at ${res.url}`)
    }).catch(err => {
        console.error(err)
    })