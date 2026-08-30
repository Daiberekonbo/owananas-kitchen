function Testimonials() {
  const testimonials = [
    {
      id: 1,
      name: "Sarah",
      role: "Happy Customer",
      message:
        "The food was delicious and arrived fresh. Owanana's Kitchen made ordering so easy."
    },
    {
      id: 2,
      name: "David",
      role: "Corporate Client",
      message:
        "We used Owanana's Kitchen for an office event and everything was delivered on time and well prepared."
    },
    {
      id: 3,
      name: "Blessing",
      role: "Event Client",
      message:
        "The catering service was excellent. The food was tasty and our guests loved it."
    }
  ]

  return (
    <section className="testimonials">
      <div className="section-heading">
        <p>TESTIMONIALS</p>

        <h2>What Our Customers Say</h2>

        <span>
          Great food and great service are what we strive for.
        </span>
      </div>

      <div className="testimonials-grid">
        {testimonials.map((testimonial) => (
          <div className="testimonial-card" key={testimonial.id}>
            <div className="stars">★★★★★</div>

            <p>"{testimonial.message}"</p>

            <h3>{testimonial.name}</h3>

            <span>{testimonial.role}</span>
          </div>
        ))}
      </div>
    </section>
  )
}

export default Testimonials