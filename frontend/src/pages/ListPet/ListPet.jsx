"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import api from "../../services/api"
import "./ListPet.css"

const ListPet = () => {
  const [formData, setFormData] = useState({
    name: "",
    category: "dog",
    weight: "",
    price: "",
    about: "",
    image: null,
  })

  const [preview, setPreview] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const navigate = useNavigate()

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }))
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]

    if (file) {
      setFormData((prevState) => ({
        ...prevState,
        image: file,
      }))

      // Create preview URL
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreview(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      // Create form data for file upload
      const petData = new FormData()
      petData.append("name", formData.name)
      petData.append("category", formData.category)
      petData.append("weight", formData.weight)
      petData.append("price", formData.price)
      petData.append("about", formData.about)

      if (formData.image) {
        petData.append("image", formData.image)
      }

      const response = await api.post("/pets", petData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })

      navigate(`/pet/${response.data._id}`)
    } catch (err) {
      console.error("Error creating pet listing:", err)
      setError(err.response?.data?.message || "Failed to create pet listing. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="list-pet-container">
      <div className="list-pet-card">
        <div className="list-pet-header">
          <h1>List Your Pet</h1>
          <p>Fill out the form below to list your pet for sale</p>
        </div>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit} className="list-pet-form">
          <div className="form-group">
            <label htmlFor="name">Pet Name</label>
            <input
              type="text"
              id="name"
              name="name"
              className="form-control"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="category">Category</label>
              <select
                id="category"
                name="category"
                className="form-control"
                value={formData.category}
                onChange={handleChange}
                required
              >
                <option value="dog">Dog</option>
                <option value="cat">Cat</option>
                <option value="bird">Bird</option>
                <option value="fish">Fish</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="weight">Weight (kg)</label>
              <input
                type="number"
                id="weight"
                name="weight"
                className="form-control"
                value={formData.weight}
                onChange={handleChange}
                min="0.1"
                step="0.1"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="price">Price ($)</label>
              <input
                type="number"
                id="price"
                name="price"
                className="form-control"
                value={formData.price}
                onChange={handleChange}
                min="1"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="about">About the Pet</label>
            <textarea
              id="about"
              name="about"
              className="form-control"
              value={formData.about}
              onChange={handleChange}
              rows="5"
              required
            ></textarea>
          </div>

          <div className="form-group">
            <label htmlFor="image">Pet Image</label>
            <div className="image-upload-container">
              <input
                type="file"
                id="image"
                name="image"
                className="image-upload-input"
                accept="image/*"
                onChange={handleImageChange}
              />
              <label htmlFor="image" className="image-upload-label">
                {preview ? "Change Image" : "Choose Image"}
              </label>

              {preview && (
                <div className="image-preview-container">
                  <img src={preview || "/placeholder.svg"} alt="Preview" className="image-preview" />
                </div>
              )}
            </div>
          </div>

          <div className="form-actions">
            <button type="button" onClick={() => navigate("/dashboard")} className="btn btn-secondary">
              Cancel
            </button>

            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? "Creating Listing..." : "Create Listing"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ListPet
