/**
 * handle.js
 *
 * Manage default response to 404 routes (page not found)
 *
 * @package    Parking Manager
 * @subpackage routers
 * @author     Rahul N
 * @copyright  2020 Rahul
 * @version    0.0.1
 * @since      File available since Release 0.0.0
 */

const express = require('express')
const rm      = require('./responsemanager')

const router = express.Router()

router.get('*', function(req, res){
  rm.sendError(res, 'Requested route does not exists', 404)
})

router.post('*', function(req, res){
  rm.sendError(res, 'You can not post to this route', 404)
})

router.put('*', function(req, res){
  rm.sendError(res, 'Editing to this route is not possible', 404)
})

router.delete('*', function(req, res){
  rm.sendError(res, 'Deleting on this route is very difficult', 404)
})

module.exports = router
