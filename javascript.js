const url = "https://openlibrary.org/search.json?q=test";

fetch(url)
    .then(response => response.json())
    .then(data => console.log(data))
    .catch(error => console.error('Error:', error));
 
const bookUrl = "https://openlibrary.org/search.json?";
const coverUrl = "https://covers.openlibrary.org/b/";
const closeFormBtn = document.querySelector("#closeFormBtn");
const showFormBtn = document.querySelector("#showFormBtn");
const formModal = document.querySelector("#formModal");
const bookForm = document.querySelector("#bookForm");
const numBooksTracker = document.querySelector("#numBooks");
const numReadBooksTracker = document.querySelector("#numReadBooks");
const numPagesTracker = document.querySelector("#numPages");
const display = document.querySelector("#display");
const confirmDeleteModal = document.querySelector("#confirmDeleteModal");
const confirmDeleteBtn = document.querySelector("#confirmDeleteBtn");
const declineDeleteBtn = document.querySelector("#declineDeleteBtn");
const formStateHeader = document.getElementById("formStateHeader");
const formStateBtn = document.getElementById("formStateBtn");
const favoriteBooks = document.getElementById("favoriteBooks");
const allBooks = document.getElementById("allBooks");
const finishedBooks = document.getElementById("finishedBooks");
const unfinishedBooks = document.getElementById("unfinishedBooks");
const orderAscendingOrDescending = document.getElementById("orderAscendingOrDescending");
const orderOptions = document.getElementById("orderOptions");


// keeps track of our collection of books to display info
let library = {
    myBooks: {},
    numBooks: 0,
    numPages: 0,
    numReadBooks: 0,
}

// 
let isEditingBook = false;

function Book(title, author, date, pages, read, imgsrc, id) {
    return {
        title: title,
        author: author,
        date: date,
        pages: pages,
        read: read,
        imgsrc: imgsrc,
        id: id,
        favorited: false,
    }
}

function updateStatusOfLibrary() {
    numBooksTracker.textContent = library.numBooks;
    numReadBooksTracker.textContent = `${library.numReadBooks} / ${library.numBooks}`;
    numPagesTracker.textContent = library.numPages;
}

let defaultCollection = [
    Book("1984", "George Orwell","1949-06-08", 328, true, "https://covers.openlibrary.org/b/id/7222246-L.jpg", 7222246),
    Book("The Hobbit", "J.R.R. Tolkien", "1937-09-21", 310, true, "https://covers.openlibrary.org/b/id/6979861-L.jpg", 6979861),
    Book("The Outsiders", "S. E. Hinton", "1967-04-24", 192, false, "https://covers.openlibrary.org/b/olid/OL17063415M-L.jpg", "OL17063415M"),
    Book("Fahrenheit 451", "Ray Bradbury", "1953-10-19", 190, false, "https://covers.openlibrary.org/b/olid/OL31448957M-L.jpg", "OL31448957M"),
    Book("The Great Gatsby", "F. Scott Fitzgerald", "1925-04-10", 182, true, "https://covers.openlibrary.org/b/olid/OL26491064M-L.jpg", "OL26491064M"),
];

function loadDefaultCollection() {
    defaultCollection.forEach(book => {
        library.myBooks[book.title] = book;
        library.numBooks++;
        if (book.read) library.numReadBooks++;
        library.numPages += book.pages;
        addNewBookToDisplay(book);
    });
    updateStatusOfLibrary();
}


function saveLibrary() {
    localStorage.setItem("library", JSON.stringify(library));
}

function loadLibrary() {
    let savedLibrary = JSON.parse(localStorage.getItem("library"));
    if (savedLibrary) {
        library = savedLibrary;
        for (let id in library.myBooks) {
            addNewBookToDisplay(library.myBooks[id]);
        };
    } else {
        loadDefaultCollection();
    }
    updateStatusOfLibrary();
}

function getTodayDate() {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = (today.getMonth() + 1).toString().padStart(2, '0');
    const dd = (today.getDate()).toString().padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
}

// need this to display current day value on input form
document.getElementById("date").value = getTodayDate();

function createSVGElement(tag, attrs = {}) {
    const el = document.createElementNS("http://www.w3.org/2000/svg", tag);
    for (const [key, value] of Object.entries(attrs)) {
      el.setAttribute(key, value);
    }
    return el;
}

// creates a book card with book obj and appends it to the display
function addNewBookToDisplay(book) {
    // Create main container
    const bookContainer = document.createElement('div');
    bookContainer.classList.add('bookContainer');
    bookContainer.setAttribute('id', book.title);
  
    // Book cover image
    const img = document.createElement('img');
    img.src = book.imgsrc || 'assets/catpfp.jpg';
    img.alt = "Book Cover";
    img.classList.add('bookCover');
    bookContainer.appendChild(img);
  
    // Book info container
    const bookInfo = document.createElement('div');
    bookInfo.classList.add('bookInfo');
  
    const titleDiv = document.createElement('div');
    titleDiv.classList.add('bookCardLargeFont');
    titleDiv.textContent = book.title;
    bookInfo.appendChild(titleDiv);
  
    const authorDiv = document.createElement('div');
    authorDiv.classList.add('bookCardMedFont');
    authorDiv.innerHTML = `by <em>${book.author}</em>`;
    bookInfo.appendChild(authorDiv);
  
    const pagesDiv = document.createElement('div');
    pagesDiv.textContent = `${book.pages} Pages`;
    bookInfo.appendChild(pagesDiv);
  
    bookContainer.appendChild(bookInfo);
  
    // ---- Icon container ----
    const editBookContainer = document.createElement('div');
    editBookContainer.classList.add('editBookContainer');
  
    const editBook = document.createElement('div');
    editBook.classList.add('editBook');
    const trashBook = document.createElement('div');
    trashBook.classList.add('trashBook');
  
    // --- Edit Pen ---
    const svgPen = createSVGElement("svg", { class: "smallIcons", viewBox: "0 0 24 24" });
    const gPen = createSVGElement("g", {
      stroke: "currentColor", fill: "none",
      "stroke-linecap": "round", "stroke-linejoin": "round", "stroke-width": "2"
    });
    const pathPen = createSVGElement("path", { d: "M20,16v4a2,2,0,0,1-2,2H4a2,2,0,0,1-2-2V6A2,2,0,0,1,4,4H8" });
    const polygonPen = createSVGElement("polygon", { points: "12.5 15.8 22 6.2 17.8 2 8.3 11.5 8 16 12.5 15.8" });
    gPen.appendChild(pathPen);
    gPen.appendChild(polygonPen);
    svgPen.appendChild(gPen);
    svgPen.classList.add("editpen");
    editBook.appendChild(svgPen);
  
    // --- Heart ---
    const svgHeart = createSVGElement("svg", { class: "smallIcons", viewBox: "0 -0.5 32 32" });
    const pathHeart = createSVGElement("path", {
      d: "M128,893.682 L116,908 L104,893.623 C102.565,891.629 102,890.282 102,888.438 C102,884.999 104.455,881.904 108,881.875 C110.916,881.851 114.222,884.829 116,887.074 C117.731,884.908 121.084,881.875 124,881.875 C127.451,881.875 130,884.999 130,888.438 C130,890.282 129.553,891.729 128,893.682 Z",
      fill: "white",
      transform: "translate(-100 -880)",
      stroke: "currentColor",
      "stroke-width": 2.5,
    });
    svgHeart.appendChild(pathHeart);
    svgHeart.classList.add("heart");
    editBook.appendChild(svgHeart);
  
    // --- Checkmark ---
    const svgCheck = createSVGElement("svg", { class: "smallIcons", viewBox: "0 0 1920 1920" });
    const pathCheck = createSVGElement("path", {
      d: "M1743.858 267.012 710.747 1300.124 176.005 765.382 0 941.387l710.747 710.871 1209.24-1209.116z",
      fill: "currentColor",
    });
    svgCheck.appendChild(pathCheck);
    if (book.read) {
        svgCheck.classList.toggle("green");
    };
    svgCheck.classList.add("checkmark");
    editBook.appendChild(svgCheck);
  
    // --- Trash ---
    const svgTrash = createSVGElement("svg", { class: "smallIcons", viewBox: "0 0 32 32" });
    const path1 = createSVGElement("path", {
      d: "M22.68,29H9.32a3,3,0,0,1-3-2.56l-3-20A3,3,0,0,1,6.32,3H25.68a3,3,0,0,1,3,3.45l-3,20A3,3,0,0,1,22.68,29Z",
      fill: "white",
      stroke: "currentColor",
      "stroke-width": 2.5,
    });
    const path2 = createSVGElement("path", {
      d: "M12.61,20.39a1,1,0,0,1-.71-.29,1,1,0,0,1,0-1.41l6.79-6.79a1,1,0,1,1,1.41,1.41L13.31,20.1A1,1,0,0,1,12.61,20.39Z",
      fill: "currentColor"
    });
    const path3 = createSVGElement("path", {
      d: "M19.39,20.39a1,1,0,0,1-.7-.29L11.9,13.31a1,1,0,0,1,1.41-1.41l6.79,6.79a1,1,0,0,1,0,1.41A1,1,0,0,1,19.39,20.39Z",
      fill: "currentColor"
    });
    
    svgTrash.appendChild(path1);
    svgTrash.appendChild(path2);
    svgTrash.appendChild(path3);
    svgTrash.classList.add("trashcan");
    trashBook.appendChild(svgTrash);

    editBookContainer.appendChild(editBook);
    editBookContainer.appendChild(trashBook);
    bookContainer.appendChild(editBookContainer);
  
    document.getElementById("display").append(bookContainer);
}

// creates a new book object and updates our library information
function addBook(title, author, date, pages, read, imgsrc, id) {
    let newBook = new Book(title, author, date, +pages, read, imgsrc, id);
    library.myBooks[newBook.title] = newBook;
    library.numBooks++;
    if (read) library.numReadBooks++;
    library.numPages += newBook.pages;
    
    addNewBookToDisplay(newBook);
    updateStatusOfLibrary();
    saveLibrary();

}

function removeBook(id) {
    library.numBooks--;
    library.numPages -= library.myBooks[id].pages;
    if (library.myBooks[id].read) library.numReadBooks--;
    delete library.myBooks[id];
    updateStatusOfLibrary();
    saveLibrary();
    display.removeChild(document.getElementById(id));
    alert("Your book has been removed");
    hideModal(confirmDeleteModal);
};

function resetInputForm(bookForm) {
    bookForm.title.value = ""; 
    bookForm.author.value = ""; 
    bookForm.pages.value = ""; 
    bookForm.date.value = getTodayDate(); 
    bookForm.status.value = "unread"; 
    bookForm.status.selectedIndex = 0;
}

function getBookData(book) {
    return {
        title: book.title,
        author: book.author_name[0],
        cover: book.cover_i,
        imgsrc: `https://covers.openlibrary.org/b/id/${book.cover_i}-L.jpg` || "assets/catpfp.jpg",
    };
}

function getFormData(form) {
    return {
        date: form.date.value,
        pages: form.pages.value,
        read: (form.status.selectedIndex == 1),
    }
}

function bookExists(key) {
    return library.myBooks.hasOwnProperty(key);
}

function restoreBookFormInput(book, bookForm) {
    bookForm.title.value = book.title;
    bookForm.date.value = book.date;
    bookForm.author.value = book.author;
    bookForm.pages.value = book.pages;
    if (book.read) {
        bookForm.status.selectedIndex = 1;
    } else {
        bookForm.status.selectedIndex = 0;
    }
}

bookForm.addEventListener("submit", async e => {
    if (isEditingBook) {
        
    }
    e.preventDefault();
    let encodedBookTitle = encodeURIComponent(bookForm.title.value);
    let encodedBookAuthor = encodeURIComponent(bookForm.author.value);
    let fullApiURL = `${bookUrl}title=${encodedBookTitle}&author=${encodedBookAuthor}`;  

    try {
        let response = await fetch(fullApiURL);
        let data = await response.json();

        if (data.numFound === 0) {
            alert("Your book cannot be found. Please make sure you inputted the correct data.");
        } else {
            let book = data.docs[0];
            const { title, author, coverid, imgsrc } = getBookData(book);
            const { date, pages, read } = getFormData(bookForm);
            if (bookExists(title)) {
                alert("Your book already exists");
                return;
            }
            addBook(title, author, date, pages, read, imgsrc, coverid);
            alert("Your book has been added!");
            resetInputForm(bookForm);
        }
    } catch (error) {
        alert("There was an error trying to add your book.");
        console.log(error);
    }
});

// checks for which icon the user clicked on and responds accordingly
display.addEventListener("click", e => {    
    let target = e.target.closest(".smallIcons");
    console.log(target);
    if (!target) return;
    // grabs the container that the icon lives in
    // we also need to store the bookID that the container 
    // holds so we can grab the book from our library
    let bookContainer = target.closest(".bookContainer");
    confirmDeleteModal.dataset.bookID = bookContainer.id;
    let book = library.myBooks[bookContainer.id];

    if (target.classList.contains("heart")) {
            target.classList.toggle("red");
            book.favorited = !book.favorited;
    } else if (target.classList.contains("checkmark")) {
        if (target.classList.contains("green")) {
            library.numReadBooks--;
        } else {
            library.numReadBooks++;
        }
        updateStatusOfLibrary();
        saveLibrary();
        target.classList.toggle("green");
    } else if (target.classList.contains("trashcan")) {
        showModal(confirmDeleteModal);
    } else { // edit button was clicked
        isEditingBook = true;
        // sets the forms default values to the book we're editing
        restoreBookFormInput(book, bookForm);
        showModal(formModal);
    }
});

function hideModal(modal) {
    modal.classList.remove("show");
    setTimeout(() => {
        modal.style.display = "none";
    }, 500)
}

function showModal(modal) {
    if (isEditingBook) {
        formStateHeader.textContent = "Edit Your Book";
        formStateBtn.textContent = "Add Edits";
    } else {
        formStateHeader.textContent = "Add New Book";
        formStateBtn.textcontent = "Add Book";
    }
    modal.style.display = "flex";
    void modal.offsetWidth;
    modal.classList.add("show");
}

confirmDeleteBtn.addEventListener("click", e => {
    removeBook(confirmDeleteModal.dataset.bookID);
});

declineDeleteBtn.addEventListener("click", e => {
    hideModal(confirmDeleteModal);
})


closeFormBtn.addEventListener("click", e => {
    let form = document.getElementById("formModal");
    hideModal(formModal);
});

showFormBtn.addEventListener("click", e => {
    // this event only happens if we click add new book 
    // reset possible last settings (editingbook and input values)
    isEditingBook = false;
    resetInputForm(bookForm);
    showModal(formModal);
});

function fadeOutAndInDisplay(updateDisplay) {
    display.classList.add("hide");
    setTimeout(() => {
        updateDisplay();
        display.classList.remove("hide");
    }, 300)
}

allBooks.addEventListener("click", e => {
    fadeOutAndInDisplay(() => {
        let displayedBookContainers = document.querySelectorAll(".bookContainer");
        displayedBookContainers.forEach(container => {
            let book = library.myBooks[container.id];
            container.classList.remove("hideElement");
        })
    });
})

favoriteBooks.addEventListener("click", e => {
    fadeOutAndInDisplay(() => {
        let displayedBookContainers = document.querySelectorAll(".bookContainer");
        displayedBookContainers.forEach(container => {
            let book = library.myBooks[container.id];
            if (!book.favorited) {
                container.classList.add("hideElement");
            } else {
                container.classList.remove("hideElement");
            }
        });
    });
});

finishedBooks.addEventListener("click", e => {
    fadeOutAndInDisplay(() => {
        let displayedBookContainers = document.querySelectorAll(".bookContainer");
        displayedBookContainers.forEach(container => {
            let book = library.myBooks[container.id];
            if (book.read) {
                container.classList.remove("hideElement");
            } else {
                container.classList.add("hideElement");
            }
        })
    });
});

unfinishedBooks.addEventListener("click", e => {
    fadeOutAndInDisplay(() => {
        let displayedBookContainers = document.querySelectorAll(".bookContainer");
        displayedBookContainers.forEach(container => {
            let book = library.myBooks[container.id];
            if (book.read) {
                container.classList.add("hideElement");
            } else {
                container.classList.remove("hideElement");
            }
        });
    });
});

function orderDisplay() {
    if (orderOptions.value == "noFilter") {
        return;
    }

    let displayedBookContainers = Array.from(document.querySelectorAll(".bookContainer"));
    console.log(displayedBookContainers);

    if (orderAscendingOrDescending.value == "ascending") {
        if (orderOptions.value == "alphabetical") {
            displayedBookContainers.sort((container1, container2) => {
                let book1 = library.myBooks[container1.id];
                let book2 = library.myBooks[container2.id];
                return book1.title.localeCompare(book2.title);
            });
        } else if (orderOptions.value == "author") {
            displayedBookContainers.sort((container1, container2) => {
                let book1 = library.myBooks[container1.id];
                let book2 = library.myBooks[container2.id];
                return book1.author.localeCompare(book2.author);
            });
        } else if (orderOptions.value == "pages") {
            displayedBookContainers.sort((container1, container2) => {
                let book1 = library.myBooks[container1.id];
                let book2 = library.myBooks[container2.id];
                return book1.pages - book2.pages;
            });
        } else if (orderOptions.value == "year") {
            displayedBookContainers.sort((container1, container2) => {
                let book1 = library.myBooks[container1.id];
                let book2 = library.myBooks[container2.id];
                return book1.date.localeCompare(book2.date);
            });
        }
    } else {
        if (orderOptions.value == "alphabetical") {
            displayedBookContainers.sort((container1, container2) => {
                let book1 = library.myBooks[container1.id];
                let book2 = library.myBooks[container2.id];
                return book2.title.localeCompare(book1.title);
            });
        } else if (orderOptions.value == "author") {
            displayedBookContainers.sort((container1, container2) => {
                let book1 = library.myBooks[container1.id];
                let book2 = library.myBooks[container2.id];
                return book2.author.localeCompare(book1.author);
            });
        } else if (orderOptions.value == "pages") {
            displayedBookContainers.sort((container1, container2) => {
                let book1 = library.myBooks[container1.id];
                let book2 = library.myBooks[container2.id];
                return book2.pages - book1.pages;
            });
        } else if (orderOptions.value == "year") {
            displayedBookContainers.sort((container1, container2) => {
                let book1 = library.myBooks[container1.id];
                let book2 = library.myBooks[container2.id];
                return book2.date.localeCompare(book1.date);
            });
        }
    }

    displayedBookContainers.forEach(container => {
        display.append(container);
    })


}

orderOptions.addEventListener("input", orderDisplay);

orderAscendingOrDescending.addEventListener("input", orderDisplay);

document.addEventListener("DOMContentLoaded", loadLibrary);