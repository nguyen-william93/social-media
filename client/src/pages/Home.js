import React from "react"
import {useQuery} from '@apollo/react-hooks'
import gql from 'graphql-tag'
import {Grid} from 'semantic-ui-react'

import PostCard from '../components/PostCard.js'

const Home = () => {

    const { loading, data } = useQuery(FETCH_POSTS_QUERY);
    console.log(loading)
    console.log(data)

    return (
        <Grid columns={3}>
            <Grid.Row centered className="page-title">
                <h1>Recent Post</h1>
            </Grid.Row>
        <Grid.Row>
            {loading ? (
                <h1>Loading Post...</h1>
            ):(
                data && data.getPosts.map(post => (
                    <Grid.Column key={post.id} style={{marginBottom: 20 }}>
                        <PostCard post={post}/>
                    </Grid.Column>
                ))
            )}
        </Grid.Row>
        </Grid>
    )
}

const FETCH_POSTS_QUERY = gql`
{
    getPosts{
        id body createdAt username likeCount
        likes {
            username
        }
        commentCount
        comments{
            id username createdAt body
        }
    }
}
`

export default Home;