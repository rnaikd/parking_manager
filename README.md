# Parking Manager

This project manages parking slots.

## Problem Statement

The office basement has a parking lot of 120 car parking space capacity out of which 20% is reserved for differently-abled and pregnant women
since its closest to the lift.
Reserving a parking space has become a tedious job and consumes a good amount of time, hence management has decided to
automate it based on a first come first serve basis with the following features.

## Requirements
1. Users can book a parking space 15 mins prior to arrival, in which he will get a parking number.
2. If the user fails to reach in 30 mins then the allotted space again goes for rebooking (15 mins extra wait time).
3. If Reserved space is occupied completely then the reserved users will be allotted general parking space.
4. If 50% capacity is utilized, then 15 mins extra wait time will be eliminated (for both reserved and general).
5. If there is a clash for the general use and reserved for a general parking spot than the reserved user will be a priority.

## Prerequisites
1. Node server - https://nodejs.org/en/download/
2. yarn - https://classic.yarnpkg.com/en/docs/install
3. npm (normally npm gets installed with nodejs) - https://www.npmjs.com/get-npm 

## Installation Steps
1. Clone project 
```
git clone https://github.com/rnaikd/parking_manager.git
```
2. Change directory to project
```
cd parking_manager
```
3. Start server
```
yarn start
```

Once server is up and running terminal/command prompt will show
```
Server running on port 3000
```

This application has no views, it serves only APIs

For APIs, use below postman collections:

[![Run in Postman](https://run.pstmn.io/button.svg)](https://app.getpostman.com/run-collection/125c685aa850b540163f)

### OR 

Collection link
https://www.getpostman.com/collections/125c685aa850b540163f

## Database
This application uses mongodb for storing data. As this is very small application, structure is simple.

There are 3 collections:
1. [Users](https://github.com/rnaikd/parking_manager/blob/master/src/models/User.js) - Store user information.
2. [Slots](https://github.com/rnaikd/parking_manager/blob/master/src/models/Slots.js) - Store parking slots with configurations.
3. [Logs](https://github.com/rnaikd/parking_manager/blob/master/src/models/Log.js) - Stores user activities.

## Code Structure
