function Contact() {
  return (
    <section className="contact" id="contact">
      <div className="contact-content">
        <p className="contact-tag">GET IN TOUCH</p>

        <h2>Let's Talk About Your Food Needs.</h2>

        <p>
          Whether you need a meal delivered, food packages for your
          business, or catering for your next event, we'd love to hear
          from you.
        </p>

        <div className="contact-details">
          <div>
            <strong>Phone</strong>
            <span>+234 XXX XXX XXXX</span>
          </div>

          <div>
            <strong>Email</strong>
            <span>hello@owananaskitchen.com</span>
          </div>

          <div>
            <strong>Location</strong>
            <span>Lagos, Nigeria</span>
          </div>
        </div>

                <button
          className="contact-button"
          onClick={() => window.location.href = "mailto:hello@owananaskitchen.com"}
        >
          Contact Us
        </button>
      </div>
    </section>
  )
}

export default Contact