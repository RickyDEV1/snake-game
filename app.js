


// aqui invocamos el expresss
const express = require('express');
const app = express();

// esto es para capturar los datos del formulario 
app.use(express.urlencoded({extended:false}));
app.use(express.json()); // y le decimos a express que vamos a usar json

// aqui importamos el dotenv
const dotenv = require('dotenv');
dotenv.config({path:'./env/.env'});

// aqui seteamos el directorio de assets
app.use('/resources', express.static('public'));
app.use('/resources', express.static(__dirname + '/public'));

// establecemos el motor de plantilla ejs
app.set('view engine', 'ejs');

// aqui llamamos al bcryptjs para encriptar la contraseña
const bcriptjs = require('bcryptjs');

// aqui se crea la variable del session
const session = require('express-session');
app.use(session({
    secret:'secret',
    resave: true,
    saveUninitialized: true
}))

// aqui hacemos el llamado del modulo de la conexion de la BD
const connection = require('./database/db');
const { reset } = require('nodemon');
const res = require('express/lib/response');

// aqui se renderiza la ruta raiz
app.get('/', (req, res) => {
    res.render("index copy");
})

//aqui se renderiza la ruta login
app.get('/login', (req, res) => {
    res.render("login");
})

// aqui se renderiza la ruta leaderboard
app.get('/leaderboard', (req, res) => {
    res.render("leaderboard");
})

// aqui se renderiza el index en la ruta snake game
app.get('/snake-game', (req, res) => {
    res.render("index");
})

// aqui se renderiza la ruta register
app.get('/register', (req, res) => {
    res.render("register");
})

// metodo para la registracion
app.post('/register', async (req, res) =>{
    const user = req.body.user;
    const pass = req.body.password;
    let passwordHaash = await bcriptjs.hash(pass, 8);
    connection.query('INSERT INTO users SET ?', {user:user, pass:passwordHaash}, async(error, results)=>{
        if(error) {
            console.log(error);
        } else {
            res.render('register', {
                alert: true,
                alertTitle:'Registration',
                alertMessage: 'Succesful Registration!',
                alertIcon: 'success',
                showConfirmButtom: false,
                timer: '',
                ruta: ''
            });
        }
    });
})

// metodo para la autenticacion de usuario
app.post('/login', async (req, res) => {
    const user = req.body.user;
    const pass = req.body.password;
    let passwordHash = await bcriptjs.hash(pass, 8);
    connection.query('SELECT * FROM users WHERE user = ?', [user], async (error, results) => {
        if(results.length == 0 || !(await bcriptjs.compare(pass, results[0].pass))) {
            res.render('login', {
                alert: true,
                alertTitle: 'Error',
                alertMessage: 'Usuario y/o contraseña incorrectas',
                alertIcon: 'error',
                showConfirmButtom: true,
                timer: '',
                ruta: 'login'
            });
        } else {
            // aqui se crea una variable de sesion y le asignamos true si el usuario inicio sesion
            req.session.loggedid = true;
            req.session.name = results[0].name
            res.render('index', {
                alert: true,
                alertTitle: 'Iniciando sesión...',
                alertMessage: '',
                alertIcon: 'success',
                showConfirmButtom: false,
                timer: 2000,
                ruta: ''
            });
        }
    })
})

// metodo para controlar la autenticacion en todas las paginas
app.get('/', (req, res) => {
    if(req.session.loggedid) {
        res.render('index', {
            login: true,
            name: req.session.name
        })
    } else {
        res.render('index', {
            login: false,
            name: ''
        })
    }
})

// metodo para limpiar el cache luego del logout
app.get('/logout', (req, res) => {
    req.session.destroy(() => {
        res.redirect('/')
    })
})

app.listen(3000, (req, res) => {
    console.log('SERVER RUNNING IN http://localhost:3000');
})