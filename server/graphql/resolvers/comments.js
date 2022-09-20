const Post = require('../../models/Post');
const {UserInputError, AuthenticationError} = require('apollo-server');
const checkAuth = require("../../../Utils/checkAuth")


module.exports = {
    Mutation:{
        createComment: async (parent, {postId, body}, context) => {
            const {username} = checkAuth(context);

            if(body.trim() === ""){
                throw new UserInputError('Empty Comment', {
                    errors: {
                        body: "Comment body can not be emoty"
                    }
                })
            }
            
            const post = await Post.findById(postId);
            if(post){
                post.comments.unshift(
                    {
                        body,
                        username,
                        createdAt: new Date().toISOString()
                    }
                )
                await post.save()
                return post;
            } else {
                throw new UserInputError('Post not found');
            }
        },

        deleteComment: async(parent, {postId, commentId}, context) => {
            const {username} = checkAuth(context)

            const post = await Post.findById(postId);
            if(post){
                const commentIndex = post.comments.findIndex(c => c.id === commentId)
                if(post.comments[commentIndex].username === username){
                    post.comments.splice(commentIndex, 1)
                    await post.save();
                    return post;
                } else {
                    throw new AuthenticationError("Action is not allowed")
                }
            } else {
                throw new UserInputError('Post not found');
            }
        }
    }
}