const booklist = document.querySelector(".booklist")
const add = document.querySelector("#add");
const overlay = document.querySelector(".overlay")
const updatebtn = document.querySelector("#updatebtn")
const title = document.querySelector("#title").value;
const form = document.getElementById("book-form")
const bookDate = document.querySelectorAll(".date span")

const update = async () => {
  const url = `/books/update/${title}`

  const fd = new FormData(form)

  const bodyvalues = {
    title: fd.get("title"),
    author: fd.get("author"),
    isbn: fd.get("isbn")
  }

  const response = await fetch(url, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(bodyvalues)
  });

  if (response.status !== 200) {
    throw new Error("Something went wrong with the data fetching..")
  }

  const data = await response.json();

  return data;
}

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

updatebtn.addEventListener("click", (e) => {
  e.preventDefault()

  update()
    .then(data => {
      window.location.href = data.redirect
    })
    .catch(err => console.log("Promise rejected:", err.message))
})

document.addEventListener("click", (e) => {
  if (e.target.id === "add") {
    overlay.style.visibility = "visible";
  }

  if (e.target.id === "close") {
    overlay.classList.add("fade2");
    setTimeout(() => {
      overlay.style.visibility = "hidden";
      overlay.classList.remove("fade2");
      window.location.replace("/books");
    }, 600);
  }

  if (e.target.className === "overlay") {
    overlay.classList.add("fade2");
    setTimeout(() => {
      overlay.style.visibility = "hidden";
      overlay.classList.remove("fade2");
      window.location.replace("/books");
    }, 600);
  }
})

booklist.addEventListener("click", (e) => {
  const target = e.target;

  if (target.className === "delete") {
    const url = `/books/delete/${target.dataset.doc}`

    deleteFn(url)
      .then(data => {
        window.location.href = data.redirect
      })
      .catch(err => console.log("Promise rejected:", err.message))
  }
})