"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { useAuth } from "../../context/AuthContext"
import api from "../../services/api"
import PetCard from "../../components/PetCard/PetCard"
import "./UserProfile.css"

const UserProfile = () => {
  const { currentUser } = useAuth()
  const [userPets, setUserPets] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    fetchUserPets()
  }, [])

  const fetchUserPets = async () => {
    try {
      const response = await api.get("/pets/user")
      setUserPets(response.data)
      setLoading(false)
    } catch (err) {
      console.error("Error fetching user pets:", err)
      setError("Failed to load your pets. Please try again later.")
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading profile...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="error-container">
        <p>{error}</p>
        <button onClick={fetchUserPets} className="btn btn-primary">
          Try Again
        </button>
      </div>
    )
  }

  return (
    <div className="profile-container">
      <div className="profile-header">
        <div className="profile-avatar">
          <img src="https://via.placeholder.com/150?text=User" alt="Profile" className="avatar-image" />
        </div>

        <div className="profile-info">
          <h1 className="profile-name">{currentUser.name}</h1>
          <div className="profile-stats">
            <div className="profile-stat">
              <span className="stat-value">{userPets.length}</span>
              <span className="stat-label">Pets Listed</span>
            </div>
          </div>
        </div>
      </div>

      <div className="profile-details">
        <div className="profile-section">
          <h2 className="section-title">About</h2>
          <p className="section-content">{currentUser.about || "No information provided."}</p>
        </div>

        <div className="profile-section">
          <h2 className="section-title">Contact Information</h2>
          <div className="contact-info">
            <div className="contact-item">
              <span className="contact-label">Email:</span>
              <span className="contact-value">{currentUser.email}</span>
            </div>

            <div className="contact-item">
              <span className="contact-label">Phone:</span>
              <span className="contact-value">{currentUser.phone}</span>
            </div>

            <div className="contact-item">
              <span className="contact-label">Address:</span>
              <span className="contact-value">{currentUser.address}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="profile-pets">
        <div className="pets-header">
          <h2 className="section-title">My Listed Pets</h2>
          <Link to="/list-pet" className="btn btn-primary">
            List a New Pet
          </Link>
        </div>

        {userPets.length > 0 ? (
          <div className="pets-grid">
            {userPets.map((pet) => (
              <PetCard key={pet._id} pet={pet} />
            ))}
          </div>
        ) : (
          <div className="no-pets-message">
            <p>You haven't listed any pets yet.</p>
            <Link to="/list-pet" className="btn btn-primary">
              List Your First Pet
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}

export default UserProfile
