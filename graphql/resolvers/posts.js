const Post =require ("../../models/Post")
const checkAuth = require('../../Utils/checkAuth')
const {AuthenticationError} = require('apollo-server')

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
            const newPost = new Post(
                {
                    body,
                    user: user.indexOf,
                    username: user.username,
                    createdAt: new Date().toISOString
                }
            )

            const post = await newPost.save();

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
        }
    }
}