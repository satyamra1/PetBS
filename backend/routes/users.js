const express = require("express")
const auth = require("../middleware/auth")
const User = require("../models/User")

const router = express.Router()

// Get current user profile
router.get("/profile", auth, async (req, res) => {
  try {
    res.json(req.user)
  } catch (error) {
    console.error("Profile error:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// Update user profile
router.put("/profile", auth, async (req, res) => {
  try {
    const { name, phone, address, about } = req.body

    // Update fields
    req.user.name = name || req.user.name
    req.user.phone = phone || req.user.phone
    req.user.address = address || req.user.address
    req.user.about = about || req.user.about

    await req.user.save()

    res.json(req.user)
  } catch (error) {
    console.error("Update profile error:", error)
    res.status(500).json({ message: "Server error" })
  }
})

module.exports = router
