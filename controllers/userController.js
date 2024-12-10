const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
// const sendToken = require("../utils/jwtToken")
require("dotenv").config();




const RegisterUser = async (req, res) => {
    const { name, password, email, role, contactInfo, companyName, address } = req.body;

    try {
        // Check if email already exists
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ error: "Email already exists" });
        }

        // Validate required fields
        if (!name || !email || !password || !role) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        // Hashing password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Initialize user payload
        let userPayload = {
            name,
            email,
            password: hashedPassword,
            role,
        };

        // Customize payload based on role
        if (role === 'candidates') {
            if (!req.file?.path) {
                return res.status(400).json({ error: "Valid document is required for candidates" });
            }
            userPayload = {
                ...userPayload,
                validDocument: req.file.path,
                contactInfo,
                companyName: null,
                address: null,
            };
        } else if (role === 'Company') {
            if (!companyName || !address) {
                return res.status(400).json({ error: "Company name and address are required for companies" });
            }
            userPayload = {
                ...userPayload,
                companyName,
                address,
                contactInfo,
                validDocument: req.file?.path || null,
            };
        } else if (role === 'admin') {
            userPayload = {
                ...userPayload,
                companyName: null,
                address: null,
                contactInfo: null,
                validDocument: null,
            };
        } else {
            return res.status(400).json({ error: "Invalid role" });
        }

        // Create new user
        const user = await User.create(userPayload);

        // Render success page or send response
        res.status(201).render("login", { message: "Registration successful. Please log in" });

    } catch (error) {
        console.error("Error registering user:", error);
        res.status(500).json({ error: "An error occurred during registration" });
    }
};



// const LoginUser = async (req, res) => {
    
//     const { email, password } = req.body;
//     console.log("controller is triggered"); // Destructure request body
//     // console(req.body);
//     if (!email || !password) {
//         return res.status(400).json({ error: "Email and password are required" });
//     }

//     try {
//         // Find user by email
//         const user = await User.findOne({ where: { email } });
//         console.log(user)
//         if (!user) {
//             return res.status(400).json({ error: "Invalid email or password" });
//         }

//         // Compare passwords
//         const isValidPassword = await bcrypt.compare(password, user.password);
//         if (!isValidPassword) {
//             return res.status(400).json({ error: "Invalid email or password" });
//         }

        
        // const token = jwt.sign(
        //     { id: user.id, name: user.name, email: user.email, role: user.role },
        //     process.env.JWT_SECRET_KEY,
        //     { expiresIn: "1h" }
        // );
// console.log(token);
//         const options = {
//             expires:new Date(
//                 Date.now() + process.env.COOKIE_EXPIRE *24*60*60*1000
//             ), // 1 hour expiration
//             // httpOnly: true, // Accessible only by the web server
//             // secure: process.env.NODE_ENV === 'production', // Set to true if using HTTPS in production
//             // sameSite: 'Strict', // Helps prevent CSRF attacks
//         };

//         // Store the token in a cookie
//         res.cookie("token", token, options);
       
//         return res.redirect('/login'); 

//     } catch (error) {
//         // Handle any other errors
//         return res.status(500).json({ error: "An error occurred during login" });
//     }
// };

 const LoginUser = async (req, res) => {
    try {
      const { email, password } = req.body;
  
      // Check if the user exists
      const user = await User.findOne({ where: { email } });
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
  
      // Check if the password is correct
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: "Incorrect password" });
      }
  
      // Generate JWT token
    //   const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, {
    //     expiresIn: '1h',
    //   });
    const token = jwt.sign(
        { id: user.id, name: user.name, email: user.email, role: user.role },
        process.env.JWT_SECRET_KEY,
        { expiresIn: "1h" }
    );
  
      // Set token as an HTTP-only cookie
      res.cookie('token', token, { httpOnly: true, maxAge: 60 * 60 * 1000 }); // Expires in 1 hour
      res.redirect('/dashboard');
      // Redirect based on user role
    //   if (user.role === 'Company') {
    //     res.redirect("/employer/dashboard");
      
    //   } else if (user.role === 'Admin') {
    //     res.redirect("/admin/dashboard");
    //   } else {
    //     res.redirect("/candidates/dashboard");
    //   }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error" });
    }
  };



  const logout = async (req, res) => {
    try {
        // Clear the token cookie securely
        res.clearCookie("token", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production", // Use secure cookies in production
            sameSite: "strict", // Prevent CSRF attacks
        });

        // Redirect the user to the homepage
        res.redirect('/login');
    } catch (error) {
        console.error("Error during logout:", error.message);

        // Handle unexpected errors gracefully
        res.status(500).json({
            success: false,
            message: "An error occurred during logout. Please try again.",
        });
    }
};




const getUser = async (req, res) => {
    const user = req.user;
    if (!user) {
        return res.status(404).json({
            success: false,
            message: 'User not found',
        });
    }
    res.status(200).json({
        success: true,
        user,
    });
};

module.exports = {
    RegisterUser,
    LoginUser,
    logout,
    getUser,

};

