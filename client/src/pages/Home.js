import React, {useContext} from "react"
import {useQuery} from '@apollo/react-hooks'
import {Grid, Transition} from 'semantic-ui-react'

import {AuthContext} from '../context/auth'
import PostCard from '../components/PostCard.js'
import PostForm from '../components/PostForm.js'
import {FETCH_POSTS_QUERY} from "../utils/graphql"

const Home = () => {
    const { user } = useContext(AuthContext)
    const { loading, data } = useQuery(FETCH_POSTS_QUERY);

    return (
        <Grid columns={3}>
            <Grid.Row centered className="page-title">
                <h1>Recent Post</h1>
            </Grid.Row>
        <Grid.Row>
            {user && (
                <Grid.Column>
                    <PostForm/>
                </Grid.Column>
            )}
            {loading ? (
                <h1>Loading Post...</h1>
            ):(
                <Transition.Group>
                {data && data.getPosts.map(post => (
                    <Grid.Column key={post.id} style={{marginBottom: 20 }}>
                        <PostCard post={post}/>
                    </Grid.Column>
                ))}
                </Transition.Group>
            )}
        </Grid.Row>
        </Grid>
    )
}

export default Home;