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

const uri = `mongodb+srv://admin:admin@social-media.587fn6w.mongodb.net/social-media?retryWrites=true&w=majority`

mongoose.connect( uri , {useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('MongoDB connected')
        return server.listen({port: PORT})
    }).then(res => {
        console.log(`server running at ${res.url}`)
    }).catch(err => {
        console.error(err)
    })