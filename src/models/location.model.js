import mongoose, {Schema} from "mongoose";


const mongoose = require('mongoose');

// Define the schema for the location
const locationSchema = new mongoose.Schema({

address: {
    type: String,
    required: true
},

});


const Location = mongoose.model('Location', locationSchema);

module.exports = Location;
