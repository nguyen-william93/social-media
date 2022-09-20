import React, {useState, useContext} from "react"
import {useMutation} from '@apollo/react-hooks'
import {useNavigate} from 'react-router-dom'
import {Form, Button} from 'semantic-ui-react'
import gql from 'graphql-tag'

import {useForm} from '../utils/Hooks'
import {AuthContext} from '../context/auth'

function Login(props) {
    const [errors, setErrors] = useState({})
    const {onChange, onSubmit, values} = useForm(loginUserCallback, {username:'', password:''})
    const nav = useNavigate()
    const context = useContext(AuthContext)

    const [loginUser, {loading}] = useMutation(LOGIN_USER, {
        update(_,{data: {login: userData}}){
            context.login(userData)
            nav('/')
        },
        onError(err){
            setErrors(err.graphQLErrors[0].extensions.errors);
        },
        variables: values
    })
    const loginButton = loading ? (
        <Button loading primary>
            Loading
        </Button>
    ):(
        <Button type ='submit' primary>
            Login
        </Button>
    )
    function loginUserCallback (){
        loginUser();
    }
    
    return (
        <div className='form-container'>
            <Form onSubmit={onSubmit} noValidate>
                <h1>Login</h1>
                <Form.Input
                    lable='Username'
                    placeholder='username'
                    name='username'
                    type='username'
                    value ={values.username}
                    error={errors.username ? true : false}
                    onChange = {onChange}
                />
                <Form.Input 
                    label='Password'
                    placeholder='password'
                    name='password'
                    type='password'
                    value={values.password}
                    error={errors.password ? true : false}
                    onChange={onChange}
                />
                {loginButton}
            </Form>
            {Object.keys(errors).length > 0 && (
                <div className="ui error message">
                    <ul className="list">
                        {Object.values(errors).map((value) => (
                            <li key={value}>{value}</li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    )
}

const LOGIN_USER = gql`
    mutation login(
        $username: String!
        $password: String!
    ) {
        login(
            username: $username
            password: $password
        ){
            id
            email
            username
            createdAt
            token
        }
    }
`;

export default Login;