/**
 * logsv1.js
 *
 * Business logic for activity logs of user actions
 *
 * @package    Parking Manager
 * @subpackage routers
 * @author     Rahul N
 * @copyright  2020 Rahul
 * @version    0.0.1
 * @since      File available since Release 0.0.0
 */

const express    = require('express')
const Logs       = require('../models/Log')
const auth       = require('../middleware/auth')
const admin      = require('../middleware/admin')
const rm         = require('./responsemanager')
const usersSeed  = require('../seeders/users')
const router     = express.Router()
const base_endpt = process.env.BASE_END_POINT
const version = '/v1'

/**
 * get
 *
 * Function to get list of logs
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
router.get(base_endpt + version + '/logs', auth, async(req, res) => {
  try {
      let i  = 0
      filter = {}
      // TODO: Add filters for booking, occupy, vacant and cancel logs

      await Logs.find(filter, function(err, logs) {
      let logsMap = {}
      logs.forEach(function(log) {
          logsMap[i] = log
          i++
      })
      rm.sendSucess(res, logsMap)
    })
  } catch (error) {
    rm.sendError(res, error)
  }
})

/**
 * delete
 *
 * Function to clear logs stored in database
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
router.delete(base_endpt + version + '/logs', auth, admin, async (req, res) => {
    try {
      Logs.collection.drop()
      rm.sendSucess(res, 'Logs cleared')
    } catch (error) {
        rm.sendError(res, error, 400)
    }
})

module.exports = router
