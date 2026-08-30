function Gallery() {
  const images = [
    {
      id: 1,
      image: "/jollof.jpg",
      alt: "Jollof Rice"
    },
    {
      id: 2,
      image: "/friedrice.jpg",
      alt: "Fried Rice"
    },
    {
      id: 3,
      image: "/chicken.jpg",
      alt: "Chicken"
    },
    {
      id: 4,
      image: "/grilledfish.jpg",
      alt: "Grilled Fish"
    },
    {
      id: 5,
      image: "/egusisoup.jpg",
      alt: "Egusi Soup"
    },
    {
      id: 6,
      image: "/chapman.jpg",
      alt: "Chapman"
    }
  ]

  return (
    <section className="gallery" id="gallery">
      <div className="section-heading">
        <p>OUR GALLERY</p>

        <h2>A Taste of What We Do</h2>

        <span>
          Take a look at some of the food and experiences from Owanana's Kitchen.
        </span>
      </div>

      <div className="gallery-grid">
        {images.map((item) => (
          <div className="gallery-item" key={item.id}>
            <img src={item.image} alt={item.alt} />
          </div>
        ))}
      </div>
    </section>
  )
}

export default Gallery