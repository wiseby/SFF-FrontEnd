export class Movie {

  constructor(movie, trivias) {
    this.id = movie.id;
    this.name = movie.name;
    this.stock = movie.stock;

    this.trivias = trivias;

    this.html = document.createElement("section");
    this.html.classList.add("movies");
    
    this.html.insertAdjacentHTML("beforeend", `
    <div class="movie-card">
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
    </div>`);
  }

  render(parentElement) {
    console.log("rendering movie with is:" + this.id);
    parentElement.insertAdjacentElement("beforeend", this.html);
  }
}