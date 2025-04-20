const express = require("express")
const multer = require("multer")
const path = require("path")
const fs = require("fs")
const auth = require("../middleware/auth")
const Pet = require("../models/Pet")
const nodemailer = require("nodemailer")

const router = express.Router()

// Set up file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = "uploads/"
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true })
    }
    cb(null, uploadDir)
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname))
  },
})

const upload = multer({ storage })

// Get all pets
router.get("/", auth, async (req, res) => {
  try {
    const pets = await Pet.find().populate("seller", "name email phone address")
    res.json(pets)
  } catch (error) {
    console.error("Get pets error:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// Get pets by current user
router.get("/user", auth, async (req, res) => {
  try {
    const pets = await Pet.find({ seller: req.user._id }).populate("seller", "name email phone address")
    res.json(pets)
  } catch (error) {
    console.error("Get user pets error:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// Get pet by ID
router.get("/:id", auth, async (req, res) => {
  try {
    const pet = await Pet.findById(req.params.id).populate("seller", "name email phone address")

    if (!pet) {
      return res.status(404).json({ message: "Pet not found" })
    }

    res.json(pet)
  } catch (error) {
    console.error("Get pet error:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// Create a new pet listing
router.post("/", auth, upload.single("image"), async (req, res) => {
  try {
    const { name, category, weight, price, about } = req.body

    const pet = new Pet({
      name,
      category,
      weight,
      price,
      about,
      seller: req.user._id,
      image: req.file ? `/uploads/${req.file.filename}` : null,
    })

    await pet.save()

    res.status(201).json(pet)
  } catch (error) {
    console.error("Create pet error:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// Delete a pet listing
router.delete("/:id", auth, async (req, res) => {
  try {
    const pet = await Pet.findById(req.params.id)

    if (!pet) {
      return res.status(404).json({ message: "Pet not found" })
    }

    // Check if user is the seller
    if (pet.seller.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to delete this pet" })
    }

    // Delete image if exists
    if (pet.image) {
      const imagePath = path.join(__dirname, "..", pet.image)
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath)
      }
    }

    await pet.remove()

    res.json({ message: "Pet listing deleted" })
  } catch (error) {
    console.error("Delete pet error:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// Express interest in a pet
router.post("/:id/interest", auth, async (req, res) => {
  try {
    const pet = await Pet.findById(req.params.id).populate("seller", "name email")

    if (!pet) {
      return res.status(404).json({ message: "Pet not found" })
    }

    // Create email transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    })

    // Email content
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: pet.seller.email,
      subject: `Interest in your pet: ${pet.name}`,
      html: `
        <h1>Someone is interested in your pet!</h1>
        <p><strong>Pet:</strong> ${pet.name} (${pet.category})</p>
        <p><strong>Interested Buyer:</strong> ${req.user.name}</p>
        <p><strong>Contact Email:</strong> ${req.user.email}</p>
        <p><strong>Contact Phone:</strong> ${req.user.phone}</p>
        <p><strong>Message:</strong> I am interested in your pet. Please contact me for further discussion.</p>
      `,
    }

    // Send email
    await transporter.sendMail(mailOptions)

    res.json({ message: "Interest sent to seller" })
  } catch (error) {
    console.error("Express interest error:", error)
    res.status(500).json({ message: "Server error" })
  }
})

module.exports = router
