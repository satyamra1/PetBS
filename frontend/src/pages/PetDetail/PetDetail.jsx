"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useAuth } from "../../context/AuthContext"
import api from "../../services/api"
import "./PetDetail.css"

const PetDetail = () => {
  const { id } = useParams()
  const { currentUser } = useAuth()
  const navigate = useNavigate()

  const [pet, setPet] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [sendingInterest, setSendingInterest] = useState(false)
  const [interestSent, setInterestSent] = useState(false)

  useEffect(() => {
    fetchPetDetails()
  }, [id])

  const fetchPetDetails = async () => {
    try {
      const response = await api.get(`/pets/${id}`)
      setPet(response.data)
      setLoading(false)
    } catch (err) {
      console.error("Error fetching pet details:", err)
      setError("Failed to load pet details. Please try again later.")
      setLoading(false)
    }
  }

  const handleShowInterest = async () => {
    setSendingInterest(true)

    try {
      await api.post(`/pets/${id}/interest`)
      setInterestSent(true)
    } catch (err) {
      console.error("Error sending interest:", err)
      setError("Failed to send interest. Please try again.")
    } finally {
      setSendingInterest(false)
    }
  }

  const handleDeletePet = async () => {
    if (!window.confirm("Are you sure you want to delete this pet listing?")) {
      return
    }

    try {
      await api.delete(`/pets/${id}`)
      navigate("/dashboard")
    } catch (err) {
      console.error("Error deleting pet:", err)
      setError("Failed to delete pet. Please try again.")
    }
  }

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading pet details...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="error-container">
        <p>{error}</p>
        <button onClick={fetchPetDetails} className="btn btn-primary">
          Try Again
        </button>
      </div>
    )
  }

  if (!pet) {
    return (
      <div className="not-found-container">
        <h2>Pet Not Found</h2>
        <p>The pet you're looking for doesn't exist or has been removed.</p>
        <button onClick={() => navigate("/dashboard")} className="btn btn-primary">
          Back to Dashboard
        </button>
      </div>
    )
  }

  const isOwner = currentUser && pet.seller && pet.seller._id === currentUser._id

  const imageSrc = pet.image ? `http://localhost:5000${pet.image}` : "https://via.placeholder.com/600x400?text=Pet+Image"

  return (
    <div className="pet-detail-container">
      <div className="pet-detail-card">
        <div className="pet-detail-image-container">
          <img
            src={imageSrc}
            alt={pet.name}
            className="pet-detail-image"
          />
          <div className="pet-detail-category">{pet.category}</div>
        </div>

        <div className="pet-detail-content">
          <div className="pet-detail-header">
            <h1 className="pet-detail-name">{pet.name}</h1>
            <div className="pet-detail-price">${pet.price}</div>
          </div>

          <div className="pet-detail-info">
            <div className="pet-detail-info-item">
              <span className="info-label">Category:</span>
              <span className="info-value">{pet.category}</span>
            </div>

            <div className="pet-detail-info-item">
              <span className="info-label">Weight:</span>
              <span className="info-value">{pet.weight} kg</span>
            </div>
          </div>

          <div className="pet-detail-description">
            <h3>About</h3>
            <p>{pet.about}</p>
          </div>

          <div className="pet-detail-seller">
            <h3>Seller Information</h3>
            <div className="seller-info">
              <div className="seller-info-item">
                <span className="info-label">Name:</span>
                <span className="info-value">{pet.seller?.name}</span>
              </div>

              <div className="seller-info-item">
                <span className="info-label">Phone:</span>
                <span className="info-value">{pet.seller?.phone}</span>
              </div>

              <div className="seller-info-item">
                <span className="info-label">Email:</span>
                <span className="info-value">{pet.seller?.email}</span>
              </div>

              <div className="seller-info-item">
                <span className="info-label">Address:</span>
                <span className="info-value">{pet.seller?.address}</span>
              </div>
            </div>
          </div>

          <div className="pet-detail-actions">
            {isOwner ? (
              <button onClick={handleDeletePet} className="btn btn-danger delete-btn">
                Delete Listing
              </button>
            ) : (
              <button
                onClick={handleShowInterest}
                className="btn btn-primary interest-btn"
                disabled={sendingInterest || interestSent}
              >
                {interestSent ? "Interest Sent!" : sendingInterest ? "Sending..." : "I'm Interested"}
              </button>
            )}

            <button onClick={() => navigate("/dashboard")} className="btn btn-secondary back-btn">
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PetDetail
