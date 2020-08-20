var movieUrl = "https://localhost:5001/api/film";
var studioUrl = "https://localhost:5001/api/filmstudio";
var triviaUrl = "https://localhost:5001/api/filmTrivia";
var rentedUrl = "https://localhost:5001/api/rentedFilm";
var usersUrl = "/assets/users.json";

// Events and Buttons:
let navLoginButton = document.getElementById("navLogin-button");
let navRegisterButton = document.getElementById("navRegister-button");
let homeButton = document.getElementById("home-button");
let moviesButton = document.getElementById("movies-button");
let studiosButton = document.getElementById("studios-button");
let logButton = document.getElementById("studios-button");
navLoginButton.addEventListener("click", () => renderLogin());
navRegisterButton.addEventListener("click", () => renderRegister());
homeButton.addEventListener("click", () => home());
moviesButton.addEventListener("click", function() { console.log("movies button pressed!") });
studiosButton.addEventListener("click", function() { console.log("studios button pressed!") });
logButton.addEventListener("click", function() { console.log(movies) });

// Global variables and resources:
var movies = [];
var movieContent = null;
var mainContent = document.getElementById("main-content");
var loggedIn = false;

// First default view is to show all movies.
home();



function renderMovieContent() {
  mainContent.insertAdjacentElement("beforeend", movieContent);
}

function clearContent(element) {
  element.innerHTML = "";
}

async function renderLogin() {
  console.log("login feature");
  let contentResponse = await fetch("templates/login.html");
  let htmlContent = await contentResponse.text();


  let contentElement = document.createElement("div");
  contentElement.classList.add("form-group");
  contentElement.insertAdjacentHTML("afterbegin", htmlContent);
  
  clearContent(mainContent);
  mainContent.insertAdjacentElement('afterbegin', contentElement);
  
  let loginButton = document.getElementById("login-button");
  loginButton.addEventListener("click", () => login());
}

async function login() {
  let name = document.forms["login"]["name"].value;
  let password = document.forms["login"]["password"].value;
  let users = [];

  // Read users.json file to match name and password
  let response = await fetch(usersUrl);
  try {
    users = await response.json();
  } catch {
    alert("users failed to load");
    return;
  }

  users.forEach(user => {
    if (user.name == name && user.password == password) {
      localStorage.setItem("user", JSON.stringify(user));      
    } 
  });
  if (!loggedIn) {
    alert("No user matched");
  }

  // Redirect to dashboard

}

async function renderRegister() {
  console.log("register feature");
  let contentResponse = await fetch("templates/register.html");
  let htmlContent = await contentResponse.text();


  let contentElement = document.createElement("div");
  contentElement.classList.add("form-group");
  contentElement.insertAdjacentHTML("afterbegin", htmlContent);

  
  // Fetch studios
  let response = await fetch(studioUrl);
  let studios = await response.json();

  console.log(studios);
  
  clearContent(mainContent);
  mainContent.insertAdjacentElement('afterbegin', contentElement);
  
  let dropContent = "";
  let studiosDropdown = document.getElementById("studios");
  studios.forEach(studio => {
    dropContent += `<option value="${studio.name}">${studio.name}</option>`
  })
  let selectElement = document.getElementById("studios");
  selectElement.insertAdjacentHTML("afterbegin", dropContent);
  
  let registerButton = document.getElementById("register-button");
  registerButton.addEventListener("click", () => register());
}

async function register() {
  let name = document.forms["register"]["name"].value;
  let password = document.forms["register"]["password"].value;
  let studio = document.forms["register"]["studios"].value;

  let users = [];

  // Read users.json file to match name and password
  try {
    let response = await fetch(usersUrl);
    users = await response.json();
  } catch {
    alert("users failed to load");
    return;
  }

  users.forEach(user => {
    if (user.name == name) {
      alert("Username is already in use")
      return;
    }
  });

  let response = await fetch(usersUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ name: name, password: password, studio: studio})
  });

  // Redirect to dashboard

}

function home() {
  console.log("home feature");
  if (loggedIn) {

  }
  renderMovies();
}

async function renderMovies() {
  let templateRes = await fetch("templates/movie-card.html");
  let template = await templateRes.text();

  // Get movies:
  let movieRes = await fetch(movieUrl);
  let movies = await movieRes.json();

  // Get trivias:
  let triviaRes = await fetch(triviaUrl);
  let trivias = await triviaRes.json();

  movies.forEach(movie => {
    movie.trivias = [];
    trivias.forEach(trivia => {
      if (trivia.filmId == movie.id) {
        movie.trivias.push(trivia);
      }
    });
  });
  clearContent(mainContent);
  
  movies.forEach(movie => {
    let movieElement = document.createElement("div");
    movieElement.id = `movieid-${movie.id}`;
    movieElement.classList.add("movie-card");
    movieElement.insertAdjacentHTML("afterbegin", template);
    mainContent.insertAdjacentElement("afterbegin", movieElement);

    let triviaElement = movieElement.querySelector("#trivias");
    if (movie.trivias) {
      movie.trivias.forEach(trivia => {
        triviaElement.insertAdjacentHTML("beforeend", `<li>${trivia.trivia}</li>`);
      });
    }
    let nameElement = movieElement.querySelector("#name");
    nameElement.innerHTML = movie.name;
    let stockElement = movieElement.querySelector("#stock");
    stockElement.innerHTML = movie.stock;
  })


}

async function getMovies() {
  const movieResponse = await fetch(movieUrl);
  let fetchedMovies = await movieResponse.json();
  
  const triviaResponse = await fetch(triviaUrl);
  let fetchedTrivias = await triviaResponse.json();
};

function getStudios() {

}

function getTrivias(movieId) {

}

function getMovie(id) {
  let movieFromId = movies.forEach(movie => movie.id === id);
  let movieContent = movieFromId.render();
  clearContent(mainContent);
  mainContent,insertAdjacentElement("beforeend", movieContent);
}


