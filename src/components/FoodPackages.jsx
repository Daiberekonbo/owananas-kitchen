import { scrollToSection } from "../utils/scrollTo"
import { packages } from "../data/package"

function FoodPackages({ onAddToCart }) {
  

  return (
    <section className="packages" id="packages">
      <div className="section-heading">
        <p>FOOD PACKAGES</p>

        <h2>Perfect Packages for Every Occasion</h2>

        <span>
          Whether you're feeding yourself, your family, or your entire
          team, we have a package for you.
        </span>
      </div>

      <div className="packages-grid">
        {packages.map((foodPackage) => (
          <div className="package-card" key={foodPackage.id}>
            <h3>{foodPackage.name}</h3>

            <p>{foodPackage.description}</p>

            <strong>From ₦{foodPackage.price.toLocaleString()}</strong>

            <button onClick={() => onAddToCart(foodPackage)}>
              Add to Cart
            </button>

            <button
              className="package-secondary"
              onClick={() => scrollToSection("contact")}
            >
              Custom Request
            </button>
          </div>
        ))}
      </div>
    </section>
  )
}

export default FoodPackages