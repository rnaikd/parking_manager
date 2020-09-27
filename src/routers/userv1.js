/**
 * userv1.js
 *
 * Business logic for user management
 *
 * @package    Parking Manager
 * @subpackage routers
 * @author     Rahul N
 * @copyright  2020 Rahul
 * @version    0.0.1
 * @since      File available since Release 0.0.0
 */
const express    = require('express')
const User       = require('../models/User')
const auth       = require('../middleware/auth')
const admin      = require('../middleware/admin')
const rm         = require('./responsemanager')
const usersSeed  = require('../seeders/users')
const router     = express.Router()
const base_endpt = process.env.BASE_END_POINT
const version    = '/v1'

/**
 * get
 *
 * Function to get logged in user's information
 *
 * @package    Parking Manager
 * @subpackage routers
 * @author     Rahul N
 * @copyright  2020 Rahul
 * @version    0.0.1
 * @since      Function available since Release 0.0.1
 * @param      req request object
 * @param      res response object
 * @return     void
 */
router.get(base_endpt + version + '/user', auth, async(req, res) => {
  try {
    rm.sendSucess(res, req.user)
  } catch (error) {
    rm.sendError(res, error)
  }
})

/**
 * get
 *
 * Function to get list of users
 *
 * @package    Parking Manager
 * @subpackage routers
 * @author     Rahul N
 * @copyright  2020 Rahul
 * @version    0.0.1
 * @since      Function available since Release 0.0.1
 * @param      req request object
 * @param      res response object
 * @return     void
 */
router.get(base_endpt + version + '/users', auth, admin, async(req, res) => {
  try {
    var i = 0
    User.find({}, function(err, users) {
      var userMap = {}
      users.forEach(function(user) {
        finalData                      = {}
        finalData.name                 = user.name
        finalData.email                = user.email
        finalData.email                = user.email
        finalData.is_differently_abled = user.is_differently_abled
        finalData.is_pregnant          = user.is_pregnant
        finalData.is_pregnant          = user.is_pregnant
        finalData.gender               = user.gender
        userMap[i]                     = finalData
        i++
      })
      rm.sendSucess(res, userMap)
    })
  } catch (error) {
    rm.sendError(res, error)
  }
})

/**
 * post
 *
 * Function to register new user
 *
 * @package    Parking Manager
 * @subpackage routers
 * @author     Rahul N
 * @copyright  2020 Rahul
 * @version    0.0.1
 * @since      Function available since Release 0.0.1
 * @param      req request object
 * @param      res response object
 * @return     void
 */
router.post(base_endpt + version + '/user/register', async (req, res) => {
    try {
        const user = new User(req.body)
        await user.save()
        const token = await user.generateAuthToken()
        rm.sendSucess(res, token)
    } catch (error) {
        rm.sendError(res, error, 400)
    }
})

/**
 * post
 *
 * Function to seed random users' list in database using users seeder
 *
 * @package    Parking Manager
 * @subpackage routers
 * @author     Rahul N
 * @copyright  2020 Rahul
 * @version    0.0.1
 * @since      Function available since Release 0.0.1
 * @param      req request object
 * @param      res response object
 * @return     void
 */
router.post(base_endpt + version + '/user/register/default', auth,  admin, async (req, res) => {
    try {
        let info = usersSeed.seed()
        if(info.error) {
          rm.sendError(res, 'Something went wrong', 400)
        } else {
          rm.sendSucess(res, info.msg)
        }
    } catch (error) {
        rm.sendError(res, error, 400)
    }
})

/**
 * post
 *
 * Function to get auth token for validated user
 *
 * @package    Parking Manager
 * @subpackage routers
 * @author     Rahul N
 * @copyright  2020 Rahul
 * @version    0.0.1
 * @since      Function available since Release 0.0.1
 * @param      req request object
 * @param      res response object
 * @return     void
 */
router.post(base_endpt + version + '/user/login', async(req, res) => {
    try {
        const { email, password } = req.body
        const user = await User.findByCredentials(email, password)
        if (!user) {
            rm.sendError(res, {error: 'Login failed! Check authentication credentials'}, 401)
        }
        const token = await user.generateAuthToken()
        rm.sendSucess(res, token, 201)
    } catch (error) {
        rm.sendError(res, error, 400)
    }
})

/**
 * post
 *
 * Function to logout loggedin user
 *
 * @package    Parking Manager
 * @subpackage routers
 * @author     Rahul N
 * @copyright  2020 Rahul
 * @version    0.0.1
 * @since      Function available since Release 0.0.1
 * @param      req request object
 * @param      res response object
 * @return     void
 */
router.post(base_endpt + version + '/user/logout', auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token != req.token
        })
        await req.user.save()
        rm.sendSucess(res)
    } catch (error) {
        rm.sendError(res, error)
    }
})

/**
 * post
 *
 * Function to logout loggedin user from all devices
 *
 * @package    Parking Manager
 * @subpackage routers
 * @author     Rahul N
 * @copyright  2020 Rahul
 * @version    0.0.1
 * @since      Function available since Release 0.0.1
 * @param      req request object
 * @param      res response object
 * @return     void
 */
router.post(base_endpt + version + '/user/logoutalldevices', auth, async(req, res) => {
    // Log user out of all devices
    try {
        req.user.tokens.splice(0, req.user.tokens.length)
        await req.user.save()
        rm.sendSucess(res)
    } catch (error) {
        rm.sendError(res, error)
    }
})

/**
 * put
 *
 * Function to update user information
 *
 * @package    Parking Manager
 * @subpackage routers
 * @author     Rahul N
 * @copyright  2020 Rahul
 * @version    0.0.1
 * @since      Function available since Release 0.0.1
 * @param      req request object
 * @param      res response object
 * @return     void
 */
router.put(base_endpt + version + '/user', auth, async(req, res) => {
    try {
      const user = await User.update(req, res)
      rm.sendSucess(res, user, 201)
    } catch (error) {
      rm.sendError(res, error)
    }
})

module.exports = router
