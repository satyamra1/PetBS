import { Link } from "react-router-dom"
import "./PetCard.css"

const PetCard = ({ pet }) => {
  const defaultImage = "https://via.placeholder.com/300x200?text=Pet+Image"
  const imageSrc = pet.image ? `http://localhost:5000${pet.image}` : defaultImage

  return (
    <div className="pet-card">
      <div className="pet-image-container">
        <img src={imageSrc} alt={pet.name} className="pet-image" />
        <div className="pet-category">{pet.category}</div>
      </div>

      <div className="pet-info">
        <h3 className="pet-name">{pet.name}</h3>
        <div className="pet-price">${pet.price}</div>
        <p className="pet-weight">Weight: {pet.weight} kg</p>
        <Link to={`/pet/${pet._id}`} className="view-details-btn">
          View Details
        </Link>
      </div>
    </div>
  )
}

export default PetCard
