var movieUrl = "http://localhost:5000/api/film";
var studioUrl = "http://localhost:5000/api/filmstudio";
var triviaUrl = "http://localhost:5000/api/filmTrivia";
var rentedUrl = "http://localhost:5000/api/rentedFilm";

// Events and Buttons:
let loginButton = document.getElementById("login-button");
let registerButton = document.getElementById("register-button");
let homeButton = document.getElementById("home-button");
let moviesButton = document.getElementById("movies-button");
let studiosButton = document.getElementById("studios-button");
let logButton = document.getElementById("studios-button");
loginButton.addEventListener("click", login());
registerButton.addEventListener("click", register());
homeButton.addEventListener("click", home());
moviesButton.addEventListener("click", function() { console.log("movies button pressed!") });
studiosButton.addEventListener("click", function() { console.log("studios button pressed!") });
logButton.addEventListener("click", function() { console.log(movies) });

// Global variables and resources:
var movies = [];
var movieContent = null;
var mainContent = document.getElementById("main-content");

// First default view is to show all movies.
getMovies();



function renderMovieContent() {
  mainContent.insertAdjacentElement("beforeend", movieContent);
}

function clearContent(element) {
  element.innerHTML = "";
}

function login() {
  console.log("login feature");
}

function register() {
  console.log("register feature");
}

function home() {
  console.log("home feature");
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


