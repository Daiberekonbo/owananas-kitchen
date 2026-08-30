import "./Cart.css"

function Cart({ isOpen, onClose, items, onIncrease, onDecrease, onRemove, onClear, onCheckout })  {
  if (!isOpen) return null

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0)

  return (
    <div className="cart-overlay" onClick={onClose}>
      <div className="cart-panel" onClick={(e) => e.stopPropagation()}>
        <div className="cart-header">
          <h2>Your Cart</h2>
          <button className="cart-close" onClick={onClose}>✕</button>
        </div>

        {items.length === 0 ? (
          <p className="cart-empty">Your cart is empty.</p>
        ) : (
          <>
            <div className="cart-items">
              {items.map((item) => (
                <div className="cart-item" key={item.id}>
                  <img src={item.image} alt={item.name} />
                  <div className="cart-item-info">
                    <h3>{item.name}</h3>
                    <p>₦{item.price.toLocaleString()}</p>
                    <div className="cart-qty-controls">
                      <button onClick={() => onDecrease(item.id)}>-</button>
                      <span>{item.quantity}</span>
                      <button onClick={() => onIncrease(item.id)}>+</button>
                    </div>
                  </div>
                  <div className="cart-item-right">
                    <p className="cart-item-subtotal">
                      ₦{(item.price * item.quantity).toLocaleString()}
                    </p>
                    <button className="cart-remove" onClick={() => onRemove(item.id)}>
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="cart-footer">
              <div className="cart-total">
                <span>Total</span>
                <strong>₦{total.toLocaleString()}</strong>
              </div>
                            <button className="cart-clear" onClick={onClear}>Clear Cart</button>
              <button className="cart-checkout" onClick={onCheckout}>Checkout</button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default Cart