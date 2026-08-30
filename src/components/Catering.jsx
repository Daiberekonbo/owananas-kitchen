import { scrollToSection } from "../utils/scrollTo"
function Catering() {
  return (
    <section className="catering" id="catering">
      <div className="catering-content">
        <p className="catering-tag">CATERING SERVICES</p>

        <h2>
          Planning an Event?
          <span> Let Us Handle the Food.</span>
        </h2>

        <p className="catering-description">
          From intimate gatherings to large celebrations and corporate
          events, Owanana's Kitchen provides delicious food and reliable
          catering services tailored to your occasion.
        </p>

        <div className="catering-list">
          <div>
            <span>✓</span>
            Weddings & Celebrations
          </div>

          <div>
            <span>✓</span>
            Corporate Events
          </div>

          <div>
            <span>✓</span>
            Parties & Gatherings
          </div>

          <div>
            <span>✓</span>
            Meetings & Special Events
          </div>
        </div>

                <button className="catering-button" onClick={() => scrollToSection("contact")}>
          Request Catering
        </button>
      </div>

      <div className="catering-image">
        <img
          src="/jollof.jpg"
          alt="Owanana's Kitchen catering"
        />
      </div>
    </section>
  )
}

export default Catering