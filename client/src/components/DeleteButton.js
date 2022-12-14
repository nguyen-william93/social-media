import React, {useState} from 'react'
import gql from 'graphql-tag'
import {useMutation} from '@apollo/react-hooks'
import {Button, Icon, Confirm} from 'semantic-ui-react'
import { FETCH_POSTS_QUERY } from '../utils/graphql'

import MyPopup from '../utils/MyPopup'

const DeleteButton = ({postId, commentId, callback}) => {
    const [confirmOpen, setConfirmOpen] = useState(false)

    const mutation = commentId ? DELETE_COMMENT_MUTATION : DELETE_POST_MUTATION

    const [deletePostOrMutation] = useMutation(mutation,{
        update(proxy){
            setConfirmOpen(false);
            if(callback) callback()
        },
        variables: {postId, commentId},
        refetchQueries: [{query: FETCH_POSTS_QUERY}, 'getPosts'],
    })

    return(
        <>
        <MyPopup content={commentId ? 'Delete Comment' : 'Delete Post'}>
            <Button as='div' color="red" floated='right' onClick={()=>setConfirmOpen(true)}>
                <Icon name='trash' style={{margin:0}} />
            </Button>
        </MyPopup>
        <Confirm open={confirmOpen} onCancel={() => setConfirmOpen(false)} onConfirm={deletePostOrMutation} />
        </>
    )
}

const DELETE_POST_MUTATION = gql `
    mutation deletePost($postId: ID!){
        deletePost(postId: $postId)
    }
`

const DELETE_COMMENT_MUTATION = gql `
    mutation deleteComment($postId: ID!, $commentId: ID!){
        deleteComment(postId: $postId, commentId: $commentId){
            id
            comments{
                id username createdAt body
            }
            commentCount
        }
    }
`

export default DeleteButton;