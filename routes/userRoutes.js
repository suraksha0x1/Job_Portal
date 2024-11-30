// const express = require('express');
// const router = express.Router();
// const userControllers = require('../controllers/userController');
// const authMidddleware = require('../middleware/auth');
// const upload = require("../utils/multer");


// router.post('/register',upload.single("validDocument"), userControllers.RegisterUser);
// router.post('/login', userControllers.LoginUser);
// router.get('/logout',authMidddleware,userControllers.logout);
// router.get('/getuser', authMidddleware, userControllers.getUser);
// module.exports = router;
const express = require('express');
const router = express.Router();
const userControllers = require('../controllers/userController');
const authMidddleware = require('../middleware/auth');
const upload = require("../utils/multer");

router.get("/Company/register", (req, res) => {
    res.render("register", { role: "Company" });
  });
  
  router.get("/candidates/register", (req, res) => {
    res.render("register", { role: "candidates" });
  });

  router.get("/admin/register", (req, res) => {
    res.render("register", { role: "admin" });
  });

router.get("/login", (req, res) => {
    res.render("login");
  });

router.get("/dashboard", authMidddleware, (req, res) => {
    res.render("dashboard", { role: req.user.role });
  });

  router.get("/chooseRole", (req, res) => {
    res.render("index");
  });


router.post('/api/user/register', upload.single("validDocument"), userControllers.RegisterUser);

router.post('/api/user/login', userControllers.LoginUser);
router.get('/logout', authMidddleware, userControllers.logout);
router.get('/getuser', authMidddleware, userControllers.getUser);




module.exports = router;
