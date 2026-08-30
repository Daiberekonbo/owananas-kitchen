import { useState } from "react"
import "./Checkout.css"

function Checkout({ isOpen, onClose, items, onPlaceOrder }) {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    notes: ""
  })
  const [errors, setErrors] = useState({})
  const [orderRef, setOrderRef] = useState(null)

  if (!isOpen) return null

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0)

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const validate = () => {
    const newErrors = {}

    if (!form.name.trim()) newErrors.name = "Name is required"
    if (!form.phone.trim()) newErrors.phone = "Phone number is required"
    if (!form.email.trim()) {
      newErrors.email = "Email is required"
    } else if (!/^\S+@\S+\.\S+$/.test(form.email)) {
      newErrors.email = "Enter a valid email"
    }
    if (!form.address.trim()) newErrors.address = "Delivery address is required"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (items.length === 0) return
    if (!validate()) return

    const ref = "OWK-" + Math.floor(100000 + Math.random() * 900000)
    setOrderRef(ref)
    onPlaceOrder()
  }

  const handleClose = () => {
    setOrderRef(null)
    setForm({ name: "", phone: "", email: "", address: "", notes: "" })
    setErrors({})
    onClose()
  }

  return (
    <div className="checkout-overlay" onClick={handleClose}>
      <div className="checkout-panel" onClick={(e) => e.stopPropagation()}>
        <div className="checkout-header">
          <h2>{orderRef ? "Order Confirmed" : "Checkout"}</h2>
          <button className="checkout-close" onClick={handleClose}>✕</button>
        </div>

        {orderRef ? (
          <div className="order-confirmation">
            <div className="confirmation-icon">✅</div>
            <h3>Order Received!</h3>
            <p>Thank you for ordering from Owanana's Kitchen.</p>
            <p className="order-ref">Order Reference: <strong>{orderRef}</strong></p>
            <p className="confirmation-note">
              We'll contact you at {form.phone} shortly to confirm your order.
            </p>
            <button className="checkout-submit" onClick={handleClose}>
              Back to Menu
            </button>
          </div>
        ) : (
          <>
            <div className="order-summary">
              <h3>Order Summary</h3>
              {items.length === 0 ? (
                <p className="cart-empty">Your cart is empty.</p>
              ) : (
                <>
                  {items.map((item) => (
                    <div className="order-summary-row" key={item.id}>
                      <span>{item.name} × {item.quantity}</span>
                      <span>₦{(item.price * item.quantity).toLocaleString()}</span>
                    </div>
                  ))}
                  <div className="order-summary-total">
                    <span>Total</span>
                    <strong>₦{total.toLocaleString()}</strong>
                  </div>
                </>
              )}
            </div>

            <form className="checkout-form" onSubmit={handleSubmit}>
              <label>
                Full Name
                <input name="name" value={form.name} onChange={handleChange} />
                {errors.name && <span className="field-error">{errors.name}</span>}
              </label>

              <label>
                Phone Number
                <input name="phone" value={form.phone} onChange={handleChange} />
                {errors.phone && <span className="field-error">{errors.phone}</span>}
              </label>

              <label>
                Email
                <input name="email" value={form.email} onChange={handleChange} />
                {errors.email && <span className="field-error">{errors.email}</span>}
              </label>

              <label>
                Delivery Address
                <input name="address" value={form.address} onChange={handleChange} />
                {errors.address && <span className="field-error">{errors.address}</span>}
              </label>

              <label>
                Order Notes (optional)
                <textarea name="notes" value={form.notes} onChange={handleChange} rows={3} />
              </label>

              <button
                type="submit"
                className="checkout-submit"
                disabled={items.length === 0}
              >
                Place Order
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  )
}

export default Checkout