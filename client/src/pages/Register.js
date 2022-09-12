import React, {useState} from "react"
import {Form, Button} from 'semantic-ui-react'
import {useMutation} from '@apollo/react-hooks'
import gql from  'graphql-tag'

function Register() {
    const [values, setValues] = useState({username:"", password:"", email: "", confirmedPassword: ""})

    const onChange = (event) => {
        setValues({...values, [event.target.name]: event.target.value})
    }

    const [addUser, {data, loading, error}] = useMutation(REGISTER_USER, {
        update(proxy, result){
            console.log(result);
        }, variables: values
    })

    const onSubmit = (event) => {
        event.preventDefault();
        console.log(values)
        addUser()
    }
    if(error) return `submission is over! ${error.message}`
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
                    onChange={onChange}
                />
                <Form.Input
                    label="password"
                    placeholer="Password.."
                    name='password'
                    type='password'
                    value={values.password}
                    onChange={onChange}
                />
                <Form.Input
                    label="email"
                    placeholer="Email.."
                    name='email'
                    type='email'
                    value={values.email}
                    onChange={onChange}
                />
                <Form.Input
                    label="Confirm Password"
                    placeholer="Confrim Password.."
                    name='confirmedPassword'
                    type='password'
                    value={values.confirmPassword}
                    onChange={onChange}
                />
                <Button type='submit' primary>
                    Register
                </Button>
            </Form>
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