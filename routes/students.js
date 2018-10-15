const express = require('express');
const router = express.Router();
const passport = require('passport');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const moment = require('moment');
const fs = require('fs');
let Student = require('../models/student');
let Payment = require('../models/payment');
let MaleHostel = require('../models/maleHostel');
let FemaleHostel = require('../models/femaleHostel');

let time;

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
        regNo: body.regNo,
        college: body.college,
        department: body.department,
        password: body.password,
        confirmPassword: body.confirmPassword,
        gender: body.gender
    };

    req.checkBody('firstName', 'First Name is required').notEmpty();
    req.checkBody('lastName', 'Last Name is required').notEmpty();
    req.checkBody('regNo', 'Registration number is required').notEmpty();
    req.checkBody('college', 'College is required').notEmpty();
    req.checkBody('department', 'Department is required').notEmpty();
    req.checkBody('email', 'Invalid Email Address').isEmail();
    req.checkBody('password', 'Password is required').notEmpty().isLength({min: 8});
    req.checkBody('confirmPassword', 'Passwords do not match!').equals(newStudent.password);
    req.checkBody('gender', 'Please Select your Gender').notEmpty();

    let errors = req.validationErrors();

    if (errors) {
        res.render('signup', {
            title: 'Sign up',
            style: '/css/signup.css',
            script: '/js/signup.js',
            errors: errors,
            firstName: newStudent.firstName,
            lastName: newStudent.lastName,
            regNo: newStudent.regNo,
            department: newStudent.department,
            college: newStudent.college,
            email: newStudent.email,
            password: newStudent.password,
            confirmPassword: newStudent.confirmPassword,
            gender: newStudent.gender
        });
    } else {
        let student = new Student({
            firstName: newStudent.firstName,
            lastName: newStudent.lastName,
            regNo: newStudent.regNo,
            college: newStudent.college,
            department: newStudent.department,
            email: newStudent.email,
            password: newStudent.password,
            gender: newStudent.gender
        });

        Student.findOne({regNo: student.regNo, email: student.email}, (err, foundStudent) => {
            if (err) {
                return console.log(err);
            }
            if (foundStudent) {
                res.render('signup', {
                    title: 'Student Sign up',
                    style: '/css/signup.css',
                    script: '/js/signup.js',
                    error: 'Student already exists!',
                    firstName: newStudent.firstName,
                    lastName: newStudent.lastName,
                    regNo: newStudent.regNo,
                    college: newStudent.college,
                    department: newStudent.department,
                    email: newStudent.email,
                    studentname: newStudent.studentname,
                    password: newStudent.password,
                    confirmPassword: newStudent.confirmPassword,
                    gender: newStudent.gender
                });
            } else {
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
            res.render('login', {
                title: 'Student Login',
                style: '/css/login.css',
                email: req.body.email,
                password: req.body.password
            });
        } else {
            req.logIn(student, (err) => {
                let id = student._id;
                id = mongoose.Types.ObjectId(id);
                res.redirect(`/students/dashboard/${id}`);
            });
        }
    })(req, res, next);
});

router.get('/dashboard/:id', (req, res) => {
    Student.findOne({_id: req.params.id}, (err, student) => {
        if (err) {
            return console.log(err);
        } else {
            res.render('dashboard', {
                title: `${student.firstName} ${student.lastName} - Dashboard`,
                style: '/css/dashboard.css',
                script: '/js/dashboard.js',
                student,
                id: student._id,
                name: `${student.firstName} ${student.lastName}`
            });
        }
    });
});

router.put('/dashboard/:id', (req, res) => {
    let data = {
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
        department: req.body.department,
        password: req.body.password
    };

    bcrypt.genSalt(10, (err, salt) => {
        if (err) {
            return console.log(err);
        }
        bcrypt.hash(data.password, salt, (err, hash) => {
            if (err) {
                return console.log(err);
            }
            data.password = hash;
            let query = {_id: req.params.id};
            Student.findOneAndUpdate(query, {$set: {
                name: data.name,
                email: data.email,
                phone: data.phone,
                department: data.department,
                password: data.password
            }}, {new: true}, (err, updatedStudent) => {
                if (err) {
                    return console.log(err);
                } else {
                    res.status(200).end();
                }
            });
        });
    });
});

router.get('/bedspace/:id', (req, res) => {
    Student.findOne({_id: req.params.id}, (err, student) => {
        if (err) {
            return console.log(err);
        } else {
            res.render('bedspace', {
                title: 'Bedspace Application',
                style: '/css/bedspace.css',
                script: '/js/bedspace.js',
                id: student._id,
                name: `${student.firstName} ${student.lastName}`,
                phone: student.phone,
                regNo: student.regNo,
                gender: student.gender
            });
        }
    });
});

router.post('/payment/:id', (req, res) => {
    let body = req.body;
    let data = {
        name: body.name,
        phone: body.phone,
        regNo: body.regNo,
        gender: body.gender,
        hostel: body.hostelBlock,
        cardNumber: body.cardNumber,
        expiryDate: body.expiryDate,
        csc: body.csc,
        cardName: body.cardName,
        amount: 41000
    };

    let maleHostel = new MaleHostel({
        hostel: [{
            studentName: data.name,
            blockName: data.hostel,
            regNo: data.regNo
        }]
    });
    let femaleHostel = new FemaleHostel({
        hostel: [{
            studentName: data.name,
            blockName: data.hostel,
            regNo: data.regNo
        }]
    });
    let room;

    if (data.gender === 'male') {
        room = fs.readFileSync('./utils/maleHostel.json', 'utf8');
        room  = JSON.parse(room);
        console.log('data.hostel ' ,data.hostel);
        
        if (data.hostel === 'Goodluck Ebele Jonathan Hostel' && room['Goodluck Ebele Jonathan Hostel'] < 10) {
            maleHostel.hostel[0].blockName = 'Goodluck Ebele Jonathan Hostel';
            room['Goodluck Ebele Jonathan Hostel'] += 1;
            maleHostel.hostel[0].roomNumber = room['Goodluck Ebele Jonathan Hostel'];
            fs.writeFile('./utils/maleHostel.json', JSON.stringify(room), (err) => {
                if (err) {
                    console.log(err);
                }
                console.log('Database File updated sucessfully ', room);
            });
            maleHostel.save((err) => {
                if (err) {
                    return console.log(err);
                } else {
                    Student.findOneAndUpdate({_id: req.params.id}, {$set: {
                        room: `${maleHostel.hostel[0].blockName.toUpperCase()}: Room ${maleHostel.hostel[0].roomNumber}`,
                        amount: data.amount
                    }}, {new: true}, (err, updatedStudent) => {
                        if (err) {
                            return console.log(err);
                        } else {
                            let payment = new Payment({
                                name: `${updatedStudent.firstName} ${updatedStudent.firstName}`,
                                phone: `${updatedStudent.phone}`,
                                regNo: `${updatedStudent.regNo}`,
                                room: `${updatedStudent.room}`,
                                amount: data.amount
                            });
                            payment.save((err) => {
                                if (err) {
                                    return console.log(err);
                                }
                            });
                            req.flash('success', 'Payment Successful.');
                            res.redirect(`/students/receipt/${req.params.id}`);
                        }
                    });
                }
            });
        } else if (data.hostel === 'Post Graduate Hostel' && room['Post Graduate Hostel'] < 10) {
            maleHostel.hostel[0].blockName = 'Post Graduate Hostel';
            room['Post Graduate Hostel'] += 1;
            maleHostel.hostel[0].roomNumber = room['Post Graduate Hostel'];
            fs.writeFile('./utils/maleHostel.json', JSON.stringify(room), (err) => {
                if (err) {
                    console.log(err);
                }
                console.log('Database File updated sucessfully ', room);
            });
            maleHostel.save((err) => {
                if (err) {
                    return console.log(err);
                } else {
                    Student.findOneAndUpdate({_id: req.params.id}, {$set: {
                        room: `${maleHostel.hostel[0].blockName.toUpperCase()}: Room ${maleHostel.hostel[0].roomNumber}`,
                        amount: data.amount
                    }}, {new: true}, (err, updatedStudent) => {
                        if (err) {
                            return console.log(err);
                        } else {
                            let payment = new Payment({
                                name: `${updatedStudent.firstName} ${updatedStudent.firstName}`,
                                phone: `${updatedStudent.phone}`,
                                regNo: `${updatedStudent.regNo}`,
                                room: `${updatedStudent.room}`,
                                amount: data.amount
                            });
                            payment.save((err) => {
                                if (err) {
                                    return console.log(err);
                                }
                            });
                            req.flash('success', 'Payment Successful.');
                            res.redirect(`/students/receipt/${req.params.id}`);
                        }
                    });
                }
            });
        } else if (data.hostel === 'Vet Hostel' && room['Vet Hostel'] < 10) {
            maleHostel.hostel[0].blockName = 'Vet Hostel';
            room['Vet Hostel'] += 1;
            maleHostel.hostel[0].roomNumber = room['Vet Hostel'];
            fs.writeFile('./utils/maleHostel.json', JSON.stringify(room), (err) => {
                if (err) {
                    console.log(err);
                }
                console.log('Database File updated sucessfully ', room);
            });
            maleHostel.save((err) => {
                if (err) {
                    return console.log(err);
                } else {
                    Student.findOneAndUpdate({_id: req.params.id}, {$set: {
                        room: `${maleHostel.hostel[0].blockName.toUpperCase()}: Room ${maleHostel.hostel[0].roomNumber}`,
                        amount: data.amount
                    }}, {new: true}, (err, updatedStudent) => {
                        if (err) {
                            return console.log(err);
                        } else {
                            let payment = new Payment({
                                name: `${updatedStudent.firstName} ${updatedStudent.firstName}`,
                                phone: `${updatedStudent.phone}`,
                                regNo: `${updatedStudent.regNo}`,
                                room: `${updatedStudent.room}`,
                                amount: data.amount
                            });
                            payment.save((err) => {
                                if (err) {
                                    return console.log(err);
                                }
                            });
                            req.flash('success', 'Payment Successful.');
                            res.redirect(`/students/receipt/${req.params.id}`);
                        }
                    });
                }
            });
        } else if (data.hostel === 'Bungalow Hostel' && room['Bungalow Hostel'] < 10) {
            maleHostel.hostel[0].blockName = 'Bungalow Hostel';
            room['Bungalow Hostel'] += 1;
            maleHostel.hostel[0].roomNumber = room['Bungalow Hostel'];
            fs.writeFile('./utils/maleHostel.json', JSON.stringify(room), (err) => {
                if (err) {
                    console.log(err);
                }
                console.log('Database File updated sucessfully ', room);
            });
            maleHostel.save((err) => {
                if (err) {
                    return console.log(err);
                } else {
                    Student.findOneAndUpdate({_id: req.params.id}, {$set: {
                        room: `${maleHostel.hostel[0].blockName.toUpperCase()}: Room ${maleHostel.hostel[0].roomNumber}`,
                        amount: data.amount
                    }}, {new: true}, (err, updatedStudent) => {
                        if (err) {
                            return console.log(err);
                        } else {
                            let payment = new Payment({
                                name: `${updatedStudent.firstName} ${updatedStudent.firstName}`,
                                phone: `${updatedStudent.phone}`,
                                regNo: `${updatedStudent.regNo}`,
                                room: `${updatedStudent.room}`,
                                amount: data.amount
                            });
                            payment.save((err) => {
                                if (err) {
                                    return console.log(err);
                                }
                            });
                            req.flash('success', 'Payment Successful.');
                            res.redirect(`/students/receipt/${req.params.id}`);
                        }
                    });
                }
            });
        } else if (data.hostel === 'IBB' && room['IBB'] < 10) {
            maleHostel.hostel[0].blockName = 'IBB';
            room['IBB'] += 1;
            maleHostel.hostel[0].roomNumber = room['IBB'];
            fs.writeFile('./utils/maleHostel.json', JSON.stringify(room), (err) => {
                if (err) {
                    console.log(err);
                }
                console.log('Database File updated sucessfully ', room);
            });
            maleHostel.save((err) => {
                if (err) {
                    return console.log(err);
                } else {
                    Student.findOneAndUpdate({_id: req.params.id}, {$set: {
                        room: `${maleHostel.hostel[0].blockName.toUpperCase()}: Room ${maleHostel.hostel[0].roomNumber}`,
                        amount: data.amount
                    }}, {new: true}, (err, updatedStudent) => {
                        if (err) {
                            return console.log(err);
                        } else {
                            let payment = new Payment({
                                name: `${updatedStudent.firstName} ${updatedStudent.firstName}`,
                                phone: `${updatedStudent.phone}`,
                                regNo: `${updatedStudent.regNo}`,
                                room: `${updatedStudent.room}`,
                                amount: data.amount
                            });
                            payment.save((err) => {
                                if (err) {
                                    return console.log(err);
                                }
                            });
                            req.flash('success', 'Payment Successful.');
                            res.redirect(`/students/receipt/${req.params.id}`);
                        }
                    });
                }
            });
        } else {
            Student.findOne({_id: req.params.id}, (err, student) => {
                if (err) {
                    return console.log(err);
                } else {
                    return res.render('bedspace', {
                        title: 'Bedspace Application',
                        style: '/css/bedspace.css',
                        script: '/js/bedspace.js',
                        id: student._id,
                        name: `${student.firstName} ${student.lastName}`,
                        phone: student.phone,
                        regNo: student.regNo,
                        gender: student.gender,
                        cardNumber: data.cardNumber,
                        expiryDate: data.expiryDate,
                        csc: data.csc,
                        cardName: data.cardName,
                        noSpace: `${data.hostel.toUpperCase()} is Completely Occupied.`
                    });
                }
            });
        }
    }
    if (data.gender === 'female') {
        room = fs.readFileSync('./utils/femaleHostel.json', 'utf8');
        room  = JSON.parse(room);
        if (data.hostel === 'NDDC Hostel' && room['NDDC Hostel'] < 10) {
            femaleHostel.hostel[0].blockName = 'NDDC Hostel';
            room['NDDC Hostel'] += 1;
            femaleHostel.hostel[0].roomNumber = room['NDDC Hostel'];
            fs.writeFile('./utils/maleHostel.json', JSON.stringify(room), (err) => {
                if (err) {
                    console.log(err);
                }
                console.log('Database File updated sucessfully ', room);
            });
            femaleHostel.save((err) => {
                if (err) {
                    return console.log(err);
                } else {
                    Student.findOneAndUpdate({_id: req.params.id}, {$set: {
                        room: `${femaleHostel.hostel[0].blockName.toUpperCase()}: Room ${femaleHostel.hostel[0].roomNumber}`,
                        amount: data.amount
                    }}, {new: true}, (err, updatedStudent) => {
                        if (err) {
                            return console.log(err);
                        } else {
                            let payment = new Payment({
                                name: `${updatedStudent.firstName} ${updatedStudent.firstName}`,
                                phone: `${updatedStudent.phone}`,
                                regNo: `${updatedStudent.regNo}`,
                                room: `${updatedStudent.room}`,
                                amount: data.amount
                            });
                            payment.save((err) => {
                                if (err) {
                                    return console.log(err);
                                }
                            });
                            req.flash('success', 'Payment Successful.');
                            res.redirect(`/students/receipt/${req.params.id}`);
                        }
                    });
                }
            });        
        } else if (data.hostel === 'NDDC Hostel' && room['NDDC Hostel'] < 10) {
            femaleHostel.hostel[0].blockName = 'NDDC Hostel';
            room['NDDC Hostel'] += 1;
            femaleHostel.hostel[0].roomNumber = room.blockB;
            fs.writeFile('./utils/femaleHostel.json', JSON.stringify(room), (err) => {
                if (err) {
                    console.log(err);
                }
                console.log('Database File updated sucessfully ', room);
            });
            femaleHostel.save((err) => {
                if (err) {
                    return console.log(err);
                } else {
                    Student.findOneAndUpdate({_id: req.params.id}, {$set: {
                        room: `${femaleHostel.hostel[0].blockName.toUpperCase()}: Room ${femaleHostel.hostel[0].roomNumber}`,
                        amount: data.amount
                    }}, {new: true}, (err, updatedStudent) => {
                        if (err) {
                            return console.log(err);
                        } else {
                            let payment = new Payment({
                                name: `${updatedStudent.firstName} ${updatedStudent.firstName}`,
                                phone: `${updatedStudent.phone}`,
                                regNo: `${updatedStudent.regNo}`,
                                room: `${updatedStudent.room}`,
                                amount: data.amount
                            });
                            payment.save((err) => {
                                if (err) {
                                    return console.log(err);
                                }
                            });
                            req.flash('success', 'Payment Successful.');
                            res.redirect(`/students/receipt/${req.params.id}`);
                        }
                    });
                }
            });        
        } else if (data.hostel === 'Goodluck Ebele Jonathan Hostel' && room['Goodluck Ebele Jonathan Hostel'] < 10) {
            femaleHostel.hostel[0].blockName = 'Goodluck Ebele Jonathan Hostel';
            room['Goodluck Ebele Jonathan Hostel'] += 1;
            femaleHostel.hostel[0].roomNumber = room['Goodluck Ebele Jonathan Hostel'];
            fs.writeFile('./utils/femaleHostel.json', JSON.stringify(room), (err) => {
                if (err) {
                    console.log(err);
                }
                console.log('Database File updated sucessfully ', room);
            });
            femaleHostel.save((err) => {
                if (err) {
                    return console.log(err);
                } else {
                    Student.findOneAndUpdate({_id: req.params.id}, {$set: {
                        room: `${femaleHostel.hostel[0].blockName.toUpperCase()}: Room ${femaleHostel.hostel[0].roomNumber}`,
                        amount: data.amount
                    }}, {new: true}, (err, updatedStudent) => {
                        if (err) {
                            return console.log(err);
                        } else {
                            let payment = new Payment({
                                name: `${updatedStudent.firstName} ${updatedStudent.firstName}`,
                                phone: `${updatedStudent.phone}`,
                                regNo: `${updatedStudent.regNo}`,
                                room: `${updatedStudent.room}`,
                                amount: data.amount
                            });
                            payment.save((err) => {
                                if (err) {
                                    return console.log(err);
                                }
                            });
                            req.flash('success', 'Payment Successful.');
                            res.redirect(`/students/receipt/${req.params.id}`);
                        }
                    });
                }
            });        
        } else if (data.hostel === 'Post Graduate Hostel' && room['Post Graduate Hostel'] < 10) {
            femaleHostel.hostel[0].blockName = 'Post Graduate Hostel';
            room['Post Graduate Hostel'] += 1;
            femaleHostel.hostel[0].roomNumber = room['Post Graduate Hostel'];
            fs.writeFile('./utils/femaleHostel.json', JSON.stringify(room), (err) => {
                if (err) {
                    console.log(err);
                }
                console.log('Database File updated sucessfully ', room);
            });
            femaleHostel.save((err) => {
                if (err) {
                    return console.log(err);
                } else {
                    Student.findOneAndUpdate({_id: req.params.id}, {$set: {
                        room: `${femaleHostel.hostel[0].blockName.toUpperCase()}: Room ${femaleHostel.hostel[0].roomNumber}`,
                        amount: data.amount
                    }}, {new: true}, (err, updatedStudent) => {
                        if (err) {
                            return console.log(err);
                        } else {
                            let payment = new Payment({
                                name: `${updatedStudent.firstName} ${updatedStudent.firstName}`,
                                phone: `${updatedStudent.phone}`,
                                regNo: `${updatedStudent.regNo}`,
                                room: `${updatedStudent.room}`,
                                amount: data.amount
                            });
                            payment.save((err) => {
                                if (err) {
                                    return console.log(err);
                                }
                            });
                            req.flash('success', 'Payment Successful.');
                            res.redirect(`/students/receipt/${req.params.id}`);
                        }
                    });
                }
            });        
        } else if (data.hostel === 'Vet Hostel' && room['Vet Hostel'] < 10) {
            femaleHostel.hostel[0].blockName = 'Vet Hostel';
            room['Vet Hostel'] += 1;
            femaleHostel.hostel[0].roomNumber = room['Vet Hostel'];
            fs.writeFile('./utils/femaleHostel.json', JSON.stringify(room), (err) => {
                if (err) {
                    console.log(err);
                }
                console.log('Database File updated sucessfully ', room);
            });
            femaleHostel.save((err) => {
                if (err) {
                    return console.log(err);
                } else {
                    Student.findOneAndUpdate({_id: req.params.id}, {$set: {
                        room: `${femaleHostel.hostel[0].blockName.toUpperCase()}: Room ${femaleHostel.hostel[0].roomNumber}`,
                        amount: data.amount
                    }}, {new: true}, (err, updatedStudent) => {
                        if (err) {
                            return console.log(err);
                        } else {
                            let payment = new Payment({
                                name: `${updatedStudent.firstName} ${updatedStudent.firstName}`,
                                phone: `${updatedStudent.phone}`,
                                regNo: `${updatedStudent.regNo}`,
                                room: `${updatedStudent.room}`,
                                amount: data.amount
                            });
                            payment.save((err) => {
                                if (err) {
                                    return console.log(err);
                                }
                            });
                            req.flash('success', 'Payment Successful.');
                            res.redirect(`/students/receipt/${req.params.id}`);
                        }
                    });
                }
            }); 
        } else if (data.hostel === 'Grace Alele Hostel' && room['Grace Alele Hostel'] < 10) {
            femaleHostel.hostel[0].blockName = 'Grace Alele Hostel';
            room['Grace Alele Hostel'] += 1;
            femaleHostel.hostel[0].roomNumber = room['Grace Alele Hostel'];
            fs.writeFile('./utils/femaleHostel.json', JSON.stringify(room), (err) => {
                if (err) {
                    console.log(err);
                }
                console.log('Database File updated sucessfully ', room);
            });
            femaleHostel.save((err) => {
                if (err) {
                    return console.log(err);
                } else {
                    Student.findOneAndUpdate({_id: req.params.id}, {$set: {
                        room: `${femaleHostel.hostel[0].blockName.toUpperCase()}: Room ${femaleHostel.hostel[0].roomNumber}`,
                        amount: data.amount
                    }}, {new: true}, (err, updatedStudent) => {
                        if (err) {
                            return console.log(err);
                        } else {
                            let payment = new Payment({
                                name: `${updatedStudent.firstName} ${updatedStudent.firstName}`,
                                phone: `${updatedStudent.phone}`,
                                regNo: `${updatedStudent.regNo}`,
                                room: `${updatedStudent.room}`,
                                amount: data.amount
                            });
                            payment.save((err) => {
                                if (err) {
                                    return console.log(err);
                                }
                            });
                            req.flash('success', 'Payment Successful.');
                            res.redirect(`/students/receipt/${req.params.id}`);
                        }
                    });
                }
            });  
        } else {
            Student.findOne({_id: req.params.id}, (err, student) => {
                if (err) {
                    return console.log(err);
                } else {
                    return res.render('bedspace', {
                        title: 'Bedspace Application',
                        style: '/css/bedspace.css',
                        script: '/js/bedspace.js',
                        id: student._id,
                        name: `${student.firstName} ${student.lastName}`,
                        phone: student.phone,
                        regNo: student.regNo,
                        gender: student.gender,
                        cardNumber: data.cardNumber,
                        expiryDate: data.expiryDate,
                        csc: data.csc,
                        cardName: data.cardName,
                        noSpace: `${data.hostel.toUpperCase()} is Completely Occupied.`
                    });
                }
            });
        } 
    }
});

router.get('/receipt/:id', (req, res) => {
    Student.findOne({_id: req.params.id}, (err, student) => {
        if (err) {
            return console.log(err);
        }
        time = moment();
        res.render('receipt', {
            title: 'Payment Receipt',
            student,
            name: `${student.firstName} ${student.lastName}`,
            regNo: student.regNo,
            date: time.format('MMMM Do, YYYY.'),
            phone: student.phone
        });
    });
});

router.get('/logout', (req, res) => {
    req.logOut();
    res.redirect('/');
});

module.exports = router;