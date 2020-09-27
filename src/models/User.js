/**
 * User.js
 *
 * Manage Users of app
 *
 * @package    Parking Manager
 * @subpackage models
 * @author     Rahul N
 * @copyright  2020 Rahul
 * @version    0.0.1
 * @since      File available since Release 0.0.0
 */
const mongoose  = require('mongoose')
const validator = require('validator')
const bcrypt    = require('bcryptjs')
const jwt       = require('jsonwebtoken')

const userSchema = mongoose.Schema({
    name: {
        type    : String,
        required: true,
        trim    : true
    },
    email: {
        type     : String,
        required : true,
        unique   : true,
        lowercase: true,
        validate : value => {
            if (!validator.isEmail(value)) {
                throw new Error({error: 'Invalid Email address'})
            }
        }
    },
    password: {
        type     : String,
        required : true,
        minLength: 7
    },
    mobile: {
        type     : String,
        required : false,
        minLength: 7,
        maxLength:12
    },
    gender: {
        type    : String,
        required: false,
        enum    : ['male', 'female', 'other'],
    },
    is_admin: {
        type    : Boolean,
        required: true,
        default : false
    },
    is_differently_abled: {
        type    : Boolean,
        required: true,
        default : false
    },
    is_pregnant: {
        type    : Boolean,
        required: true,
        default : false
    },
    updated: {
        type: String,
        default: new Date().toLocaleString()
    },
    tokens: [{
        token: {
            type    : String,
            required: true
        }
    }]
})

/**
 * pre
 *
 * Function to encript password given by user
 *
 * @package    Parking Manager
 * @subpackage models
 * @author     Rahul N
 * @copyright  2020 Rahul
 * @version    0.0.1
 * @since      Function available since Release 0.0.1
 * @param      nexr callback
 * @return     void
 */
userSchema.pre('save', async function (next) {
    // Hash the password before saving the user model
    const user = this
    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8)
    }
    next()
})

/**
 * generateAuthToken
 *
 * Function to Generate Auth token
 *
 * @package    Parking Manager
 * @subpackage models
 * @author     Rahul N
 * @copyright  2020 Rahul
 * @version    0.0.1
 * @since      Function available since Release 0.0.1
 * @return     String
 */
userSchema.methods.generateAuthToken = async function() {
    // Generate an auth token for the user
    const user = this
    const token = jwt.sign({_id: user._id}, process.env.JWT_KEY)
    user.tokens = user.tokens.concat({token})
    await user.save()
    return token
}

/**
 * findByCredentials
 *
 * Function to find users using emailid and password
 *
 * @package    Parking Manager
 * @subpackage models
 * @author     Rahul N
 * @copyright  2020 Rahul
 * @version    0.0.1
 * @since      Function available since Release 0.0.1
 * @param      email String
 * @param      password String
 * @return     object
 */
userSchema.statics.findByCredentials = async (email, password) => {
    // Search for a user by email and password.
    const user = await User.findOne({ email} )
    if (!user) {
        throw new Error('Invalid login credentials')
    }
    const isPasswordMatch = await bcrypt.compare(password, user.password)
    if (!isPasswordMatch) {
        throw new Error('Invalid login credentials')
    }
    return user
}

/**
 * update
 *
 * Function to update user information
 *
 * @package    Parking Manager
 * @subpackage models
 * @author     Rahul N
 * @copyright  2020 Rahul
 * @version    0.0.1
 * @since      Function available since Release 0.0.1
 * @param      req request object
 * @param      res response object
 * @return     object
 */
userSchema.statics.update = async (req, res) => {
    _id = req.user._id
    const data = await User.updateOne({_id: _id}, req.body, function(err, raw) {
        if(err) {
          console.error(err)
        }
     })
     if (data) {
       return await User.findOne({ _id } )
     }
}

const User = mongoose.model('User', userSchema)

module.exports = User
