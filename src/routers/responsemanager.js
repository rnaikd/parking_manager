/**
 * responsemanager.js
 *
 * Response structure manager
 *
 * @package    Parking Manager
 * @subpackage routers
 * @author     Rahul N
 * @copyright  2020 Rahul
 * @version    0.0.1
 * @since      File available since Release 0.0.0
 */

const info = {
  "Author" : process.env.AUTHOR,
  "Date"   : new Date().toLocaleString()
}

/**
 * sendSucess
 *
 * Function to wrap response format for sucess
 *
 * @package    Parking Manager
 * @subpackage routers
 * @author     Rahul N
 * @copyright  2020 Rahul
 * @version    0.0.1
 * @since      Function available since Release 0.0.1
 * @param      res response object
 * @param      data object | string (optional)
 * @param      statuscode int (optional)
 * @return     void
 */
function sendSucess(res, data = {}, statuscode = 200){

  // TODO: Meta to manage counts of records ang paging information
  res.status(statuscode).send({
    "meta"       : info,
    "status"     : "ok",
    "status_code": statuscode,
    data
  })
}

/**
 * sendError
 *
 * Function to wrap response format for error
 *
 * @package    Parking Manager
 * @subpackage routers
 * @author     Rahul N
 * @copyright  2020 Rahul
 * @version    0.0.1
 * @since      Function available since Release 0.0.1
 * @param      res response object
 * @param      error object | string (optional)
 * @param      statuscode int (optional)
 * @return     void
 */
function sendError(res, error = {}, statuscode = 500){
  res.status(statuscode).send({
    "meta": info,
    "status": "error",
    "status_code": statuscode,
    error
  })
}

module.exports = { sendSucess, sendError }
