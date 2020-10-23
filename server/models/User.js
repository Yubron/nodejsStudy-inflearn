const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10;
var jwt = require('jsonwebtoken');

const userSchema = mongoose.Schema({
    name: {
        type : String,
        maxlength : 50
    },
    email: {
        type : String,
        trim : true,
        unique : 1
    },
    password: {
        type : String,
        minlength : 5
    },
    lastname: {
        type : String,
        maxlength : 50
    },
    role: {
        type : Number,
        default : 0
    },
    image: String,

    token: {
        type : String
    },
    tokenExp: {
        type : Number
    }
});

userSchema.pre('save',function(next) {
    // password encryption

    var user = this;
    if(user.isModified('password')) {
        bcrypt.genSalt(saltRounds, function(err, salt) {
            if(err) return next(err);
            bcrypt.hash(user.password, salt, function(err, hash) {
                if(err) return next(err);
                user.password = hash;
                next();
            });
        });
    } else {
        next();
    }

});

userSchema.methods.comparePassword = function (plainPassword, cb) {
    // plainPassword : 123456    dbPassword : qoinweisandzi (Example)
    bcrypt.compare(plainPassword, this.password, function(err, isMatch) {
        if(err) return cb(err);
        cb(null, isMatch);
    });
};

userSchema.methods.generateToken = function (cb) {
    // generate token using jsonwebtoken
    var user = this;
    
    var token = jwt.sign(user._id.toHexString(),'secretToken');

    user.token = token;

    user.save(function(err, user) {
        if(err) return cb(err);

        cb(null,user);
    });
};

userSchema.statics.findByToken = function (token, cb) {
    var user = this;
    
    // decode token
    jwt.verify(token, 'secretToken', function(err, decoded) {
        // check token from clinet and database using userId
        user.findOne({"_id":decoded, "token":token}, function(err, user) {
            if(err) return cb(err);
            cb(null, user);
        });
    });

};
const User = mongoose.model('User',userSchema)

module.exports = { User }