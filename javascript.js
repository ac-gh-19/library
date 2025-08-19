const url = "https://openlibrary.org/search.json?q=test";

fetch(url)
    .then(response => response.json())
    .then(data => console.log(data))
    .catch(error => console.error('Error:', error));

const bookUrl = "https://openlibrary.org/search.json?";
const coverUrl = "https://covers.openlibrary.org/b/";
const closeFormBtn = document.querySelector("#closeFormBtn");
const showFormBtn = document.querySelector("#showFormBtn");
const bookForm = document.querySelector("#bookForm");

// keeps track of our collection of books to display info
let library = {
    myBooks: [],
    numBooks: 0,
    numPages: 0,
    numReadBooks: 0,
}

function Book(title, author, date, pages, read, imgsrc) {
    return {
        title: title,
        author: author,
        date: date,
        pages: pages,
        read: read,
        imgsrc: imgsrc,
    }
}

let defaultCollection = [
    Book("1984", "George Orwell", "1949-06-08", 328, true, "https://covers.openlibrary.org/b/id/7222246-L.jpg"),
    Book("The Hobbit", "J.R.R. Tolkien", "1937-09-21", 310, true, "https://covers.openlibrary.org/b/id/6979861-L.jpg"),
    Book("The Outsiders", "S. E. Hinton", "1967‑04‑24", 192, true, "https://covers.openlibrary.org/b/olid/OL17063415M-L.jpg"),
    Book("Fahrenheit 451", "Ray Bradbury", "1953‑10‑19", 190, true, "https://covers.openlibrary.org/b/olid/OL31448957M-L.jpg"),
    Book("The Great Gatsby", "F. Scott Fitzgerald", "1925‑04‑10", 182, true, "https://covers.openlibrary.org/b/olid/OL26491064M-L.jpg"),
];

function loadDefaultCollection() {
    defaultCollection.forEach(book => {
        library.myBooks.push(book);
        library.numBooks++;
        if (book.read) library.numReadBooks++;
        library.numPages += book.pages;
        addNewBookToDisplay(book);
    });
}

loadDefaultCollection();

// need this to display current day value on input form
function getTodayDate() {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = (today.getMonth() + 1).toString().padStart(2, '0');
    const dd = (today.getDate()).toString().padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
}

document.getElementById("date").value = getTodayDate();

// creates a book card with book obj and appends it to the display
function addNewBookToDisplay(book) {

    // Create main container
    const bookContainer = document.createElement('div');
    bookContainer.classList.add('bookContainer');

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

    // Edit and trash icons container
    const editBookContainer = document.createElement('div');
    editBookContainer.classList.add('editBookContainer');

    const editBook = document.createElement('div');
    editBook.classList.add('editBook');

    const icons = ['editPen.svg', 'heart.svg', 'checkmark.svg'];
    const alts = ['Edit', 'Heart', 'Check Mark'];

    icons.forEach((icon, index) => {
        const iconImg = document.createElement('img');
        iconImg.src = `assets/${icon}`;
        iconImg.alt = alts[index];
        iconImg.classList.add('smallIcons');
        editBook.appendChild(iconImg);
    });

    editBookContainer.appendChild(editBook);

    const trashBook = document.createElement('div');
    trashBook.classList.add('trashBook');

    const trashImg = document.createElement('img');
    trashImg.src = 'assets/trash.svg';
    trashImg.alt = 'Trash Can';
    trashImg.classList.add('smallIcons');

    trashBook.appendChild(trashImg);
    editBookContainer.appendChild(trashBook);
    bookContainer.appendChild(editBookContainer);

    document.getElementById("display").append(bookContainer);
}

// creates a new book object and updates our library information
function addBook(title, author, date, pages, read, imgsrc) {
    let newBook = new Book(title, author, date, pages, read, imgsrc);
    library.myBooks.push(newBook);
    library.numBooks++;
    if (read) library.numReadBooks++;
    library.numPages += newBook.pages;
    
    addNewBookToDisplay(newBook);
}

function resetInputForm() {
    bookForm.title.value = ""; 
    bookForm.author.value = ""; 
    bookForm.pages.value = ""; 
    bookForm.date.value = getTodayDate(); 
    bookForm.status.value = "Unread"; 
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
        read: (form.status.value == "Read"),
    }
}

bookForm.addEventListener("submit", async e => {
    e.preventDefault();
    let encodedBookTitle = encodeURIComponent(bookForm.title.value);
    let encodedBookAuthor = encodeURIComponent(bookForm.author.value);
    let fullURL = `${bookUrl}title=${encodedBookTitle}&author=${encodedBookAuthor}`;  

    try {
        let response = await fetch(fullURL);
        let data = await response.json();

        if (data.numFound === 0) {
            alert("Sorry! Your book cannot be found");
        } else {
            let book = data.docs[0];
            const { title, author, cover, imgsrc } = getBookData(book);
            const { date, pages, read } = getFormData(bookForm);
            addBook(title, author, date, pages, read, imgsrc);
            alert("Your book has been added!");
            resetInputForm();
        }
    } catch (error) {
        alert("There was an error trying to add the book.");
    }
});

function closeForm() {
    let form = document.getElementById("formModal");
    form.classList.remove("show");
    setTimeout(() => {
        form.style.display = "none";
    }, 500)
}

function showForm() {
    let form = document.getElementById("formModal");
    form.style.display = "flex";
    void form.offsetWidth;
    form.classList.add("show");
}

closeFormBtn.addEventListener("click", closeForm);
showFormBtn.addEventListener("click", showForm);
