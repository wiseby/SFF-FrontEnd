export class Movie {

  constructor(movie, trivias) {
    this.id = movie.id;
    this.name = movie.name;
    this.stock = movie.stock;
    this.cardTriviaLimit = 2;
    this.detailButton = document.createElement("a");
    this.detailButton.classList.add("button");
    this.detailButton.classList.add("button.success");
    this.detailButton.setAttribute("id", "movieCardButton-" + this.id);
    this.detailButton.innerHTML = "Details";

    this.trivias = trivias;

    this.html = document.createElement("div");
    this.html.classList.add("movie-card");
    
    // Base content:
    this.html.insertAdjacentHTML("beforeend", `
      <div class="movie-details">
        <h2>${movie.name}</h2>
        <h1>Stock: ${movie.stock}</h1>
      </div>
      <div class="movie-trivia" id="movie-trivia">
        <ol>
          ${this.getCardTrivias().map(item => `<li>${item.trivia}</li>`).join('')}
          ${(trivias.length > this.cardTriviaLimit) ? `<p>...</p>` : ""}
        </ol>
      </div>
      `);

      // Add a button
      this.html.insertAdjacentElement("beforeend", this.detailButton);
  }

  render = function(parentElement) {
    parentElement.insertAdjacentElement("beforeend", this.html);
  }

  getCardTrivias = function() {
    let triviaHTML = this.trivias.slice(0, 2);
    return triviaHTML;
  }
}
