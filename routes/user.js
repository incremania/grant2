const express = require('express')
const router = express.Router()
const multer = require('multer');
const { storage } = require('../cloudinary');
const upload = multer({storage}) // the issue
const uploads = multer({dest: 'uploads/'}) // this one is working and saving upload
const passport = require('passport')
const userJoiValidation = require('../joi/userValidation')
const grantUser = require('../controller/user')



router.get('/register', (req, res) => {
    res.render('grant/register')
})

router.get('/dashboard', (req, res) => {
    res.render('grant/dashboard')
})

router.get('/users', (req, res) => {
    res.render('grant/users')
})





router.post('/register', upload.single('image'), grantUser.register)
router.get('/user/:id', grantUser.getUser)



router.route('/login')
   .get((req, res) => {res.render('grant/login') })
   .post(passport.authenticate('local', {failureFlash: true}), grantUser.login)

router.get('/logout', (req, res) => {
    req.logOut(err => {
        if(err) {
            return err
        } else {
            res.redirect('/login')
        }
    })
})

// const User = require('../models/user')

// router.patch('/image/update/:id', (req, res) => {
//     const { id } = req.params
//     const user = User.findById(id) 
//     const updateImg = User.findByIdAndUpdate(id, ({image:  {url: req.file.path, filename: req.file.filename}}), { new: true, runValidators: true} )

// })



router.get('/user/all/admin', grantUser.userForAdmin)
router.post('/approve/:id', grantUser.approve)

module.exports = router