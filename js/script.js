import { Movie } from './models/movie.js';

const movieUrl = "http://localhost:5000/api/film";
const studioUrl = "http://localhost:5000/api/filmstudio";
const triviaUrl = "http://localhost:5000/api/filmTrivia";
const rentedUrl = "http://localhost:5000/api/rentedFilm";
const usersUrl = "../Assets/users.json";

// Events and Buttons:
let loginButton = document.getElementById("login-button");
let registerButton = document.getElementById("register-button");
let homeButton = document.getElementById("home-button");
let moviesButton = document.getElementById("movies-button");
let studiosButton = document.getElementById("studios-button");
loginButton.addEventListener("click", () => login());
registerButton.addEventListener("click", () => register());
homeButton.addEventListener("click", () => home());
moviesButton.addEventListener("click", () => movies());
studiosButton.addEventListener("click", () => getStudios());

// Dynamic list of events and buttons:
// Global variables and resources:
var movies = [];
var movieContent = null;
var mainContent = document.getElementById("main-content");

// First default view is to show all movies.
getMovies();


function renderMovieContent() {
  mainContent.insertAdjacentElement("beforeend", movieContent);
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

async function login() {
  // Load login form
  const response = await fetch('../templates/login.html');
  const template = await response.text();

  let loginPage = document.createElement("div");
  loginPage.insertAdjacentHTML("beforeend", template);

  clearContent(mainContent);
  mainContent.insertAdjacentElement("beforeend", loginPage);

  let confirmButton = document.getElementById("confirm-login-button");
  confirmButton.addEventListener("click", () => confirmLogin());
}

async function confirmLogin() {
  // Load users from assets
  const response = await fetch('../Assets/users.json');
  const users = await response.json();


  let nameInput = document.getElementById("user-name");
  let passwordInput = document.getElementById("user-password");

  var loginUser = {
    "name": nameInput.value,
    "password": passwordInput.value
  }

  let matchingUser;

  users.forEach(user => {
    if (user.loginName === loginUser.name) {
      if (user.password === loginUser.password) {
        matchingUser = user;
      }
    }
  });

  if (matchingUser in window) {
    noUserMatch(loginUser);
  } else {
    await getUserStudio(matchingUser);
    localStorage.setItem("activeUser", JSON.stringify(matchingUser));
    console.log(matchingUser);

    // Create the logout button in navbarw
    let logoutButton = document.createElement("a");
    logoutButton.classList.add("button", "nav-item");
    logoutButton.setAttribute("id", "logout-button");
    logoutButton.innerText = "Logout";

    // Logout button event
    logoutButton.addEventListener("click", () => logout());

    let navAccountAccess = document.getElementById("account-access");
    clearContent(navAccountAccess);
    navAccountAccess.insertAdjacentElement(
      "beforeend",
      logoutButton
    );

    redirectToDashboard();
  }
}

async function getUserStudio(user) {
  if(user.studioId) {
    const studioResponse = await fetch(studioUrl);
    const studios = await studioResponse.json();

    studios.forEach(studio => {
      if(studio.id == user.studioId) {
        user.studio = studio;
      }
    });
    console.log(user);
  }
}

async function logout() {
  localStorage.removeItem("activeUser");
  // Reset navbar:
  const response = await fetch('../templates/navLoginDefault.html');
  const template = await response.text();
  let navbar = document.getElementById("account-access");
  navbar.innerHtml = template;
  // Redirect to home:
  home();
}

async function noUserMatch() {
  const response = await fetch('../templates/loginUserAlert.html');
  const template = await response.text();

  mainContent.insertAdjacentHTML("beforeend", template);
}

async function redirectToDashboard() {
  const response = await fetch('../templates/userDashboard.html');
  const template = await response.text();
  let activeUser = JSON.parse(localStorage.getItem("activeUser"));
  clearContent(mainContent);
  mainContent.innerHTML = template;
  console.log(template);
  console.log(localStorage.getItem("activeUser"));
}

async function register() {
  let response = await fetch('../templates/registerUser.html');
  let template = await response.text();

  clearContent(mainContent);
  mainContent.insertAdjacentHTML("beforeend", template);

  let confirmButton = document.getElementById("confirm-button");
  confirmButton.addEventListener("click", () => {
    const name = document.getElementById("user-name");
    const password = document.getElementById("user-password");
    const confirmPassword = document.getElementById("confirm-user-password");
    const email = document.getElementById("user-email");

    var activeUser = {
      "name": name.value,
      "password": (password.value === confirmPassword.value) ? password.value : null,
      "email": email.value,

      "studio": {
        "name": "",
        "location": "",
        "verified": false
      }
    };
    console.log(activeUser);
    confirmUser(activeUser);
  });
}

async function confirmUser(user) {
  let response = await fetch(usersUrl);
  let users = await response.json();

  let userExists = false;

  users.forEach(confirmedUser => {
    if (confirmedUser.loginName === user.name) {
      userExists = true;
    }
  });

  if (userExists) { userAlreadyExists(user); }
  else {
    localStorage.setItem("activeUser", JSON.stringify(user));
    console.log(localStorage.getItem("activeUser"));
  }
}

async function userAlreadyExists(user) {
  const response = await fetch("../templates/createUserAlert.html")
  const template = await response.text();

  let alertBox = document.createElement("div");
  alertBox.insertAdjacentHTML("beforeend", template);
  alertBox.insertAdjacentHTML("beforeend", `<p>${JSON.stringify(user)}</p>`);
  mainContent.insertAdjacentElement("beforeend", alertBox);
}

function home() {
  clearContent(mainContent);
  movies.forEach(movie => {
    movie.cardTriviaLimit = 2;
    movie.showDetailButton = true;
    movie.render(mainContent);
  });
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
  movieContent = document.createElement("section")
  movieContent.classList.add("movies");
  movies.forEach(movie => {
    movie.render(movieContent)
    movie.detailButton.addEventListener("click", () => getMovie(movie.id), false);
  });
  renderMovieContent();
};

async function getStudios() {
  const response = await fetch(studioUrl);
  const studios = await response.json();

  studios.forEach(studio => {
    console.log(studio.name);
  })
}

async function createStudio() {
  const response = await fetch('../templates/registerStudio.html');
  const template = await response.text();

  clearContent(mainContent);
  mainContent.insertAdjacentHTML("beforeend", template);
  let confirmStudioButton = getElementById("register-studio");
  confirmStudioButton.addEventListener("click", () => confirmStudio());
}

function confirmStudio() {
    
}

function getMovie(id) {
  console.log("GetMovie Id: " + id);
  console.log(movies);

  let movieFromId;
  movies.forEach(movie => {
    if(movie.id === id) {
      movieFromId = movie;
    }
  });
  movieFromId.cardTriviaLimit = 10;
  movieFromId.showDetailButton = false;
  clearContent(mainContent);
  movieFromId.render(mainContent);
}



  // // save user to users.json
  // const options = {
  //   method: 'POST',
  //   header: {
  //     'content-type': 'application/json',
  //   },
  //   body: JSON.stringify(user)
  //   };

  // response = await fetch(usersUrl, options);
  // return response;