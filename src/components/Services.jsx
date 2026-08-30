import { scrollToSection } from "../utils/scrollTo"

function Services() {
  const services = [
    {
      icon: "🍽️",
      title: "Catering & Events",
      description:
        "Delicious food and professional catering services for weddings, parties, corporate events, meetings, and special occasions.",
      target: "catering"
    },
    {
      icon: "🚚",
      title: "Food Delivery",
      description:
        "Enjoy freshly prepared meals and food packages delivered conveniently to your home, office, or business.",
      target: "menu"
    },
    {
      icon: "📦",
      title: "Foodstuffs & Packages",
      description:
        "Quality foodstuffs and carefully prepared food packages available for individuals, families, and businesses.",
      target: "packages"
    },
  ]

  return (
    <section className="services" id="services">
      <div className="section-heading">
        <p>WHAT WE OFFER</p>
        <h2>Food for Every Need</h2>
        <span>
          From everyday meals to large events, we've got you covered.
        </span>
      </div>

      <div className="services-grid">
        {services.map((service) => (
          <div className="service-card" key={service.title}>
            <div className="service-icon">{service.icon}</div>

            <h3>{service.title}</h3>

            <p>{service.description}</p>

            <button onClick={() => scrollToSection(service.target)}>
              Learn More
            </button>
          </div>
        ))}
      </div>
    </section>
  )
}

export default Services