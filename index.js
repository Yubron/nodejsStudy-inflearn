const express = require('express')
const app = express()
const port = 3000
const bodyParser = require('body-parser');
const {User} = require("./models/User");

// applicaion/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: true}));
// applicaion/json
app.use(bodyParser.json());

const config = require('./config/key');

const mongoose = require('mongoose')
mongoose.connect(config.mongoURI, {
    useNewUrlParser: true, useUnifiedTopology:true, useCreateIndex: true, useFindAndModify:false
}).then(() => console.log('MongoDB Connected !'))
.catch(err => console.log(err))

app.get('/', (req, res) => {
  res.send('Hello World testetsteasasasas!')
})

app.post('/register', (req, res) => {
    // insert data when register from client
    
    const user = new User(req.body)
    user.save((err, userInfo) => {
        if(err) return res.json({success : false, err})
        return res.status(200).json({
            success: true
        })
    })
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})