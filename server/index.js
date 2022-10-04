const {ApolloServer}= require ("apollo-server")
const {PubSub} = require ('graphql-subscriptions')
const mongoose= require ('mongoose')

const {MONGODB}= require ('./config.js')
const resolvers=require ('./graphql/resolvers')
const typeDefs = require('./graphql/typeDefs')

const express = require('express')
const path = require('path')
const app = express();

const PORT = process.env.PORT || 5000;

const pubsub = new PubSub();

const server = new ApolloServer({
    typeDefs,
    resolvers,
    cache: "bounded",
    context: ({req})=>({req, pubsub}),
    plugins: [
        ApolloServerPluginLandingPageDisabled(),
      ],
})

app.use(express.urlencoded({extended: false}))
app.use(express.json());

if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../client/build')));
  }

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/build/index.html'));
  });

mongoose.connect( process.env.MONGODB_URI , {useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('MongoDB connected')
        return server.listen({port: PORT})
    }).then(res => {
        console.log(`server running at ${res.url}`)
    }).catch(err => {
        console.error(err)
    })