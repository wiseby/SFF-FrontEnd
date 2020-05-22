export class Studio {


  constructor(studio) {
    this.name = studio.name;
    this.location = studio.location;
    this.verified = studio.verified;

    this.html = document.createElement("div");
    this.html.classList.add("studio-card");
  }

  render = function(parentElement) {
    this.buildTemplate();
    parentElement.insertAdjacentElement("beforeend", this.html);
  }

  buildTemplate = function() {
    
    // Base content:
    this.html.insertAdjacentHTML("beforeend", `
      <div class="studio-details">
        <h2>${this.name}</h2>
        <h1>Location: ${this.location}</h1>
      </div>
      `);
  }
}