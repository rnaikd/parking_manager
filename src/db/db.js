/**
 * db.js
 *
 * Database file to manage connections
 *
 * @package    Parking Manager
 * @subpackage db
 * @author     Rahul N
 * @copyright  2020 Rahul
 * @version    0.0.1
 * @since      File available since Release 0.0.0
 */
// Using mongoose to manage Database oparations
const mongoose = require('mongoose')

// Setting values to avoid warnings
mongoose.connect(process.env.MONGODB_URL, {
    useNewUrlParser   : true,
    useCreateIndex    : true,
    useFindAndModify  : true,
    useUnifiedTopology: true
}).then(() => console.log('Database Connected'))
  .catch(error => console.error(error))
