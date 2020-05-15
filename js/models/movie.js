export class Movie {

  constructor(movie, trivias) {
    this.id = movie.id;
    this.name = movie.name;
    this.stock = movie.stock;

    this.trivias = trivias;

    this.html = document.createElement("div");
    this.html.classList.add("movie-card");
    
    this.html.insertAdjacentHTML("beforeend", `
      <div class="movie-details">
        <h2>${movie.name}</h2>
        <h1>Stock: ${movie.stock}</h1>
      </div>
      <div class="movie-trivia" id="movie-trivia">
        <ol>
        ${this.trivias.map(item => `<li>${item.trivia}</li>`)}
        </ol>
      </div>
      <button onclick=getMovie(${this.id}) class="button-success">Details</button>
      `);
  }

  render = function(parentElement) {
    console.log("rendering movie with id:" + this.id);
    parentElement.insertAdjacentElement("beforeend", this.html);
  }
}