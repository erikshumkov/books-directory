const booklist = document.querySelector(".booklist")
const add = document.querySelector("#add");
const close = document.querySelector("#close");
const overlay = document.querySelector(".overlay")
const bookDate = document.querySelectorAll(".date span")

const deleteFn = async (url) => {
  const response = await fetch(url, {
    method: "DELETE"
  })

  if (response.status !== 200) {
    throw new Error("Something went wrong with the data fetching..")
  }

  const data = await response.json();

  return data;
}

bookDate.forEach(date => {
  const dateArr = date.innerText.split(" ")
  date.innerText = `${dateArr[1]} ${dateArr[2]} ${dateArr[3]}`
})

document.addEventListener("click", (e) => {
  if (e.target.id === "add") {
    overlay.classList.add("fade");
    overlay.style.visibility = "visible";
    setTimeout(() => {
      overlay.classList.remove("fade");
    }, 400);
  }

  if (e.target.id === "close") {
    overlay.classList.add("fade2");
    setTimeout(() => {
      overlay.style.visibility = "hidden";
      overlay.classList.remove("fade2");
    }, 600);
  }

  if (e.target.className === "overlay") {
    overlay.classList.add("fade2");
    setTimeout(() => {
      overlay.style.visibility = "hidden";
      overlay.classList.remove("fade2");
    }, 600);
  }
})

booklist.addEventListener("click", (e) => {
  const target = e.target;

  if (target.className === "delete") {
    const url = `/books/${target.dataset.doc}`

    deleteFn(url)
      .then(data => {
        window.location.href = data.redirect
      })
      .catch(err => console.log("Promise rejected:", err.message))
  }
})