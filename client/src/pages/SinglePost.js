import React, {useContext} from 'react'
import gql from 'graphql-tag'
import {useQuery} from '@apollo/react-hooks'
import { Card, Grid, Image, Button } from 'semantic-ui-react';
import moment from 'moment'
import {useParams, useNavigate} from 'react-router-dom'

import { AuthContext } from '../context/auth';
import LikeButton from '../components/LikeButton';
import DeleteButton from '../components/DeleteButton';

const  SinglePost = (props) => {
    const {postId} = useParams()
    const nav = useNavigate()

    const {user} =useContext(AuthContext)

    const {loading, data} = useQuery(FETCH_POST_QUERY, {
        variables: { postId },
    })

    const deletePostCallBack = () =>{
        nav('/')
    }


    let postMarkup;
    if(loading){
        postMarkup = <p>Loading post...</p>
    } else {
        const { id, body, createdAt, username, likes, commentCount, likeCount} = data.getPost

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
                                <Button as='div' labelPostition='right' onClick={()=> console.log('Comment on post')} icon="comments" color='blue' content={commentCount}/>
                                {user && user.username === username && (
                                    <DeleteButton postId={id} callback={deletePostCallBack}/>
                                )}
                            </Card.Content>
                        </Card>
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
                id username createdAt
            }
        }
    }
`

export default SinglePost