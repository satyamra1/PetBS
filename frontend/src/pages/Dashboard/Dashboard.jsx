"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import api from "../../services/api"
import PetCard from "../../components/PetCard/PetCard"
import "./Dashboard.css"

const Dashboard = () => {
  const [pets, setPets] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [filter, setFilter] = useState("all")

  useEffect(() => {
    fetchPets()
  }, [])

  const fetchPets = async () => {
    try {
      const response = await api.get("/pets")
      setPets(response.data)
      setLoading(false)
    } catch (err) {
      console.error("Error fetching pets:", err)
      setError("Failed to load pets. Please try again later.")
      setLoading(false)
    }
  }

  const filterPets = () => {
    if (filter === "all") return pets
    return pets.filter((pet) => pet.category.toLowerCase() === filter.toLowerCase())
  }

  const handleFilterChange = (e) => {
    setFilter(e.target.value)
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Find Your Perfect Pet</h1>
        <p>Browse through our collection of adorable pets looking for a new home</p>
      </div>

      <div className="filter-container">
        <select className="filter-select" value={filter} onChange={handleFilterChange}>
          <option value="all">All Pets</option>
          <option value="dog">Dogs</option>
          <option value="cat">Cats</option>
          <option value="bird">Birds</option>
          <option value="fish">Fish</option>
          <option value="other">Other</option>
        </select>
      </div>

      {loading ? (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading pets...</p>
        </div>
      ) : error ? (
        <div className="error-container">
          <p>{error}</p>
          <button onClick={fetchPets} className="btn btn-primary">
            Try Again
          </button>
        </div>
      ) : (
        <div className="pets-grid">
          {filterPets().length > 0 ? (
            filterPets().map((pet) => <PetCard key={pet._id} pet={pet} />)
          ) : (
            <div className="no-pets-message">
              <p>No pets found in this category.</p>
              {filter !== "all" && (
                <button onClick={() => setFilter("all")} className="btn btn-secondary">
                  View All Pets
                </button>
              )}
            </div>
          )}
        </div>
      )}

      <div className="dashboard-cta">
        <h2>Want to sell your pet?</h2>
        <p>List your pet on our platform and find them a loving home</p>
        <Link to="/list-pet" className="btn btn-primary">
          List Your Pet
        </Link>
      </div>
    </div>
  )
}

export default Dashboard
