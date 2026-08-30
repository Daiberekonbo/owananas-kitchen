import { useState } from 'react'
import './App.css'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Services from './components/Services'
import MenuSection from './components/MenuSection'
import FoodPackages from './components/FoodPackages'
import Catering from './components/Catering'
import About from './components/About'
import Gallery from './components/Gallery'
import Testimonials from './components/Testimonials'
import Contact from './components/Contact'
import Footer from './components/Footer'
import Cart from './components/Cart'
import Checkout from './components/Checkout'

function App() {
  const [cartItems, setCartItems] = useState([])
  const [cartOpen, setCartOpen] = useState(false)
  const [checkoutOpen, setCheckoutOpen] = useState(false)

  const addToCart = (item) => {
    setCartItems((prevItems) => {
      const existing = prevItems.find((i) => i.id === item.id)
      if (existing) {
        return prevItems.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        )
      }
      return [...prevItems, { ...item, quantity: 1 }]
    })
  }

  const increaseQty = (id) => {
    setCartItems((prevItems) =>
      prevItems.map((i) => (i.id === id ? { ...i, quantity: i.quantity + 1 } : i))
    )
  }

  const decreaseQty = (id) => {
    setCartItems((prevItems) =>
      prevItems
        .map((i) => (i.id === id ? { ...i, quantity: i.quantity - 1 } : i))
        .filter((i) => i.quantity > 0)
    )
  }

  const removeItem = (id) => {
    setCartItems((prevItems) => prevItems.filter((i) => i.id !== id))
  }

  const clearCart = () => {
    setCartItems([])
  }

  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0)

  return (
    <>
      <Navbar cartCount={cartCount} onCartClick={() => setCartOpen(true)} />

      <Hero />

      <Services />

      <MenuSection onAddToCart={addToCart} />

            <FoodPackages onAddToCart={addToCart} />

      <Catering />

      <About />

      <Gallery />

      <Testimonials />

      <Contact />

      <Footer />

            <Cart
        isOpen={cartOpen}
        onClose={() => setCartOpen(false)}
        items={cartItems}
        onIncrease={increaseQty}
        onDecrease={decreaseQty}
        onRemove={removeItem}
        onClear={clearCart}
        onCheckout={() => {
          setCartOpen(false)
          setCheckoutOpen(true)
        }}
      />

      <Checkout
        isOpen={checkoutOpen}
        onClose={() => setCheckoutOpen(false)}
        items={cartItems}
        onPlaceOrder={clearCart}
      />
    </>
  )
}

export default App