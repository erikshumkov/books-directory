const form = document.querySelector("form")
const errorMessage = document.querySelector(".err-msg")

form.addEventListener("submit", async (e) => {
  e.preventDefault()

  const updates = {}

  const password = form.password.value
  const password2 = form.password2.value

  if (password.length > 6 && password === password2) updates.password = password

  if (password !== password2) {
    errorMessage.textContent = "Passwords has to match each other"
    errorMessage.style.color = "red"
    form.password.style.borderColor = "red"
    form.password2.style.borderColor = "red"
  } else {
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
  }
})