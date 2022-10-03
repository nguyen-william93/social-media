import React, {useState, useContext} from "react"
import {useNavigate} from 'react-router-dom'
import {Form, Button} from 'semantic-ui-react'
import {useMutation} from '@apollo/react-hooks'
import gql from  'graphql-tag'

import {useForm} from '../utils/Hooks'
import {AuthContext} from '../context/auth'

function Register(props) {
    const [errors, setErrors] = useState({});
    const { onChange, onSubmit, values} = useForm(registerUser, {username:"", password:"", email: "", confirmedPassword: ""})
    const nav = useNavigate()
    const context = useContext(AuthContext)

     const [addUser] = useMutation(REGISTER_USER, {
        update(_, {data: {register: userData}}){
            context.login(userData)
            nav('/')
        },
        onError(err){
            setErrors(err.graphQLErrors[0].extensions.errors);
        },
        variables: values
    })

    //user function because javascript will hoist any function with the word function in front
    function registerUser() {
        addUser();
    }

    return (
        <div className="form-container">
            <Form onSubmit={onSubmit} noValidate>
                <h1>Register</h1>
                <Form.Input
                    label="username"
                    placeholer="Username.."
                    name='username'
                    type='text'
                    value={values.username}
                    error={errors.username ? true : false}
                    onChange={onChange}
                />
                <Form.Input
                    label="password"
                    placeholer="Password.."
                    name='password'
                    type='password'
                    value={values.password}
                    error={errors.password ? true : false}
                    onChange={onChange}
                />
                <Form.Input
                    label="email"
                    placeholer="Email.."
                    name='email'
                    type='email'
                    value={values.email}
                    error={errors.email ? true : false}
                    onChange={onChange}
                />
                <Form.Input
                    label="Confirm Password"
                    placeholer="Confrim Password.."
                    name='confirmedPassword'
                    type='password'
                    value={values.confirmPassword}
                    error={errors.confirmedPassword ? true : false}
                    onChange={onChange}
                />
                <Button type='submit' primary>
                    Register
                </Button>
            </Form>
            {Object.keys(errors).length > 0 && (
                <div className="ui error message">
                    <ul className="list">
                        {Object.values(errors).map((value)=> (
                            <li key={value}>{value}</li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    )
}

const REGISTER_USER = gql`
    mutation register(
        $username: String!
        $password: String!
        $confirmedPassword: String!
        $email: String!
    ) {
        register(
            registerInput: {
                username: $username
                password: $password
                confirmedPassword: $confirmedPassword
                email: $email
            }
        ) 
        {
            id email username createdAt token
        }
    }
`

export default Register;