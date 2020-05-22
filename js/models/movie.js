export class Movie {

  constructor(movie, trivias) {
    this.id = movie.id;
    this.name = movie.name;
    this.stock = movie.stock;
    this.cardTriviaLimit = 2;
    this.showDetailButton = true;
    this.detailButton = document.createElement("a");
    this.detailButton.classList.add("button");
    this.detailButton.classList.add("button.success");
    this.detailButton.setAttribute("id", "movieCardButton-" + this.id);
    this.detailButton.innerHTML = "Details";

    this.trivias = trivias;

    this.html = document.createElement("div");
    this.html.classList.add("movie-card");
  }

  render = function(parentElement) {
    this.buildTemplate();
    parentElement.insertAdjacentElement("beforeend", this.html);
    if(this.showDetailButton) {
      // Add a button
      this.html.insertAdjacentElement("beforeend", this.detailButton);
    }

  }

  buildTemplate = function() {
    
    // Base content:
    this.html.innerHTML = "";
    this.html.insertAdjacentHTML("beforeend", `
      <div class="movie-details">
        <h2>${this.name}</h2>
        <h1>Stock: ${this.stock}</h1>
      </div>
      <div class="movie-trivia" id="movie-trivia">
        <ol>
          ${this.getCardTrivias().map(item => `<li>${item.trivia}</li>`).join('')}
          ${(this.trivias.length > this.cardTriviaLimit) ? `<p>...</p>` : ""}
        </ol>
      </div>
      `);
  }

  getCardTrivias = function() {
    let triviaHTML = this.trivias.slice(0, this.cardTriviaLimit);
    return triviaHTML;
  }
}
