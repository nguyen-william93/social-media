const Post =require ("../../models/Post")
const checkAuth = require('../../Utils/checkAuth')
const {AuthenticationError, UserInputError} = require('apollo-server');
const { argsToArgsConfig } = require("graphql/type/definition");

module.exports = {
    Query: {
        getPosts: async() => {
            try{
                const posts = await Post.find().sort({ createdAt: -1});
                return posts;
            }catch(err){
                throw new Error(err)
            }
        },
        getPost: async(parent, {postId}) => {
            try{
                const post = await Post.findById(postId);
                if(post){
                    return post;
                } else {
                    throw new Error('Post not found')
                }
            } catch (err){
                throw new Error(err)
            }
        }
    },

    Mutation:{
        createPost: async(parent, {body}, context) => {
            const user = checkAuth(context);

            if(args.body.trim() === ''){
                throw new Error('Post body must not be empty')
            }
            
            const newPost = new Post(
                {
                    body,
                    user: user.indexOf,
                    username: user.username,
                    createdAt: new Date().toISOString()
                }
            )

            const post = await newPost.save();

            context.pubsub.publish('NEW_POST', {
                newPost: post
            })

            return post
        },

        deletePost: async(parent, {postId}, context)=>{
            const user = checkAuth(context);
            try{
                const post = await Post.findById(postId);
                if(user.username === post.username){
                    await post.delete();
                    return "Post deleted successfully"
                } else {
                    throw new AuthenticationError("Action not allowed")
                }
            } catch (err) {
                throw new Error(err)
            }
        },
        likePost: async(parent, {postId}, context) => {
            const {username} = checkAuth(context);

            const post = await Post.findById(postId);
            //post is found
            if(post){
                if(post.likes.find(like => like.username === username)){
                    //post already liked => unlike it
                    post.likes = post.likes.filter(like => like.username !== username)
                    await post.save()
                } else {
                    //not liked => so like post
                    post.likes.push(
                        {
                            username,
                            createdAt: new Date().toISOString()
                        }
                    )
                }
                await post.save();
                return post;
            //post is not found
            } else {
                throw new UserInputError('Post not found')
            }
        }
    },
    Subscription: {
        newPost: {
            subscribe: (parent, _,{pubsub}) => pubsub.asyncIterator('NEW_POST')
        }
    }
}