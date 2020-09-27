/**
 * slots.js
 *
 * Reset slots data in database (with random test data)
 *
 * @package    Parking Manager
 * @subpackage seeders
 * @author     Rahul N
 * @copyright  2020 Rahul
 * @version    0.0.1
 * @since      File available since Release 0.0.0
 */
const Slots = require('../models/Slots')

/**
 * seed
 *
 * Function to seed random slot data to database
 *
 * @package    Parking Manager
 * @subpackage seeders
 * @author     Rahul N
 * @copyright  2020 Rahul
 * @version    0.0.1
 * @since      Function available since Release 0.0.1
 * @return     object
 */
function seed() {
  Slots.collection.drop()
  i = 1
  try {
    while(i <= 120) {
      slotinfo = {}
      slotinfo.slot_number = 'PARKING' + i
      if(i <= 24) {
        slotinfo.is_reserved = true
      }
      const slot = new Slots(slotinfo)
      slot.save()
      i++
    }
    return { 'error': false, 'msg': (i - 1) + ' slots inserted' }
  } catch(err) {
    return { 'error': true, 'msg': err }
  }

}

module.exports = { seed }
