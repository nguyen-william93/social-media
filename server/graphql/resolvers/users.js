const User = require('../../models/User')
const bcrypt = require ('bcryptjs')
const jwt = require ('jsonwebtoken')
const { SECRET_KEY} = require('../../../config')
const {UserInputError} = require('apollo-server')
const {validateRegisterInput, validateLoginInput} = require('../../../Utils/validation')

const generaToken = (user) => {
    return jwt.sign({
        id: user.id,
        email: user.email,
        username: user.username
    }, 
    SECRET_KEY, 
    {expiresIn: "5h"});
}


module.exports = {
    Mutation: {
        register: async (parent, {registerInput: {username, email, password, confirmedPassword}}, context, info) => {
            //validate user data
            const {valid, errors} = validateRegisterInput(username, email, password, confirmedPassword);
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
            const token = generaToken(res)

            return {
                ...res._doc,
                id: res._id,
                token
            }
        },

        login: async(parent, {username, password}) => {
            const {valid, errors} = validateLoginInput(username, password);
            const user = await User.findOne({username});
            if(!user){
                errors.general = 'User not found';
                throw new UserInputError("User not found", {errors})
            }

            const match = await bcrypt.compare(password, user.password);
            if(!match){
                errors.general = "Wrong credential"
                throw new UserInputError("Wrong Credential", {errors})
            }

            const token = generaToken(user);

            return {
                ...user._doc,
                id: user._id,
                token
            }
        },
    }
}