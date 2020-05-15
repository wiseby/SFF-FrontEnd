import { Movie } from './models/movie.js'

var movieUrl = "http://localhost:5000/api/film";
var studioUrl = "http://localhost:5000/api/filmstudio";
var triviaUrl = "http://localhost:5000/api/filmTrivia";
var rentedUrl = "http://localhost:5000/api/rentedFilm";

console.log("Hello browser!");

var movies = [];

var mainContent = document.getElementById("main-content");

getMovies();
console.log(movies);
clearContent(mainContent);

var content;

for (let i = 0; i < movies.length; i++) {
  movies[i].render(content);
  console.log(content);
}

movies.forEach(movie => movie.render(content));

console.log(content);

mainContent.insertAdjacentElement("beforeend", content);

function clearContent(element) {
  element.innerHTML = "";
}

async function getMovies() {
  const movieResponse = await fetch(movieUrl);
  let fetchedMovies = await movieResponse.json();

  const triviaResponse = await fetch(triviaUrl);
  let fetchedTrivias = await triviaResponse.json();

  fetchedMovies.forEach(movie => {
    let trivias = [];
    fetchedTrivias.forEach(item => {
      if (item.filmId == movie.id) {
        trivias.push(item);
      }
    });
    let newMovie = new Movie(movie, trivias);
    movies.push(newMovie);
  });
};


function createMovieCard(movie, trivias, location) {
  let movieContent = `
    <div class="movie-card">
      <div class="movie-details">
        <h2>${movie.name}</h2>
        <h1>Stock: ${movie.stock}</h1>
      </div>
      <div class="movie-trivia" id="movie-trivia">
        <ol>
        ${trivias.map(item => `<li>${item.trivia}</li>`)}
        </ol>
      </div>
      <button onclick=getMovie(${movie.id}) class="button-success">Details</button>
    </div>`;
  return movieContent;
}

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
