const express = require('express')
const exphbs = require('express-handlebars')
const session = require('express-session')
const FileStore = require('session-file-store')
const flash = require('express-flash')

const app = express() //chamando express

 // impostando handlebars
app.engine('handlebars', exphbs())
app.set('view engine', 'handlebars')

//recebendo body
app.use(
    express.urlencoded({
        extended: true
    })
)

app.use(express.json())

//session middleware
app.use(
    session({
      name: 'session',
      secret: 'nosso_secret',
      resave: false,
      saveUninitialized: false,
      store: new FileStore({
        logFn: function () {},
        path: require('path').join(require('os').tmpdir(), 'sessions'),
      }),
      cookie: {
        secure: false,
        maxAge: 3600000,
        expires: new Date(Date.now() + 3600000),
        httpOnly: true,
      },
    }),
  )

//Flash msg
app.use(flash())

//public
app.use(express.static('public'))

//Session to res
app.use((req, res, next) => {
    if(req.session.userid){
        res.locals.session = req.session
    }
    next()
})

const conn = require('./db/conn') //chamando conn.js

conn
    .sync()
    .then(() =>{
        app.listen(3000)
    })
    .catch((err) => console.log(err))