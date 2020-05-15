import { Movie } from './models/movie.js'

var movieUrl = "http://localhost:5000/api/film";
var studioUrl = "http://localhost:5000/api/filmstudio";
var triviaUrl = "http://localhost:5000/api/filmTrivia";
var rentedUrl = "http://localhost:5000/api/rentedFilm";

console.log("Hello browser!");

var movies = [];

let mainContent = document.getElementById("main-content");

getMovies();

console.log(movies);

var content;
console.log(content);

function renderMainContent() {
  mainContent.insertAdjacentElement("beforeend", content);
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
  content = document.createElement("section")
  content.classList.add("movies");
  movies.forEach(movie => movie.render(content));

  renderMainContent();
};

function createStudioInput() {
  let inputContent = `
  <fieldset class="input-group">
    <legend>Register Studio</legend>
    <input for="name" type="text" placeholder="Name..." id="name">
    <input for="location" type="text" placeholder="Location..." id="location">
    <input for="password" type="password" placeholder="Password..." id="password">
    <button class="submit" id="create-studio">Register</button>
  </fieldset>
  `
}
