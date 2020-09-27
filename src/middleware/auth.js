/**
 * auth.js
 *
 * Manage Authentication
 *
 * @package    Parking Manager
 * @subpackage middleware
 * @author     Rahul N
 * @copyright  2020 Rahul
 * @version    0.0.1
 * @since      File available since Release 0.0.0
 */
// Using jsonwebtoken for jwt support
const jwt  = require('jsonwebtoken')
const User = require('../models/User')
const rm  = require('../routers/responsemanager')

/**
 * auth
 *
 * Function to manage authentication of user and set values in req object
 *
 * @package    Parking Manager
 * @subpackage middleware
 * @author     Rahul N
 * @copyright  2020 Rahul
 * @version    0.0.1
 * @since      Function available since Release 0.0.1
 * @param      req request object
 * @param      res response object
 * @param      next
 * @return     void
 */
const auth = async(req, res, next) => {
  if(req.header('Authorization') != undefined) {
    const token = req.header('Authorization').replace('Bearer ', '')
    try {
        const data = jwt.verify(token, process.env.JWT_KEY)
        const user = await User.findOne({ _id: data._id, 'tokens.token': token })

        if (!user) {
            throw new Error()
        }
        req.user  = user
        req.token = token
        next()
    } catch (error) {
        rm.sendError(res, { error: 'Not authorized to access this resource' }, 401)
    }
  }
    else {
        rm.sendError(res, { error: 'Not authorized to access this resource' }, 401)
    }
}

module.exports = auth
