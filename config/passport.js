//********** Authored by: Alex *********//
//********** Date: September, 2022 *********//
//********** Organization: Cyber Ape Yacht Club *********//

// *** --- passport middleware setup --- 
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const UserSchema = mongoose.model('UserSchema');

// *** --- passport local strategy with email and password --- 
passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
},
    function (email, password, done) {
        UserSchema.findOne({
            email: email
        }, function (err, user) {
            if (err) {
                return done(err);
            }
            if (!user) {
                return done(null, false, {
                    error: 'Incorrect username.'
                });
            }
            if (!user.validPassword(password)) {
                return done(null, false, {
                    error: 'Incorrect password.'
                });
            }
            return done(null, user);
        }).catch(done);
    }
));

// *** --- user serialize for passport support ---
passport.serializeUser(function (user, done) {
    done(null, user.id);
});

// *** --- user deserialize for passport support ---
passport.deserializeUser(function (id, done) {
    User.findById(id, function (err, user) {
        done(err, user);
    });
});