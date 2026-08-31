import { useState } from "react"
import FoodCard from "./FoodCard"

function MenuSection({ foods, loading, error, onAddToCart }) {
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [searchTerm, setSearchTerm] = useState("")

  const categories = [
    "All",
    ...new Set(foods.map((food) => food.category))
  ]

  const filteredFoods = foods.filter((food) => {
    const matchesCategory =
      selectedCategory === "All" || food.category === selectedCategory

    const matchesSearch = food.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase())

    return matchesCategory && matchesSearch
  })

  return (
    <section className="menu-section" id="menu">
      <div className="section-heading">
        <p>OUR MENU</p>

        <h2>Freshly Prepared for You</h2>

        <span>
          Explore some of our delicious meals, proteins, soups and drinks.
        </span>
      </div>

      {loading ? (
        <p className="catalog-status" role="status">Loading our menu...</p>
      ) : error ? (
        <p className="catalog-status catalog-error" role="alert">{error}</p>
      ) : (
        <>
          <div className="menu-search">
            <input
              type="text"
              placeholder="Search food... e.g. chicken"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="category-buttons">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={category === selectedCategory ? "active" : ""}
              >
                {category}
              </button>
            ))}
          </div>

          {filteredFoods.length === 0 ? (
            <p className="no-results">
              No food matches "{searchTerm}" in {selectedCategory}.
            </p>
          ) : (
            <div className="food-grid">
              {filteredFoods.map((food) => (
                <FoodCard
                  key={food.id}
                  id={food.id}
                  name={food.name}
                  price={food.price}
                  description={food.description}
                  image={food.image}
                  onAddToCart={onAddToCart}
                />
              ))}
            </div>
          )}
        </>
      )}
    </section>
  )
}

export default MenuSection