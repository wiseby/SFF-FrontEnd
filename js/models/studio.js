export class Studio {


  constructor(studio) {
    this.id = studio.id;
    this.name = studio.name;
    this.password = studio.password;
    this.verified = studio.verified;

    this.tableMode = false;

    this.toggleButton = document.createElement("a");
    this.toggleButton.classList.add("button");
    this.toggleButton.classList.add("button-success");
    this.toggleButton.setAttribute("id", "toggleButton-" + this.id);
    this.toggleButton.innerHTML = "Toggle Verified";

    this.html = document.createElement("div");
    this.html.classList.add("studio-card");
    this.tableHtml = document.createElement("tr")
  }

  render(parentElement) {
    if (this.tableMode) {
      this.buildTableRowTemplate();
      parentElement.insertAdjacentElement("beforeend", this.tableHtml);
    } else {
      this.buildTemplate();
      parentElement.insertAdjacentElement("beforeend", this.html);
    }
  }

  buildTemplate() {
    // Base content:
    this.html.innerHTML = "";
    this.html.insertAdjacentHTML("beforeend", `
      <li>
        <div class="studio-details">
          <h2>${this.name}</h2>
        </div>
        </li>
      `);
  }

  buildTableRowTemplate() {
    this.tableHtml.innerHTML = "";
    this.tableHtml.insertAdjacentHTML("beforeend", `
      <td>${this.name}</td>
      <td>
        <input type="checkbox" disabled ${this.verified ? "checked" : ""}>
      </td>
    `);

    let buttonCell = document.createElement("td");
    buttonCell.insertAdjacentElement("beforeend", this.toggleButton);
    this.tableHtml.insertAdjacentElement("beforeend", buttonCell);
  }

  resetViewModes() {
    this.tableMode = false;
  }
}