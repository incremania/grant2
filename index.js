if(process.env.NODE_ENV !== 'production'){
    require('dotenv').config()
}

const express = require('express');
const app = express();
const path = require('path');
const session = require('express-session');
const flash = require('connect-flash');
const ejsMate = require('ejs-mate')
const methodOverride = require('method-override')
const userRoute = require('./routes/user');
const facebookRoute = require('./routes/facebook');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const passport = require('passport');
const localStragedy = require('passport-local');
const User = require('./models/user');
const helmet = require('helmet');
const MongoStore = require('connect-mongo')


app.use(express.urlencoded({extended: true}))
const cors = require('cors');
app.use(cors());

// app.use((req, res, next) => {
//     res.header('Access-Control-Allow-Origin', '*');
//     res.header('Access-Control-Allow-Headers', 'x-www-form-urlencoded, Origin, X-Requested-With, Content-Type, Accept, Authorization, *');
//     if (req.method === 'OPTIONS'){
//         res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, PATCH, DELETE, OPTIONS');
//         res.setHeader('Access-Control-Allow-Credentials', true);
//         return res.status(200).json({});
//     }
//     next();
// });




const dbUrl = process.env.DB || 'mongodb://localhost:27017/grantpro'
mongoose.set('strictQuery', true)
mongoose.connect(dbUrl, {
    useNewUrlParser: true, 
    useUnifiedTopology:true,
    family: 4,
    
})
.then(() => console.log('connected'))

app.engine('ejs', ejsMate)
app.set('view engine', 'ejs' )
app.set('views', path.join(__dirname, 'views'))
app.use(methodOverride('_method'))
app.use(express.urlencoded({extended: true}))
app.use(express.static(path.join(__dirname, 'public')))
app.use(express.json())
app.use(cookieParser())
app.use(helmet())



const sessionConfig = {
    store: MongoStore.create({ mongoUrl: dbUrl, touchAfter: 24 * 60 * 60 , secret: process.env.SECRET}),
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        secure: true,
        name: 'grant',
        expires: Date.now() + 500 + 500 * 60 * 60 * 24 * 7,
        maxAge: 500 + 500 * 360 * 24 * 7
    }
}

app.use(flash())
app.use(session(sessionConfig))

app.use((req, res, next) => {
    res.locals.success = req.flash('success'),
    res.locals.error  = req.flash('error');
    next()
})


app.use(passport.initialize())
app.use(passport.session())
passport.use(new localStragedy(User.authenticate()));
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())



app.use('/', userRoute)
app.use('/facebook', facebookRoute)


const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
    console.log('port 3000')
})
