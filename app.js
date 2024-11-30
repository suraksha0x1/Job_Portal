const express = require('express');
const app = express();
const port  = process.env.PORT|| 3000;
const path = require("path")
// const jwt = require('jsonwebtoken');
// const cloudinary = require('cloudinary').v2; // for storing the media
const upload = require("./utils/multer");
const bodyParser = require('body-parser');

const db = require('./middleware/config/db.js');

// const cors = require('cors');
const cookieParser = require('cookie-parser');
const userRoutes = require('./routes/userRoutes');
const jobRoutes = require('./routes/jobRoutes');
const applicationRoutes = require('./routes/applicationRoutes');
// const {RegisterUser, LoginUser} = require('./controllers/userController')
// const errorMiddleware = require('./middleware/error');
// const auth = require("./middleware/auth");
// app.get('/',(req,res)=>{
//   res.render('welcomepage');
// })
// app.get('/login',(req,res)=>{
//   res.render('login');
// })
// app.get('/register',(req,res)=>{
//   res.render('register');
// })
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
// app.use('/userRoutes', userRoutes);
// okieparser is required for providing authorization ....
app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.json());
app.use(express.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname,'public')))
// app.use('/jobRoutes',jobRoutes);



  // connecting with front end


app.use(userRoutes);

app.use('/',userRoutes);
app.use('/',jobRoutes);
app.use('/',applicationRoutes);

// app.use(errorMiddleware);

app.get("/", (req,res)=>{
res.render("login");
});

const start = async () =>{
    await db.connect();
    app.listen(port,() =>{
      console.log(`Server is running on port  http://localhost:${port}`);
    });
}

start();


// app.js
// const express = require('express');
// const dotenv = require('dotenv');
// const path = require('path');
// const app = express();
// const cookieParser = require('cookie-parser');
// dotenv.config();

// // Set EJS as the view engine
// app.set('view engine', 'ejs');

// // Middleware to parse URL-encoded form data (for form submissions)
// app.use(express.urlencoded({ extended: true }));
// app.use(express.json());

// // Serve static files from the 'public' folder
// app.use(express.static(path.join(__dirname, 'public')));
// app.use(cookieParser());
// // Import routes and controllers
// const  userRoutes= require('./routes/userRoutes'); // For handling registration and login
// const userController = require('./controllers/userController'); // Contains registration and login logic
// // const employerRoutes = require('./routes/employer'); // For handling employer actions
// // const companyRoutes = require('./routes/company'); // For handling company actions
// // const jobRoutes = require('./routes/jobs'); // For handling job actions
// const candidates = require('./routes/candidates'); // For handling jobseeker actions
// app.get('/', (req, res) => {
//   res.render('welcomepage');
// });
// // Routes to render registration and login forms
// app.get('/register', (req, res) => {
//   res.render('register'); // Renders the register.ejs form
// });

// app.get('/login', (req, res) => {
//   res.render('login'); // Renders the login.ejs form
// });
// app.get('/logout', userController.logout);

// //using routes
// app.use('/userRoutes', userRoutes); // Routes for handling auth actions (register and login)
// // app.use('/employer', employerRoutes); // Routes for handling employer actions
// // app.use('/company', companyRoutes); // Routes for handling company actions
// // app.use('/employer', employerRoutes); // Routes for handling employer actions
// // app.use('/', jobRoutes); // Routes for handling job actions
// app.use('/', candidates); // Routes for handling jobseeker actions


// // Start the server
// const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => {
//   console.log(`Server is running on http://localhost:${PORT}`);
// });