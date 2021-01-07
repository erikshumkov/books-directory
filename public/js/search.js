const searchBtn = document.getElementById("search")
const add = document.getElementById("add")
const bookform = document.getElementById("book-form")
const searchBox = document.getElementById("query")
const booklist = document.querySelector(".booklist")
const addbook = document.querySelector(".add-book")
let heading = document.querySelector(".booklist-header h1")
const toast = document.querySelector(".toast")
const toastP = toast.querySelector("p")

// heading.innerText = "Search"

const fetchBooks = async (url) => {
  const response = await fetch(url)

  if (response.status !== 200) {
    throw new Error("Something went wrong with the data fetching..")
  }

  const data = await response.json()

  if (data.totalItems === 0) {
    heading.innerHTML = `Your search generated 0 results. <br/> Try something else.`

    throw new Error("Searchterm generated 0 results.")
  }

  return data;
}

searchBtn.addEventListener("click", (e) => {
  const query = searchBox.value

  heading.innerText = query.charAt(0).toUpperCase() + query.substring(1).toLowerCase()

  fetchBooks(`https://www.googleapis.com/books/v1/volumes?q=${query}`)
    .then(result => {
      booklist.innerHTML = `
        ${result.items.map(book => `
        <div class="book">
          <div class="book-image">
            ${!book.volumeInfo.imageLinks ? `
            <i class="fas fa-image"></i>
            ` : `
            <div class="img-container">
              <img src="${book.volumeInfo.imageLinks.thumbnail}" alt="Image of ${book.volumeInfo.title}">
            </div>
            `}
          </div>
          <div class="book-info">
            <p class="title">${book.volumeInfo.title}</p>
            <p class="author">${!book.volumeInfo.authors ? `
            Unknown
            ` : `
            ${book.volumeInfo.authors.map(author => author).join(", ")}
            `}</p>
          </div>
          <div class="buttons" style="display: block;">
            <a class="edit add-book">Add book</a>
          </div>
        </div>
        `).join("")}
      `
    })
    .catch(err => console.error(err))
})

booklist.addEventListener("click", (e) => {
  const target = e.target

  if (target.className.includes("add-book")) {
    const book = target.parentElement.parentElement

    bookform.title.value = book.querySelector(".title").innerText
    bookform.author.value = book.querySelector(".author").innerText
    bookform.imgURL.value = book.querySelector("img").src

    // Add message
    toast.style.display = "flex"
    toastP.innerText = `${bookform.title.value} has been added to the library!`
    setTimeout(() => {
      toast.style.display = "none"
    }, 3000)

    bookform.submit()
  }
})