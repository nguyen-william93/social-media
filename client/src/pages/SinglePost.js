import React, {useContext, useState, useRef} from 'react'
import gql from 'graphql-tag'
import {useQuery, useMutation} from '@apollo/react-hooks'
import { Card, Grid, Image, Button, Message, Form} from 'semantic-ui-react';
import moment from 'moment'
import {useParams, useNavigate} from 'react-router-dom'

import { AuthContext } from '../context/auth';
import LikeButton from '../components/LikeButton';
import DeleteButton from '../components/DeleteButton';
import MyPopup from '../utils/MyPopup';

const  SinglePost = (props) => {
    const {postId} = useParams()
    const nav = useNavigate()
    const [comment, setComment] = useState('')

    const {user} =useContext(AuthContext)

    const commentInputRef = useRef(null)
    const {loading, data} = useQuery(FETCH_POST_QUERY, {
        variables: { postId },
    })

    const [submitComment] = useMutation(SUBMIT_COMMENT_MUTATION, {
        update(){
            setComment('');
            commentInputRef.current.blur()
        },
        variables: {postId, body:comment}
    })

    const deletePostCallBack = () =>{
        nav('/')
    }

    let postMarkup;
    if(loading){
        postMarkup = <p>Loading post...</p>
    } else {
        const { id, body, createdAt, username, likes, commentCount, likeCount, comments} = data.getPost
        postMarkup = (
            <Grid>
                <Grid.Row>
                    <Grid.Column>
                        <Image src='https://react.semantic-ui.com/images/avatar/large/molly.png'
                            size = 'small'
                            float = 'right' />
                    </Grid.Column>
                    <Grid.Column width={10}>
                        <Card fluid>
                            <Card.Content>
                                <Card.Header>{username}</Card.Header>
                                <Card.Meta>{moment(createdAt).fromNow()}</Card.Meta>
                                <Card.Description>{body}</Card.Description>
                            </Card.Content>
                            <hr/>
                            <Card.Content extra>
                                <LikeButton user={user} post={{id, likeCount, likes}}/>
                               <MyPopup inverted content="Comment on a post">
                                <Button as='div' labelpostition='right' onClick={()=> console.log('Comment on post')} icon="comments" color='blue' content={commentCount}/>
                               </MyPopup>
                                {user && user.username === username && (
                                    <DeleteButton postId={id} callback={deletePostCallBack}/>
                                )}
                            </Card.Content>
                        </Card>
                        {user && (
                            <Card fluid>
                                <Card.Content>
                                    <p>Post a Comment</p>
                                    <Form>
                                        <div className='ui action input fluid'>
                                            <input type='text' placeholder='Comment...' name='comment' value={comment} onChange={event => setComment(event.target.value)} ref={commentInputRef}/>
                                            <button type='submit' className='ui button blue' disabled={comment.trim()===''} onClick={submitComment}>Submit</button>
                                        </div>
                                    </Form>
                                </Card.Content>
                            </Card>
                        )}
                        {comments.length > 0 ? 
                        (comments.map(comment => (
                            <Card fluid key={comment.id}>
                                <Card.Content>
                                    {user && user.username === comment.username && (
                                        <DeleteButton postId={id} commentId={comment.id} />
                                    )}
                                    <Card.Header>{comment.username}</Card.Header>
                                    <Card.Meta>{moment(comment.createdAt).fromNow()}</Card.Meta>
                                    <Card.Description>{comment.body}</Card.Description>
                                </Card.Content>
                            </Card>
                        ))):(
                            <Message info>
                            <Message.Header>No Comment on this post</Message.Header>
                          </Message>
                        )}            
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        )
    }
    return postMarkup;
}

const FETCH_POST_QUERY = gql `
    query($postId: ID!){
        getPost(postId: $postId){
            id body createdAt username likeCount
            likes{
                username
            }
            commentCount
            comments{
                id username createdAt body
            }
        }
    }
`

const SUBMIT_COMMENT_MUTATION = gql `
    mutation($postId: ID!, $body: String!){
        createComment(postId: $postId, body: $body){
            id
            comments{
                id body createdAt username
            }
            commentCount

        }
    }
`

export default SinglePost