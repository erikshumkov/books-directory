const form = document.querySelector(".form-info")
const errorMessage = document.querySelector(".err-msg")
const removeBtn = document.querySelector(".removeBtn")

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
    if (data.user) {
      location.assign("/users/me")
    }
  } catch (e) {
    console.log(e)
  }
})

removeBtn.addEventListener("click", async (e) => {
  try {
    const res = await fetch("/users/me/avatar", {
      method: "DELETE"
    })
    const data = await res
    if (data) {
      location.assign("/users/me")
    }
  } catch (e) {
    console.error(e);
  }
})