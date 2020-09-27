/**
 * admin.js
 *
 * Manage Authorization
 *
 * @package    Parking Manager
 * @subpackage middleware
 * @author     Rahul N
 * @copyright  2020 Rahul
 * @version    0.0.1
 * @since      File available since Release 0.0.0
 */
// Using jsonwebtoken for jwt support
const rm  = require('../routers/responsemanager')

/**
 * admin
 *
 * Function to manage authorization of user
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
const admin = async(req, res, next) => {
    if(req.user.is_admin) {
        next()
    } else {
      rm.sendError(res, { error: 'You are not authorized to access this resource' }, 401)
    }

}

module.exports = admin
