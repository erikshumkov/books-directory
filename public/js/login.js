const form = document.querySelector("form")
const errorMessage = document.querySelector(".err-msg")

function errorMsg(msg) {
  errorMessage.style.color = "red"
  form.email.style.borderColor = "red"
  form.password.style.borderColor = "red"
  errorMessage.textContent = msg
}

form.addEventListener("submit", async (e) => {
  e.preventDefault()

  const email = form.email.value
  const password = form.password.value
  errorMessage.textContent = ""

  try {
    const res = await fetch("/users/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
      headers: { "Content-Type": "application/json" }
    })

    const data = await res.json()
    console.log(data)

    if (data.errors) {
      errorMsg(data.errors[0].msg)
    }

    if (data.error) {
      errorMsg(data.error)
    }

    if (data.msg) {
      errorMsg(data.msg)
    }

    if (res.status !== 200) {
      throw new Error("Something went wrong with the data fetching..")
    }

    if (data.user) {
      console.log(data.user)
      location.assign("/")
    }
  } catch (e) {
    console.error(e)
  }
})