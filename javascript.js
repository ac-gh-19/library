const bookUrl = "https://openlibrary.org/search.json?";
const coverUrl = "https://covers.openlibrary.org/b/";
const closeFormBtn = document.querySelector("#closeFormBtn");
const showFormBtn = document.querySelector("#showFormBtn");
const bookForm = document.querySelector("#bookForm");

let library = {
    myBooks: [],
    numBooks: 0,
    totalPages: 0,
    readBooks: 0,
    unreadBooks: 0,
}

async function getData() {
    let response = await fetch(bookUrl);
    let data = await response.json();
    console.log(data);
}

function getTodayDate() {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = (today.getMonth() + 1).toString().padStart(2, '0');
    const dd = (today.getDate()).toString().padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
}

document.getElementById("date").value = getTodayDate();

// getData();


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

function addBook(title, author, date, pages, read, imgsrc) {
    let newBook = new Book(title, author, date, pages, read, imgsrc);
    library.myBooks.push(newBook);
    library.numBooks++;
    
    addNewBookToDisplay(newBook);
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
            let title = book.title;
            let author = book.author_name[0];
            let date = bookForm.date.value;
            let pages = bookForm.pages.value;
            let read;
            if (bookForm.status.value == "Unread") {
                read = false;
            } else {
                read = true;
            }
            let cover = book.cover_i; 
            let imgsrc = `https://covers.openlibrary.org/b/id/${cover}-L.jpg`;
            addBook(title, author, date, pages, read, imgsrc);
            alert("Your book has been added!");
        }
    } catch (error) {
        console.log("Error finding book", error);
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
