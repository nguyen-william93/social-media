const User = require('../../models/User')
const bcrypt = require ('bcryptjs')
const jwt = require ('jsonwebtoken')
const { SECRET_KEY} = require('../../config')

module.exports = {
    Mutation: {
        async register(parent, {registerInput: {username, email, password, confirmedPassword}}, context, info) {
            //validate user data
            //make sure user isn't already exist
            //harsh the password before storing in the database
            //create auth token
            password = await bcrypt.hash(password, 12)

            const newUser = new User (
                {
                    email, 
                    username, 
                    password, 
                    createdAt: new Date().toISOString()
                }
            )
            const res = await newUser.save();

            const token = jwt.sign({
                id: res.id,
                email: res.email,
                username: res.username
        }, SECRET_KEY, {expiresIn: '1h'});

        return {
            ...res._doc,
            id: res._id,
            token
        }
        }
    }
}