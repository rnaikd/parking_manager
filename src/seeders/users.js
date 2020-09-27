/**
 * users.js
 *
 * Reset user data in database (with random test data)
 *
 * @package    Parking Manager
 * @subpackage routers
 * @author     Rahul N
 * @copyright  2020 Rahul
 * @version    0.0.1
 * @since      File available since Release 0.0.0
 */
const User = require('../models/User')


/**
 * seed
 *
 * Function to seed random users' data to database
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
  User.collection.drop()
  i = 1
  try {
    let gendersavailable = ['male', 'female', 'other']
    while(i <= 150) {
      userinfo = {}
      userinfo.name     = 'User Name ' + i
      userinfo.email    = 'user' + i + '@email.com'
      userinfo.password = '123456789'
      userinfo.mobile   = '9876543' + i
      userinfo.gender   = gendersavailable[Math.floor(Math.random() * gendersavailable.length)]
      let is_differently_abled = false
      if(i % 2 == 0 && Math.sqrt(i) % 1 === 0) {
          is_differently_abled = Math.random() < 0.5
      }
      let is_pregnant = false
      if(i % 2 == 0 && Math.sqrt(i) % 1 === 0 && userinfo.gender == 'female') {
         is_pregnant = Math.random() < 0.5
      }
      userinfo.is_differently_abled = is_differently_abled
      userinfo.is_pregnant = is_pregnant
      if(i == 1) {
        userinfo.is_admin = true
      }

      const user = new User(userinfo)
      user.save()
      i++
    }
    return { 'error': false, 'msg': (i - 1) + ' slots inserted' }
  } catch(err) {
    return { 'error': true, 'msg': err }
  }

}

module.exports = { seed }
