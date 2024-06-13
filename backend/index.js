const connectToDatabase = require('./db');

// connect to database 
connectToDatabase();



// express server 
const express = require('express')
const app = express()
const port = 5000


app.use(express.json())

// routes 
app.use('/api/auth', require('./routes/auth'))
app.use('/api/projects', require('./routes/projects'))



app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

