import { scrollToSection } from "../utils/scrollTo"

function FoodPackages({ packages, loading, error, onAddToCart }) {

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

      {loading ? (
        <p className="catalog-status" role="status">Loading our packages...</p>
      ) : error ? (
        <p className="catalog-status catalog-error" role="alert">{error}</p>
      ) : (
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
      )}
    </section>
  )
}

export default FoodPackages