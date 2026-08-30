import { scrollToSection } from "../utils/scrollTo"

function Hero() {
  return (
    <section className="hero" id="home">
      <div className="hero-content">
        <p className="hero-tagline">FOOD • CATERING • DELIVERY</p>

        <h1>
          Delicious Food,
          <span> Memorable Moments.</span>
        </h1>

        <p className="hero-description">
          From everyday meals to unforgettable events, Owanana's Kitchen
          provides delicious food, catering services, and food packages
          delivered to individuals, families, and businesses.
        </p>

        <div className="hero-buttons">
          <button className="hero-primary" onClick={() => scrollToSection("menu")}>
            Order Food
          </button>

          <button className="hero-secondary" onClick={() => scrollToSection("catering")}>
            Book Catering
          </button>
        </div>
      </div>

      <div className="hero-image">
        <img src="/jollof.jpg" alt="Delicious food from Owanana's Kitchen" />
      </div>
    </section>
  )
}

export default Hero