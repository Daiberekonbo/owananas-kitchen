function Contact() {
  const whatsappNumber = "2348033171523"
  const whatsappMessage = encodeURIComponent(
    "Hi Owanana's Kitchen, I'd like to place a custom order/inquiry."
  )

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

        <div className="contact-buttons">
          <button
            className="contact-button whatsapp-button"
            onClick={() =>
              window.open(
                `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`,
                "_blank"
              )
            }
          >
            Chat on WhatsApp
          </button>

          <button
            className="contact-button"
            onClick={() => (window.location.href = "mailto:hello@owananaskitchen.com")}
          >
            Contact Us
          </button>
        </div>
      </div>
    </section>
  )
}

export default Contact