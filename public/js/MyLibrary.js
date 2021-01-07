const booklist = document.querySelector(".booklist")
const addbookBtn = document.querySelector("#updatebtn")
const updatebookBtn = document.querySelector("#updatebook")
const overlay = document.querySelector(".overlay")
const dateAdded = document.querySelectorAll(".date span")
const editBooks = document.querySelector("#edit-state")
const editForm = document.querySelector("#edit-form")
const addForm = document.querySelector("#book-form")
const toast = document.querySelector(".toast")
const toastP = toast.querySelector("p")
const toastHead = toast.querySelector("h4")
let oldTitle;

const deleteFn = async (url) => {
  const response = await fetch(url, {
    method: "DELETE"
  })

  if (response.status !== 200) {
    throw new Error("Something went wrong with the data fetching..")
  }

  window.location.reload()

  // const data = await response.json();

  // return data;
}

const update = async (oldBookTitle) => {
  const url = `/books/update/${oldBookTitle}`

  const title = editForm.title.value
  const author = editForm.author.value
  const rating = editForm.rating.value
  const imgURL = editForm.imgURL.value

  const formValues = {
    title,
    author,
    rating,
    imgURL,
    oldBookTitle
  }

  const response = await fetch(url, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(formValues)
  });

  if (response.status !== 200) {
    const err = await response.json()

    err.errors.forEach(e => {
      editForm[e.param].placeholder = e.msg
      editForm[e.param].value = ""
      editForm[e.param].classList.add("err")
    })

    throw new Error(err)
  }

  const data = await response.json();

  return data;
}

// Add or remove overlay + modal
const modalFn = (p) => {
  if (p === "add") {
    overlay.classList.add("fade");
    overlay.style.visibility = "visible";
    setTimeout(() => {
      overlay.classList.remove("fade");
    }, 400);
  }

  if (p === "remove") {
    overlay.classList.add("fade2");
    setTimeout(() => {
      document.querySelector(".settings").style.display = "none"
      document.querySelector(".settings2").style.display = "none"
      overlay.style.visibility = "hidden";
      overlay.classList.remove("fade2");
    }, 600);
  }
}

function toasterFunc(head, text, bgColor, item) {
  toast.style.display = "flex"
  toastHead.innerText = head
  toastP.innerText = text
  toast.style.background = bgColor
  setTimeout(() => {
    localStorage.removeItem(item)
  }, 500)
  setTimeout(() => {
    toast.style.display = "none"
  }, 3000)
}

// When the book was added to the book list.
// Takes date from database date
dateAdded.forEach(date => {
  const dateArr = date.innerText.split(" ")
  date.innerText = `${dateArr[1]} ${dateArr[2]} ${dateArr[3]}`
})

document.addEventListener("click", (e) => {
  const target = e.target

  if (target.id === "add") {
    document.querySelector(".settings").style.display = "block"
    modalFn("add")
  }

  if (target.id === "updatebtn") {
    // toast notification trigger
    localStorage.setItem("add", true)
  }

  // Open edit form, add card values to form
  if (target.className === "edit") {
    // Select book card
    const book = target.parentElement.parentElement;
    const title = book.querySelector(".title").innerText
    const author = book.querySelector(".author").innerText.replace("By ", "")

    // Count the yellow stars
    const rating = [...book.querySelector(".rating-box").children].filter(star => !star.className.includes("grey")).length

    if (book.querySelector("img")) {
      const imgURL = book.querySelector("img").src
      editForm.imgURL.value = imgURL
    }

    if (!book.querySelector("img")) {
      editForm.imgURL.value = ""
    }

    if (editForm.querySelector(".err")) {
      [...editForm.querySelectorAll(".err")].forEach(f => {
        console.log(f)
        f.classList.remove("err")
      })
    }

    oldTitle = title

    editForm.title.value = title
    editForm.author.value = author
    editForm.rating.value = rating


    document.querySelector(".settings2").style.display = "block"
    modalFn("add")
  }

  if (target.id === "close") {
    modalFn("remove")
  }

  if (target.className === "overlay") {
    modalFn("remove")
  }
})

booklist.addEventListener("click", (e) => {
  const target = e.target;

  if (target.className === "delete") {
    const url = `/books/${target.dataset.doc}`

    // toast notification trigger
    localStorage.setItem("delete", true)

    // Add title to localstorage for Toast msg
    // localStorage.setItem("title", )

    deleteFn(url)
      .catch(err => console.log("Promise rejected:", err.message))
  }
})

updatebookBtn.addEventListener("click", (e) => {
  e.preventDefault()

  update(oldTitle)
    .then(data => {
      // toast notification trigger
      localStorage.setItem("edit", true)
      window.location.href = data.redirect
    })
    .catch(err => {
      console.error(err)
    })
})

// Show edit and remove buttons on each card
editBooks.addEventListener("click", (e) => {
  const buttonsDiv = document.querySelectorAll(".buttons")
  const buttons = document.querySelector(".buttons")

  // Show / hide edit and delete buttons
  if (buttons.style.display === "block") {
    buttonsDiv.forEach(b => b.style.display = "none")
  } else {
    buttonsDiv.forEach(b => b.style.display = "block")
  }

})

// Rating

// const ratingmodal = document.querySelector(".rating-modal")

// ratingmodal.addEventListener("mouseenter", function (e) {
//   [...this.children].forEach((icon, index) => {

//     const icons = document.querySelectorAll(".grey")

//     icon.addEventListener("mouseenter", function (e) {
//       for (let i = 0; i <= index; i++) {
//         icons[i].style.color = "#ffc107"
//       }
//     })

//     icon.addEventListener("mouseleave", function (e) {
//       for (let i = 0; i <= index; i++) {
//         icons[i].style.color = "#dadada"
//       }
//     })
//   })
// })

// ratingmodal.addEventListener("click", function (e) {
//   const value = parseInt(e.target.dataset.value)
//   addForm.rating.value = value
// })

if (localStorage.delete) {
  toasterFunc("Removed!", "The title has been removed from the database!", "#f9461c", "delete")
}

if (localStorage.add) {
  toasterFunc("Success!", "The title has been added to the library!", "#43d787", "add")
}

if (localStorage.edit) {
  toasterFunc("Updated!", "The title has been updated!", "#43d787", "edit")
}