import { foods } from "../data/foods"
import { packages } from "../data/packages"

// TEMPORARY: reading local data.
// Once the backend exists, replace the body of each function
// with a real fetch() call to the API — nothing else in the app
// needs to change.

export async function getFoods() {
  return foods
}

export async function getPackages() {
  return packages
}

export async function submitOrder(orderData) {
  // Fake for now — later this becomes:
  // const res = await fetch(`${API_BASE_URL}/api/orders`, { method: "POST", body: JSON.stringify(orderData) })
  // return res.json()
  const ref = "OWK-" + Math.floor(100000 + Math.random() * 900000)
  return { orderRef: ref }
}