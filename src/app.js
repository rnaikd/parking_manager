/**
 * app.js
 *
 * Server file to manage app lifecycle
 *
 * @package    Parking Manager
 * @author     Rahul N
 * @copyright  2020 Rahul
 * @version    0.0.1
 * @since      File available since Release 0.0.0
 */
 // System constants
const express       = require('express')
const port          = process.env.PORT

// Custome constants
const userRouterv1  = require('./routers/userv1')
const slotsRouterv1 = require('./routers/slotsv1')
const logsRouterv1  = require('./routers/logsv1')

// Manage 404 routes
const handleRouter = require('./routers/handle')
require('./db/db')

// Let's create app to serve our purpose
const app = express()

// Introduce app to framework
app.use(express.json())

// Introduce app to Custome functionalities
app.use(userRouterv1)
app.use(slotsRouterv1)
app.use(logsRouterv1)

// Introduce app to  manage routes which are not available
app.use(handleRouter)

// Let's start app on perticular port
app.listen(port, () => {
    console.log(`Server running on port ${port}`)
})
