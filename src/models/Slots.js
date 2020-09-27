/**
 * Slots.js
 *
 * Manage Parking Slots
 *
 * @package    Parking Manager
 * @subpackage models
 * @author     Rahul N
 * @copyright  2020 Rahul
 * @version    0.0.1
 * @since      File available since Release 0.0.0
 */
const mongoose  = require('mongoose')
const Logs      = require('./Log')

const slotsSchema = mongoose.Schema({
    slot_number: {
        type    : String,
        required: true,
        trim    : true,
        unique  : true
    },
    slot_type: {
        type    : String,
        required: true,
        trim    : true,
        default : '4 wheeler',
        enum    : ['2 wheeler', '4 wheeler']
    },
    is_reserved: {
        type    : Boolean,
        required: true,
        trim    : true,
        default : false
    },
    is_booked: {
        type    : Boolean,
        required: true,
        trim    : true,
        default : false
    },
    is_occupied: {
        type    : Boolean,
        required: true,
        trim    : true,
        default : false
    },
    booked_at: {
        type: String,
        trim: true
    },
    occupied_at: {
        type: String,
        trim: true
    },
    booked_by_id: {
        type: String,
        trim: true
    },
    occupied_by_id: {
        type: String,
        trim: true
    },
    booked_by_name: {
        type: String,
        trim: true
    },
    occupied_by_name: {
        type: String,
        trim: true
    },
    updated: {
        type   : String,
        default: new Date().toLocaleString()
    }
})

/**
 * updateSlot
 *
 * Function to update slot information
 *
 * @package    Parking Manager
 * @subpackage models
 * @author     Rahul N
 * @copyright  2020 Rahul
 * @version    0.0.1
 * @since      Function available since Release 0.0.1
 * @param      slot_number String
 * @param      req request object
 * @return     object
 */
slotsSchema.statics.upadeSlot = async (slot_number, req) => {
    let slot = await Slots.findOne({ slot_number } )
    if(slot == null) {
      return {'error': true, 'msg': 'No slot available with number ' + slot_number}
    }
    const data = await Slots.updateOne({slot_number: slot_number}, req.body, function(err, raw) {
        if(err) {
          console.error(err)
        }
     })
     slot = await Slots.findOne({ slot_number } )
     return {'error': false, 'msg': slot }
}

/**
 * deleteSlot
 *
 * Function to delete a slot
 *
 * @package    Parking Manager
 * @subpackage models
 * @author     Rahul N
 * @copyright  2020 Rahul
 * @version    0.0.1
 * @since      Function available since Release 0.0.1
 * @param      slot_number String
 * @param      req request object
 * @return     object
 */
slotsSchema.statics.deleteeSlot = async (slot_number) => {
    let slot = await Slots.findOne({ slot_number } )
    if(slot == null) {
      return {'error': true, 'msg': 'No slot available with number ' + slot_number}
    }
    Slots.remove({ slot_number: slot_number }).exec()
    return {'error': false, 'msg': 'Slot deleted' }
}

/**
 * getBookingPercentage
 *
 * Function to calculate bookinf percentage
 *
 * @package    Parking Manager
 * @subpackage models
 * @author     Rahul N
 * @copyright  2020 Rahul
 * @version    0.0.1
 * @since      Function available since Release 0.0.1
 * @param      slot_number String
 * @param      req request object
 * @return     object
 */
slotsSchema.statics.getBookingPercentage = async () => {
    let totalrecords = await Slots.countDocuments({})
    let bookedrecords = await Slots.countDocuments({is_booked: true})
    if(bookedrecords == 0) {
      return {'error': false, 'msg': 100 }
    }
    return {'error': false, 'msg': (bookedrecords / totalrecords) * 100 }
}

/**
 * clearSlot
 *
 * Function to check if any slot has been booked but not get occupied
 * till waiting period and then reset it's status
 *
 * @package    Parking Manager
 * @subpackage models
 * @author     Rahul N
 * @copyright  2020 Rahul
 * @version    0.0.1
 * @since      Function available since Release 0.0.1
 * @see        getBookingPercentage()
 * @see        Logs.cancellog()
 * @return     object
 */
slotsSchema.statics.clearSlots = async () => {
    let wait_time = 0

    // Let's find all slots which are booked but not yet occupied
    await Slots.find({is_booked: true, is_occupied: false}, async function(err, slots) {

      // Have a look at how much parking has been booked
      let booking_percentage = await Slots.getBookingPercentage()
      if(booking_percentage.msg <= 50) {
          wait_time = process.env.WAITING_TIME_BEFORE_50
      } else {
          wait_time = process.env.WAITING_TIME_AFTER_50
      }

      // Check current time to be compare with expiry time  of slot booking
      current_clear_time = new Date().toLocaleString()

      // Compair slots' booking time which are booked but not yet occupied with
      // current time and reset booking status if case of timeout
      slots.forEach(async function(slot) {
        var slot_booking_date_time = new Date(slot.booked_at)
        slot_booking_date_time.setMinutes( slot_booking_date_time.getMinutes() + wait_time)
        var expiry_time = slot_booking_date_time.toLocaleString()
        if(current_clear_time >= expiry_time) {
            let current_slot = await Slots.findOne({ slot_number: slot.slot_number } )
            current_slot.is_booked        = false
            current_slot.booked_by_id     = ''
            current_slot.booked_by_name   = ''
            current_slot.booked_at        = ''
            current_slot.is_occupied      = false
            current_slot.occupied_by_id   = ''
            current_slot.occupied_by_name = ''
            current_slot.occupied_at      = ''
            current_slot.save()
            Logs.cancellog(slot.slot_number)
        }
      })
    })
}

/**
 * isAvailable
 *
 * Function to check if slot is available for booking
 *
 * @package    Parking Manager
 * @subpackage models
 * @author     Rahul N
 * @copyright  2020 Rahul
 * @version    0.0.1
 * @since      Function available since Release 0.0.1
 * @param      slot_number String
 * @return     object
 */
slotsSchema.statics.isAvailable = async (slot_number) => {
    let slot = await Slots.findOne({ slot_number } )
    if(slot == null) {
      return {'error': true, 'msg': 'No slot available with number ' + slot_number}
    }

    return {'error': false, 'msg': !slot.is_booked }
}

/**
 * book
 *
 * Function to book a slot on user request
 *
 * @package    Parking Manager
 * @subpackage models
 * @author     Rahul N
 * @copyright  2020 Rahul
 * @version    0.0.1
 * @since      Function available since Release 0.0.1
 * @param      slot_number String
 * @param      req request object
 * @return     object
 */
slotsSchema.statics.book = async (slot_number, req) => {
    let slot = await Slots.findOne({ slot_number } )

    if(slot == null) {
      return {'error': true, 'msg': 'No slot available with number ' + slot_number}
    }
    if(slot.is_reserved && !req.user.is_differently_abled) {
        return {'error': true, 'msg': 'Slot is reserved for differently abled people' }
    }
    slot.is_booked      = true
    slot.is_occupied    = false
    slot.booked_at      = new Date().toLocaleString()
    slot.booked_by_id   = req.user._id
    slot.booked_by_name = req.user.name
    slot.save()
    return {'error': false, 'msg': slot }
}

/**
 * isBookedBySameUser
 *
 * Function to check if slot has been booked by loggedin user or not
 *
 * @package    Parking Manager
 * @subpackage models
 * @author     Rahul N
 * @copyright  2020 Rahul
 * @version    0.0.1
 * @since      Function available since Release 0.0.1
 * @param      slot_number String
 * @param      req request object
 * @return     object
 */
slotsSchema.statics.isBookedBySameUser = async (slot_number, req) => {
    let slot = await Slots.findOne({ slot_number } )
    if(slot == null) {
       return {'error': true, 'msg': 'No slot available with number ' + slot_number}
    }
    if(slot.is_occupied) {
      return {'error': true, 'msg': 'Slot is already occupied' }
    }
    if(slot.is_booked && slot.booked_by_id == req.user._id) {
        return {'error': false, 'msg': slot }
    }
    return {'error': true, 'msg': 'Please book this slot first'}

}

/**
 * occupy
 *
 * Function to occupy a slot on user request
 *
 * @package    Parking Manager
 * @subpackage models
 * @author     Rahul N
 * @copyright  2020 Rahul
 * @version    0.0.1
 * @since      Function available since Release 0.0.1
 * @param      slot_number String
 * @param      req request object
 * @return     object
 */
slotsSchema.statics.occupy = async (slot_number, req) => {
    let slot = await Slots.findOne({ slot_number } )

    if(slot == null) {
      return {'error': true, 'msg': 'No slot available with number ' + slot_number}
    }
    slot.is_occupied      = true
    slot.occupied_at      = new Date().toLocaleString()
    slot.occupied_by_id   = req.user._id
    slot.occupied_by_name = req.user.name
    slot.save()
    return {'error': false, 'msg': slot }
}

/**
 * isOccupiedBySameUser
 *
 * Function to if slot has been occupied by loggedin user
 *
 * @package    Parking Manager
 * @subpackage models
 * @author     Rahul N
 * @copyright  2020 Rahul
 * @version    0.0.1
 * @since      Function available since Release 0.0.1
 * @param      slot_number String
 * @param      req request object
 * @return     object
 */
slotsSchema.statics.isOccupiedBySameUser = async (slot_number, req) => {
    let slot = await Slots.findOne({ slot_number } )
    if(slot == null) {
      return {'error': true, 'msg': 'No slot available with number ' + slot_number}
    }
    if(slot.is_booked && slot.is_occupied && slot.occupied_by_id == req.user._id) {
        return {'error': false, 'msg': slot }
    }
    return {'error': true, 'msg': 'This slot is not occupied by you'}
}

/**
 * vacant
 *
 * Function to vacant the slot occupied by user on user request
 *
 * @package    Parking Manager
 * @subpackage models
 * @author     Rahul N
 * @copyright  2020 Rahul
 * @version    0.0.1
 * @since      Function available since Release 0.0.1
 * @param      slot_number String
 * @param      req request object
 * @return     object
 */
slotsSchema.statics.vacant = async (slot_number, req) => {
    let slot = await Slots.findOne({ slot_number } )

    if(slot == null) {
      return {'error': true, 'msg': 'No slot available with number ' + slot_number}
    }
    slot.is_booked        = false
    slot.booked_by_id     = ''
    slot.booked_by_name   = ''
    slot.booked_at        = ''
    slot.is_occupied      = false
    slot.occupied_by_id   = ''
    slot.occupied_by_name = ''
    slot.occupied_at      = ''
    slot.save()
    return { 'error': false, 'msg': slot }
}

const Slots = mongoose.model('Slots', slotsSchema)

module.exports = Slots
