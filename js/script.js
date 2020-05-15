var movieUrl = "http://localhost:5000/api/film";
var studioUrl = "http://localhost:5000/api/filmstudio";
var triviaUrl = "http://localhost:5000/api/filmTrivia";
var rentedUrl = "http://localhost:5000/api/rentedFilm";

console.log("Hello browser!");

var movies = [];
var trivias = [];

var mainContent = document.getElementById("main-content");

getMovies();

function clearContent(element) {
  document.getElementById(element).innerHTML = "";
}

function renderMovies() {
  // All containers to be rendered in main content
  let movieCards = [];

  // Iterating through all movies
  movies.forEach(movie => {

    let movieTrivias = [];

    // Iterating and matching trivia.
    trivias.forEach(trivia => {
      if (trivia.filmId == movie.id) {
        movieTrivias.push(trivia);
      }
    })

    // Make the content for movie section
    let movieContent = createMovieCard(movie, movieTrivias);

    // Make container for card
    let movieSection = document.createElement("section");
    movieSection.classList.add("movies");
    movieSection.setAttribute("id", "movies");
    movieSection.insertAdjacentHTML("beforeend", movieContent);
    mainContent.insertAdjacentElement("beforeend", movieSection);
  });
}

// function getMovie(id) {
//   for (let i = 0; i < movies.length; i++) {
//     if (movies.)
//   }
// }

async function getMovies() {
  const movieResponse = await fetch(movieUrl);
  movies = await movieResponse.json();

  console.log(movies);

  const triviaResponse = await fetch(triviaUrl);
  trivias = await triviaResponse.json();

  renderMovies();
}

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
    
  `
}
