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
    context: ({req})=>({req, pubsub})
})

app.use(express.urlencoded({extended: false}))
app.use(express.json());

// Serve up static assets
if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../client/build')));
  }

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/build/index.html'));
  });


const db = mongoose.connect( MONGODB , {    
    useNewUrlParser: true, 
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
})

db.once('open', () => {
    app.listen(PORT, () => {
      console.log(`API server running on port ${PORT}!`);
      console.log(`Use GraphQL at http://localhost:${PORT}${server.graphqlPath}`);
    });
  });