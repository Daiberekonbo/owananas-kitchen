import { scrollToSection } from "../utils/scrollTo"
function About() {
  return (
    <section className="about" id="about">
      <div className="about-image">
        <img
          src="/jollof.jpg"
          alt="Owanana's Kitchen food"
        />
      </div>

      <div className="about-content">
        <p className="about-tag">ABOUT US</p>

        <h2>
          More Than Just Food.
          <span> We Create Experiences.</span>
        </h2>

        <p>
          Owanana's Kitchen is a growing food and catering service dedicated
          to providing delicious, quality meals for individuals, families,
          businesses, and events.
        </p>

        <p>
          From everyday food deliveries to carefully planned catering
          services and food packages, we make it easier for our customers
          to enjoy great food wherever they are.
        </p>

                <button className="about-button" onClick={() => scrollToSection("menu")}>
          Learn More
        </button>
      </div>
    </section>
  )
}

export default About