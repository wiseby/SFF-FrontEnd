import { Movie } from './models/movie.js'
import { Studio } from './models/studio.js'
import { Forms }

var movieUrl = "https://localhost:5002/api/film";
var studioUrl = "https://localhost:5002/api/filmstudio";
var triviaUrl = "https://localhost:5002/api/filmTrivia";
var rentedUrl = "https://localhost:5002/api/rentedFilm";

// Events and Buttons:
let loginButton = document.getElementById("login-button");
let registerButton = document.getElementById("register-button");
let homeButton = document.getElementById("home-button");
let moviesButton = document.getElementById("movies-button");
let studiosButton = document.getElementById("studios-button");
let logButton = document.getElementById("studios-button");
loginButton.addEventListener("click", function() { console.log("login button pressed!") });
registerButton.addEventListener("click", function() { console.log("register button pressed!") });
homeButton.addEventListener("click", function() { console.log("home button pressed!") });
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


function sleep(milliseconds) {
  const date = Date.now();
  let currentDate = null;
  do {
    currentDate = Date.now();
  } while (currentDate - date < milliseconds);
}


function clearContent(element) {
  element.innerHTML = "";
}

function login() {
  // Load login form
  const response = await fetch('../templates/login.html');
  const template = await response.text();

  let loginPage = document.createElement("div");
  loginPage.insertAdjacentHTML("beforeend", template);

  clearContent(mainContent);
  mainContent.insertAdjacentElement("beforeend", loginPage);

  let confirmLoginButton = document.getElementById("confirm-login-button");
  confirmLoginButton.addEventListener("click", () => confirmLogin());
}

function register() {

}

function home() {

}


async function getMovies() {
  const movieResponse = await fetch(movieUrl);
  let fetchedMovies = await movieResponse.json();
  
  const triviaResponse = await fetch(triviaUrl);
  let fetchedTrivias = await triviaResponse.json();
  
  await fetchedMovies.forEach(movie => {
    let trivias = [];
    fetchedTrivias.forEach(item => {
      if (item.filmId == movie.id) {
        trivias.push(item);
      }
    });
    let newMovie = new Movie(movie, trivias);
    movies.push(newMovie);
  });
  movieContent = document.createElement("section")
  movieContent.classList.add("movies");
  movies.forEach(movie => {
    movie.render(movieContent)
    movie.detailButton.addEventListener("click", () => getMovie(movie.id), false);
  });
  renderMovieContent();
};

function getStudios() {

}

function getMovie(id) {
  let movieFromId = movies.forEach(movie => movie.id === id);
  let movieContent = movieFromId.render();
  clearContent(mainContent);
  mainContent,insertAdjacentElement("beforeend", movieContent);
}


