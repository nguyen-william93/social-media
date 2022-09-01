const User = require('../../models/User')
const bcrypt = require ('bcryptjs')
const jwt = require ('jsonwebtoken')
const { SECRET_KEY} = require('../../config')
const {UserInputError} = require('apollo-server')
const {validateRegisterInput} = require('../../Utils/validation')

module.exports = {
    Mutation: {
        async register(parent, {registerInput: {username, email, password, confirmedPassword}}, context, info) {
            //validate user data
            const {valid, errors} = validateRegisterInput(username, email, password, confirmedPassword);
            console.log(valid, errors)
            if (!valid){
                throw new UserInputError('Error',{errors})
            }
            //make sure user isn't already exist
            const user = await User.findOne({ username })
            if(user){
                throw new UserInputError("Username is taken", {
                    errors: {
                        username: "This username is taken"
                    }
                })
            }

            //hash password
            password = await bcrypt.hash(password, 12)

            //create new user
            const newUser = new User (
                {
                    email, 
                    username, 
                    password, 
                    createdAt: new Date().toISOString()
                }
            )
            const res = await newUser.save();
            
            //sign token
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