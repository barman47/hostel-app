const LocalStrategy = require('passport-local').Strategy;
const Student = require('../models/student');
const bcrypt = require('bcryptjs');

module.exports = (passport) => {
    passport.use(new LocalStrategy({
        usernameField: "email",
        passwordField: "password",
        passReqToCallback: true
    }, function verifyCallback(req, email, password, done) {
            Student.findOne({ email: email }, function(err, student) {
            if (err) return done(err);
            if (!student) {
                return done(null, false, {msg: 'No Student found'});
            }
            bcrypt.compare(password, student.password, (err, isMatch) => {
                if (err) return done(err);
                if (!isMatch) {
                    return done(null, false, {msg: 'Incorrect Password'})
                } else {
                    return done(null, student);
                }
            });
        });
    }));

    passport.serializeUser((student, done) => {
        done(null, student._id);
    });

    passport.deserializeUser((id, done) => {
        Student.findById(id, (err, student) => {
            done(err, student);
        });
    });
};