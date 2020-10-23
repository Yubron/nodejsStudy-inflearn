const express = require('express')
//let cors = require('cors');
//let cors_origin = ['http://localhost:3000'];
const app = express()
const port = 5000
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const config = require('./config/key');
const { auth } = require("./middleware/auth")
const { User } = require("./models/User");


// applicaion/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: true}));
// applicaion/json
app.use(bodyParser.json());
app.use(cookieParser());
/* app.use(cors({
//     origin: cors_origin,
//     credentials: true,
 }))*/

const mongoose = require('mongoose')


mongoose.connect(config.mongoURI, {
    useNewUrlParser: true, useUnifiedTopology:true, useCreateIndex: true, useFindAndModify:false
}).then(() => console.log('MongoDB Connected !'))
.catch(err => console.log(err))

app.get('/', (req, res) => {
  res.send('Hello World testetsteasasasas!')
});

app.get('/api/hello', (req, res) => {
    res.send("hi");
});

app.post('/api/users/register', (req, res) => {
    // insert data when register from client
    
    const user = new User(req.body)
    user.save((err, user) => {
        if(err) return res.json({success : false, err})
        return res.status(200).json({
            success: true
        })
    })
})

app.post('/api/users/login', (req, res) => {
    // search email from database
    User.findOne({email: req.body.email}, (err, user) => {
        if(!user) {
            return res.json({ 
                loginSuccess:false,
                message : "유저가 존재하지 않습니다."
            })
        }
    

        // validate password
        user.comparePassword(req.body.password, (err, isMatch) => {
            if(!isMatch)
            return res.json({
                loginSuccess:false, 
                message :"비밀번호가 틀렸습니다."
            })
        })

        // generate token
        user.generateToken((err, user) => {
            if(err) return res.status(400).send(err);
            
            // save token into cookies
            res.cookie("x_auth", user.token)
            .status(200)
            .json({
                loginSuccess:true,
                userId:user._id
            })
        })
    })
})

app.get('/api/users/auth', auth , (req, res) => {
    res.status(200).json({
        _id : req.user._id,
        isAdmin : req.user.role === 0 ? false : true,
        isAuth : true,
        email : req.user.email,
        name : req.user.name,
        lastname : req.user.lastname,
        role : req.user.role,
        image : req.user.image
    });
});

app.get('/api/users/logout', auth, (req, res) => {
    User.findOneAndUpdate({_id : req.user._id}, 
        {token : ""}
        , (err, user) => {
            if(err) return res.json({success:false, err})
            return res.status(200).send({
                success:true
            });
        });
});


app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})