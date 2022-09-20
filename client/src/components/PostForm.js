
import React from 'react'
import {Form, Button} from 'semantic-ui-react'
import gql from 'graphql-tag'
import {useMutation} from '@apollo/react-hooks'

import { useForm } from '../utils/Hooks'
import { FETCH_POSTS_QUERY } from '../utils/graphql'

const PostForm = () => {
    const {values, onChange, onSubmit} = useForm(createPostCallBack, {
        body: ""
    });
    const [createPost, { error, loading }] = useMutation(CREATE_POST_MUTATION, {
        variables: values,
        refetchQueries: [{query: FETCH_POSTS_QUERY}, 'getPosts'],
    })

    const submitPostButton = loading ? (
        <Button loading color='teal'>
            Loading
        </Button>
    ):(
        <Button type = "submit" color='teal'>
            Submit
        </Button>
    )

    function createPostCallBack(){
        createPost();
    }

    return (
        <>
        <Form onSubmit={onSubmit}>
            <h2>Create a post:</h2>
            <Form.Field>
                <Form.Input 
                    placeholder='hi world'
                    name='body'
                    onChange={onChange}
                    value={values.body}
                    error={error ? true : false}
                />
                {submitPostButton}
            </Form.Field>
        </Form>
        {error && (
            <div className='ui error message' style={{marginBottom: 20}}>
                <ul className='list'>
                    <li>{error.graphQLErrors[0].message}</li>
                </ul>
            </div>
        )}
        </>
    )
}

const CREATE_POST_MUTATION = gql`
    mutation createPost($body: String!){
        createPost(body: $body){
            id body createdAt username
            likes{
                id username createdAt
            }
            likeCount
            comments{
                id body username createdAt
            }
            commentCount
        }
    }
`

export default PostForm;