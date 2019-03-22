const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Regular expression for validating a user email address
const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

// Load required modules
const bcrypt = require('bcrypt');

const UserSchema = new Schema({
  fullName: { 
    type: String, 
    required: true 
  },
  emailAddress: { 
    type: String, 
    required: true,
    unique: true,
    validate: {
      validator: v => emailRegex.test(v),
      message: props => `${props.value} is not a valid email address!`
    }
  },
  password: {
    type: String, 
    required: true
  }
});

// Authenticate the user
UserSchema.statics.authenticate = (email, password, callback) => {
  User.findOne({ emailAddress: email })
    .exec((err, user) => {
      if (err) {
        return callback(err);
      } else if (!user) {
        const err = new Error("No user was found.");
        err.status = 401;
        return callback(err);
      }

      bcrypt.compare(password, user.password, (err, result) => {
        if (result) {
          return callback(null, user);
        } else {
          return callback();
        }
      });
    });
};

UserSchema.pre("save", function(next) {
  bcrypt.hash(this.password, 10, (err, hash) => {
    if (err) {
      return next(err);
    }

    this.password = hash;
    next();  
  });
});

const User = mongoose.model("User", UserSchema);

module.exports = User;