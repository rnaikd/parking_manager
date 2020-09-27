/**
 * Log.js
 *
 * Manage logs of activities of Booking/Occupancy/Vacant/Canceling
 * File defines structure of data table Logs
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

const logSchema = mongoose.Schema({
    slot_number: {
        type    : String,
        required: true,
        trim    : true
    },
    user_id: {
        type    : String,
        required: true,
        trim    : true
    },
    user_name: {
        type    : String,
        required: true,
        trim    : true
    },
    activity_at: {
        type    : String,
        required: true,
        default : new Date().toLocaleString()
    },
    narration: {
        type    : String,
        required: false,
        trim    : true
    },
    activity_type: {
        type   : String,
        trim   : true,
        default: 'book',
        enum   : ['book', 'occupy', 'vacant', 'cancel'],
    }
})

/**
 * bookinglog
 *
 * Function to log booking activity
 *
 * @package    Parking Manager
 * @subpackage models
 * @author     Rahul N
 * @copyright  2020 Rahul
 * @version    0.0.1
 * @since      Function available since Release 0.0.1
 * @param      slot_number String
 * @param      req request object
 * @return     void
 */
logSchema.statics.bookinglog = async (slot_number, req) => {
    let narration = 'Slot - ' + slot_number + ' has been booked by ' + req.user.name
    let info = {
        'slot_number'  : slot_number,
        'user_id'      : req.user._id,
        'user_name'    : req.user.name,
        'narration'    : narration,
        'activity_type': 'book'
    }
    const log = new Log(info)
    log.save()
}

/**
 * occupylog
 *
 * Function to log Occupancy activity
 *
 * @package    Parking Manager
 * @subpackage models
 * @author     Rahul N
 * @copyright  2020 Rahul
 * @version    0.0.1
 * @since      Function available since Release 0.0.1
 * @param      slot_number String
 * @param      req request object
 * @return     void
 */
logSchema.statics.occupylog = async (slot_number, req) => {
    let narration = 'Slot - ' + slot_number + ' has been occupied by ' + req.user.name
    let info = {
        'slot_number'  : slot_number,
        'user_id'      : req.user._id,
        'user_name'    : req.user.name,
        'narration'    : narration,
        'activity_type': 'occupy'
    }
    const log = new Log(info)
    log.save()
}

/**
 * vacantlog
 *
 * Function to log vacancy activity
 *
 * @package    Parking Manager
 * @subpackage models
 * @author     Rahul N
 * @copyright  2020 Rahul
 * @version    0.0.1
 * @since      Function available since Release 0.0.1
 * @param      slot_number String
 * @param      req request object
 * @return     void
 */
logSchema.statics.vacantlog = async (slot_number, req) => {
    let narration = 'Slot - ' + slot_number + ' has been vacant by ' + req.user.name
    let info = {
        'slot_number'  : slot_number,
        'user_id'      : req.user._id,
        'user_name'    : req.user.name,
        'narration'    : narration,
        'activity_type': 'vacant'
    }
    const log = new Log(info)
    log.save()
}

/**
 * cancellog
 *
 * Function to log cancellation activity
 *
 * @package    Parking Manager
 * @subpackage models
 * @author     Rahul N
 * @copyright  2020 Rahul
 * @version    0.0.1
 * @since      Function available since Release 0.0.1
 * @param      slot_number String
 * @param      req request object
 * @return     void
 */
logSchema.statics.cancellog = async (slot_number, req = {}) => {
    let narration = 'Slot - ' + slot_number + ' has been canceled'
    let info = {
        'slot_number'  : slot_number,
        'user_id'      : '01',
        'user_name'    : 'System',
        'narration'    : narration,
        'activity_type': 'cancel'
    }
    const log = new Log(info)
    log.save()
}

const Log = mongoose.model('Log', logSchema)

module.exports = Log
