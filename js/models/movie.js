export class Movie {

  
  constructor(movie, trivias) {
    this.id = movie.id;
    this.name = movie.name;
    this.stock = movie.stock;
    
    this.cardTriviaLimit = 2;
    this.showRentButton = false;
    this.showReturnButton = false;
    this.showDetailButton = true;
    
    this.rentButton;
    this.returnButton;
    this.detailButton;
    this.html = document.createElement("div");
    this.html.classList.add("movie-card");
    this.trivias = trivias;
    this.init();
  }
  
  init() {
    this.rentButton = document.createElement("a");
    this.rentButton.classList.add("button");
    this.rentButton.classList.add("button-success");
    this.rentButton.setAttribute("id", "rentButton-" + this.id);
    this.rentButton.innerHTML = "Rent";
    
    this.returnButton = document.createElement("a");
    this.returnButton.classList.add("button");
    this.returnButton.classList.add("button-success");
    this.returnButton.setAttribute("id", "returnButton-" + this.id);
    this.returnButton.innerHTML = "Return";
    
    this.detailButton = document.createElement("a");
    this.detailButton.classList.add("button");
    this.detailButton.classList.add("button-success");
    this.detailButton.setAttribute("id", "DetailsButton-" + this.id);
    this.detailButton.innerHTML = "Details";
  }

  render(parentElement) {
    this.buildTemplate();
    parentElement.insertAdjacentElement("beforeend", this.html);
    if(this.showDetailButton) {
      this.html.insertAdjacentElement("beforeend", this.detailButton);
    }
    if (this.showRentButton) {
      this.html.insertAdjacentElement("beforeend", this.rentButton);
    }
    if (this.showReturnButton) {
      this.html.insertAdjacentElement("beforeend", this.returnButton);
    }

  }

  buildTemplate() {
    
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

  resetButtons() {
    console.log("resetting buttons");
    this.showRentButton = false;
    this.showReturnButton = false;
    this.showDetailsButton = true;
  }
}
