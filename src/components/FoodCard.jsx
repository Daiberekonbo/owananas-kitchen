import "./FoodCard.css"
function FoodCard({ id, name, price, description, image, onAddToCart}) {
  return (
    <div className="food-card">
      <img src={image} alt={name} />
      <h2>{name}</h2>
      <p className="price">₦{price.toLocaleString()}</p>
      <p className="description">{description}</p>
      <button className="add-to-cart-btn" onClick={() => onAddToCart({ id, name, price, image })}>
        Add to Cart
      </button>
    </div>
  )
}

export default FoodCard