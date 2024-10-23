const express = require('express');
const router = express.Router()
const User = require('../model/userModel');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET_KEY

router.post('/admin', async (req, res) => {
   const { username, password } = req.body;
   try {
      const admin = await User.findOne({ username })
      if (!admin) {
         res.status(404).json({ message: 'admin not found!' })
      }
      if (admin.password !== password) {
         res.status(401).json({ message: 'Invalid password!' })
      }
      const token = jwt.sign(
         {
            id: admin._id,
            username: admin.username,
            role: admin.role
         },
         JWT_SECRET,
         { expiresIn: "1h" }
      );
      return res.status(200).json({
         message: "Authentication successful",
         token: token,
         user: {
            username: admin.username,
            role: admin.role
         }
      })
   } catch (error) {
      console.log("Failed to login as admin", error);
      res.status(401).json({ message: "Failed to login as admin!" });
   }
})


module.exports = router;