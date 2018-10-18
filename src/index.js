// It might be a good idea to add event listener to make sure this file
// only runs after the DOM has finshed loading.

document.addEventListener("DOMContentLoaded", () => {
  getData();
  document.addEventListener("click", () => {
    if (event.target.className === "btn-success") {
      console.log("stuff");
      id = parseInt(event.target.parentElement.parentElement.id);
      fetch(`http://localhost:3000/quotes/${id}`)
        .then(resp => resp.json())
        .then(quote => allTogetherLikes(quote));
    } else if (event.target.className === "btn-danger") {
      let id = parseInt(event.target.parentElement.parentElement.id);
      deleteQuote(id);
      event.target.parentElement.parentElement.innerHTML = "";
    } else if (event.target.className === "btn btn-primary") {
      event.preventDefault();
      newQuote();
    }
  });
});

// ---------------------------------------------------------------------
function getData() {
  fetch(`http://localhost:3000/quotes`)
    .then(resp => resp.json())
    .then(quotes => quotes.forEach(quote => displayQuotes(quote)));
}

function displayQuotes(quote) {
  let add = document.getElementById("quotes");
  add.innerHTML += `<lu id="${quote.id}" class='quote-card'>
    <blockquote class="blockquote">
      <p class="mb-0">${quote.quote}</p>
      <footer class="blockquote-footer">${quote.author}</footer>
      <br>
      <button data-likes="${quote.likes}"class='btn-success'>Likes: 
      ${quote.likes}</button>
      <button class='btn-danger'>Delete</button>
    </blockquote>
  </lu>`;
}

// ---------------------------------------------------------------------
function allTogetherLikes(quote) {
  oneUp(quote.id, quote.likes);
  likesUpdate(quote.id, quote.likes);
}
function oneUp(id, likes) {
  likesobj = {
    likes: likes + 1
  };
  fetch(`http://localhost:3000/quotes/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json"
    },
    body: JSON.stringify(likesobj)
  });
}

function likesUpdate(id, likes) {
  upOne = likes + 1;
  newlikes = document.getElementById(`${id}`);
  newlikes.childNodes[1].childNodes[7].innerText = `Likes: ${upOne}`;
}
// ---------------------------------------------------------------------

function deleteQuote(id) {
  fetch(`http://localhost:3000/quotes/${id}`, {
    method: "DELETE"
  }).then(response => response.json());
}

// ---------------------------------------------------------------------

function newQuote() {
  addForm = document.getElementById("new-quote-form");
  quote = addForm.childNodes[1].childNodes[3].value;
  author = addForm.childNodes[3].childNodes[3].value;

  data = {
    quote: addForm.childNodes[1].childNodes[3].value,
    author: addForm.childNodes[3].childNodes[3].value,
    likes: 0
  };
  postNewQuote(data);
}

function postNewQuote() {
  return fetch(`http://localhost:3000/quotes`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json"
    },
    body: JSON.stringify(data)
  })
    .then(addNewPostToPage)
    .then(clear());
}

function addNewPostToPage() {
  fetch(`http://localhost:3000/quotes`)
    .then(resp => resp.json())
    .then(quotes => displayNewQuote(quotes.slice(quotes.length - 1)));
}

function displayNewQuote(quote) {
  let add = document.getElementById("quotes");
  add.innerHTML += `<lu id="${quote[0].id}" class='quote-card'>
    <blockquote class="blockquote">
      <p class="mb-0">${quote[0].quote}</p>
      <footer class="blockquote-footer">${quote[0].author}</footer>
      <br>
      <button data-likes="${quote[0].likes}"class='btn-success'>Likes: 
      ${quote[0].likes}</button>
      <button class='btn-danger'>Delete</button>
    </blockquote>
  </lu>`;
}

function clear() {
  addForm = document.getElementById("new-quote-form");
  addForm.childNodes[1].childNodes[3].value = "";
  addForm.childNodes[3].childNodes[3].value = "";
}

// ---------------------------------------------------------------------
