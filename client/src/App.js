import React from 'react'
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import { Container } from 'semantic-ui-react'
import './App.css';
import Register from './pages/Register'
import Home from './pages/Home'
import Login from './pages/Login'
import MenuBar from './components/MenuBar'
import SinglePost from './pages/SinglePost'

import {AuthProvider} from './context/auth'
import {ApolloClient} from '@apollo/client'
import { InMemoryCache } from '@apollo/client'
import { createHttpLink } from 'apollo-link-http'
import { ApolloProvider } from '@apollo/client'
import { setContext } from 'apollo-link-context'

const httpLink = createHttpLink({
    uri: '/graphql'
})

const authLink = setContext(() => {
  const token = localStorage.getItem('jwtToken');
  return {
    headers: {
      Authorization: token ? `Bearer ${token}` : ""
    }
  }
})

const client = new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache()
});


function App() {
  return (
    <ApolloProvider client={client}>
    <AuthProvider>
      <Router>
        <Container>
          <MenuBar />
          <Routes>
            <Route exact path='/' element={<Home />} />
            <Route exact path='/login' element={<Login/>} />
            <Route exact path='/register' element={<Register/>} />
            <Route exact path='/posts/:postId' element={<SinglePost />} />
          </Routes>
        </Container>
      </Router>
    </AuthProvider>
    </ApolloProvider>
  );
}

export default App;
