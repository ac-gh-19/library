const bookUrl = "https://openlibrary.org/search.json?";
const coverUrl = "https://covers.openlibrary.org/b/";
const closeFormBtn = document.querySelector("#closeFormBtn");
const showFormBtn = document.querySelector("#showFormBtn");


console.log(closeFormBtn);
console.log(document.getElementsByClassName("modal"));


function Book(title, author, year, pages, read = false) {
    return {
        title: title,
        author: author,
        year: year,
        pages: pages,
        read: read,
    }
}

let input = "the lord of the rings";

async function getBookInfo(userInput) {
    let encodedUserInput = encodeURIComponent(userInput);
    let response = await fetch(bookUrl + "q=" + encodedUserInput);
    let data = await response.json();

    console.log(data);
}

getBookInfo(input);

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