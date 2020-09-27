/**
 * slotsv1.js
 *
 * Business logic for parking slots
 *
 * @package    Parking Manager
 * @subpackage routers
 * @author     Rahul N
 * @copyright  2020 Rahul
 * @version    0.0.1
 * @since      File available since Release 0.0.0
 */
const express    = require('express')
const Slots      = require('../models/Slots')
const Logs       = require('../models/Log')
const auth       = require('../middleware/auth')
const admin      = require('../middleware/admin')
const rm         = require('./responsemanager')
const slotsSeed  = require('../seeders/slots')
const router     = express.Router()
const base_endpt = process.env.BASE_END_POINT
const version    = '/v1'

/**
 * get
 *
 * Function to get list of slots
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
router.get(base_endpt + version + '/slots', auth, async(req, res) => {
  try {
    // Filters
    let filter      = {}
    let is_reserved = (req.query.reserved === '1') ? 1 : (req.query.reserved === '0') ? 0 : 2
    let is_booked   = (req.query.booked   === '1') ? 1 : (req.query.booked   === '0') ? 0 : 2
    let is_occupied = (req.query.occupied === '1') ? 1 : (req.query.occupied === '0') ? 0 : 2

    // Let's get slots cleaned first
    await Slots.clearSlots()

    if(is_reserved != undefined && (is_reserved == 1 || is_reserved == 0)) {
      filter.is_reserved = is_reserved
    }
    if(is_booked != undefined && (is_booked == 1 || is_booked == 0)) {
      filter.is_booked = is_booked
    }
    if(is_occupied != undefined && (is_occupied == 1 || is_occupied == 0)) {
      filter.is_occupied = is_occupied
    }

    let i = 0
    await Slots.find(filter, function(err, slots) {
      let slotsMap = {}
      slots.forEach(function(slot) {
        slotsMap[i] = slot
        i++
      })
      rm.sendSucess(res, slotsMap)
    })
  } catch (error) {
    rm.sendError(res, error)
  }
})

/**
 * post
 *
 * Function to add a slot
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
router.post(base_endpt + version + '/slots', auth, admin, async (req, res) => {
    try {
      const slot = new Slots(req.body)
      await slot.save()
      rm.sendSucess(res, slot)
    } catch (error) {
        rm.sendError(res, error, 400)
    }
})

/**
 * post
 *
 * Function to add default (random test slots) using slots seeder
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
router.post(base_endpt + version + '/slots/default', auth, admin, async (req, res) => {
    try {
      let info = slotsSeed.seed()
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
 * Function to book a slot
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
router.post(base_endpt + version + '/slots/book/:slot_number', auth, async (req, res) => {
    try {
        await Slots.clearSlots()
        let slot_number = req.params.slot_number
        let is_available = await Slots.isAvailable(slot_number)
        if(is_available.error) {
          rm.sendError(res, is_available.msg, 400)
        }
        if(is_available.msg) {
          // Book slot
          let booking = await Slots.book(slot_number, req)
          if(booking.error) {
              rm.sendError(res, booking.msg, 400)
          }
          Logs.bookinglog(slot_number, req)
          rm.sendSucess(res, booking.msg, 200)
        }
        rm.sendError(res, slot_number + ' is not available', 400)
    } catch (error) {
        rm.sendError(res, 'error', 400)
    }
})

/**
 * post
 *
 * Function to occupy slot
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
router.post(base_endpt + version + '/slots/occupy/:slot_number', auth, async (req, res) => {
    try {
      await Slots.clearSlots()
      let slot_number = req.params.slot_number
      let is_booked_by_same_user = await Slots.isBookedBySameUser(slot_number, req)
      if(is_booked_by_same_user.error) {
        rm.sendError(res, is_booked_by_same_user.msg, 400)
      }
      if(is_booked_by_same_user.msg) {
        // Book slot
        let occupy = await Slots.occupy(slot_number, req)
        if(occupy.error) {
            rm.sendError(res, occupy.msg, 400)
        }
        Logs.occupylog(slot_number, req)
        rm.sendSucess(res, occupy.msg, 200)
      }
      rm.sendError(res, 'First you should book slot ' + slot_number, 400)
    } catch (error) {
        rm.sendError(res, error, 400)
    }
})

/**
 * post
 *
 * Function to vacant the slot
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
router.post(base_endpt + version + '/slots/vacant/:slot_number', auth, async (req, res) => {
    try {
        await Slots.clearSlots()
        let slot_number = req.params.slot_number
        let is_occupied_by_same_user = await Slots.isOccupiedBySameUser(slot_number, req)
        if(is_occupied_by_same_user.error) {
          rm.sendError(res, is_occupied_by_same_user.msg, 400)
        }
        if(is_occupied_by_same_user.msg) {
          let vacant = await Slots.vacant(slot_number, req)
          if(vacant.error) {
              rm.sendError(res, vacant.msg, 400)
          }
          Logs.vacantlog(slot_number, req)
          rm.sendSucess(res, vacant.msg, 200)
        }
    } catch (error) {
        rm.sendError(res, error, 400)
    }
})

/**
 * put
 *
 * Function to update the slot
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
router.put(base_endpt + version + '/slots/:slot_number', auth, admin, async(req, res) => {
    try {
        const slot = await Slots.upadeSlot(req.params.slot_number, req)
        if(slot.error) {
          rm.sendError(res, slot.msg, 400)
        }
        rm.sendSucess(res, slot.msg, 201)
    } catch (error) {
        rm.sendError(res, error, 400)
    }
})

/**
 * delete
 *
 * Function to update the slot
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
router.delete(base_endpt + version + '/slots/:slot_number', auth, admin, async (req, res) => {
    try {
        const slot = await Slots.deleteeSlot(req.params.slot_number)
        if(slot.error) {
          rm.sendError(res, slot.msg, 400)
        }
        rm.sendSucess(res, slot.msg, 201)
    } catch (error) {
        rm.sendError(res, error)
    }
})

module.exports = router
