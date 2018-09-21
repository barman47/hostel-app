const express = require('express');
const router = express.Router();
const passport = require('passport');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
let Student = require('../models/student');
let MaleStudent = require('../models/maleStudent');
let FemaleStudent = require('../models/femaleStudent');

router.get('/register', (req, res) => {
    res.render('signup', {
        title: 'Student Signup',
        style: '/css/signup.css',
        script: '/js/signup.js'
    });
});

router.post('/register', (req, res) => {
    const body = req.body;
    const newStudent = {
        firstName: body.firstName,
        lastName: body.lastName,
        email: body.email,
        password: body.password,
        confirmPassword: body.confirmPassword,
        gender: body.gender
    };

    req.checkBody('firstName', 'First Name is required').notEmpty();
    req.checkBody('lastName', 'Last Name is required').notEmpty();
    req.checkBody('email', 'Invalid Email Address').isEmail();
    req.checkBody('password', 'Password is required').notEmpty().isLength({min: 8});
    req.checkBody('confirmPassword', 'Passwords do not match!').equals(newStudent.password);
    req.checkBody('gender', 'Please Select your Gender').notEmpty();

    let errors = req.validationErrors();

    if (errors) {
        res.render('register', {
            title: 'Sign up',
            style: '/css/index.css',
            errors: errors,
            firstName: newStudent.firstName,
            lastName: newStudent.lastName,
            email: newStudent.email,
            password: newStudent.password,
            confirmPassword: newStudent.confirmPassword,
            gender: newStudent.gender
        });
    } else {
        let student = new Student({
            firstName: newStudent.firstName,
            lastName: newStudent.lastName,
            email: newStudent.email,
            password: newStudent.password,
            gender: newStudent.gender
        });

        Student.findOne({email: student.email}, (err, foundStudent) => {
            if (err) {
                return console.log(err);
            }
            if (foundStudent) {
                res.render('register', {
                    title: 'Sign up',
                    style: '/css/index.css',
                    error: 'Studentname already taken',
                    name: newStudent.name,
                    email: newStudent.email,
                    studentname: newStudent.studentname,
                    password: newStudent.password,
                    confirmPassword: newStudent.confirmPassword,
                    gender: newStudent.gender
                });
            } else{
                bcrypt.genSalt(10, (err, salt) => {
                    if (err) {
                        return console.log(err);
                    }
                    bcrypt.hash(student.password, salt, (err, hash) => {
                        if (err) {
                            return console.log(err);
                        }
                        student.password = hash;
                        student.save((err) => {
                            if (err) {
                                return console.log(err);
                            } else {
                                req.flash('success', 'Registration Successful. You now now proceed to log in.');
                                res.redirect('/');
                            }
                        });
                    });
                });
            }
        });
    }
});

router.get('/login', (req, res) => {
    res.render('login', {
        title: 'Student Login',
        style: '/css/login.css'
    });
});

router.post('/login', (req, res, next) => {
    passport.authenticate('local', (err, student, info) => {
        if (err) {
            return next(err);
        }
        if (!student) {
            req.flash('failure', 'Incorrect Email or Password.');
            res.send('Incorrect Email or password');
            // res.render('login', {
            //     title: 'Student Login',
            //     style: '/css/login.css',
            //     email: req.body.email,
            //     password: req.body.password
            // });
        } else {
            req.logIn(student, (err) => {
                let id = student._id;
                id = mongoose.Types.ObjectId(id); 
                res.send('You are logged in');
                // res.redirect(`/students/dashboard/${id}`);
            });
        }
    })(req, res, next);
});

module.exports = router;