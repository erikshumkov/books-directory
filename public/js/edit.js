const form = document.querySelector("form")
const errorMessage = document.querySelector(".err-msg")

form.addEventListener("submit", async (e) => {
  e.preventDefault()

  const updates = {}

  const name = form.name.value
  const age = form.age.value
  const email = form.email.value

  if (name) updates.name = name
  if (age) updates.age = age
  if (email) updates.email = email

  try {
    const res = await fetch("/users/me", {
      method: "PATCH",
      body: JSON.stringify(updates),
      headers: { "Content-Type": "application/json" }
    })
    const data = await res.json()
    console.log(data)
    if (data.user) {
      location.assign("/users/me")
    }
  } catch (e) {
    console.log(e)
  }
})