const mongoose = require('mongoose');
const mongoURI = "mongodb://localhost:27017/canvasconnect"


// shows that database is connect 
mongoose.connection.on('connected', () => console.log('connected to database'));

// shows that database is disconnected 
mongoose.connection.on('disconnected', () => console.log('disconnected'));

const connect = () => {
    mongoose.connect(mongoURI)
}


module.exports = connect; 