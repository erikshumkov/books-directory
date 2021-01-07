const form = document.querySelector("form")
const errorMessage = document.querySelector(".err-msg")

form.addEventListener("submit", async (e) => {
  e.preventDefault()

  const name = form.name.value
  const age = form.age.value
  const email = form.email.value
  const password = form.password.value

  const obj = {}

  obj.email = email
  obj.password = password
  if (name) obj.name = name
  if (age) obj.age = age

  if (password.length < 7) {
    errorMessage.textContent = "Password has to be atleast 7 characters long."
    errorMessage.style.color = "red"
    form.password.style.borderColor = "red"
  } else {
    form.password.style.borderColor = "lightgreen"
    try {
      const res = await fetch("/users", {
        method: "POST",
        body: JSON.stringify(obj),
        headers: { "Content-Type": "application/json" }
      })
      const data = await res.json()
      console.log(data)

      if (data.errors) {
        let msg = ""

        if (data.errors.email) {
          form.email.style.borderColor = "red"
          msg = `${data.errors.email.message}`;
        } else {
          form.email.style.borderColor = "lightgreen"
        }

        if (data.errors.password) {
          form.password.style.borderColor = "red"
          msg += ` ${data.errors.password.message}`
        } else {
          form.password.style.borderColor = "lightgreen"
        }

        errorMessage.style.color = "red"
        form.email.style.borderColor = "red"
        errorMessage.textContent = msg;
      }

      if (res.status !== 201) {
        throw new Error("Something went wrong with the data fetching..")
      }

      if (data.user) {
        location.assign("/")
      }
    } catch (e) {
      console.log(e)
    }
  }
})