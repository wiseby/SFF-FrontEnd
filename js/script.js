import { Movie } from './models/movie.js';
import { Studio } from './models/studio.js';

const movieUrl = "https://localhost:5001/api/film";
const studioUrl = "https://localhost:5001/api/filmstudio";
const triviaUrl = "https://localhost:5001/api/filmTrivia";
const rentedUrl = "https://localhost:5001/api/rentedFilm";
const usersUrl = "../Assets/users.json";

// Events and Buttons:
let homeButton = document.getElementById("home-button");
let moviesButton = document.getElementById("movies-button");
let studiosButton = document.getElementById("studios-button");
homeButton.addEventListener("click", () => homeView());
moviesButton.addEventListener("click", () => movieArchive());
studiosButton.addEventListener("click", () => studioArchive());

// Navbar reset for login/register:
resetAccountAccess();

// Global variables and resources:
var movies = [];
var studios = [];
var mainContent = document.getElementById("main-content");

// Load data from server:
getMovies();
getStudios();
// First default view is to show all movies.
homeView();

async function resetAccountAccess() {  
  
  // Reset navbar:
  const response = await fetch('../templates/navLoginDefault.html');
  const template = await response.text();
  let navbar = document.getElementById("account-access");
  navbar.innerHTML = template;
  // Reset events:
  let loginButton = document.getElementById("login-button");
  let registerButton = document.getElementById("register-button");
  loginButton.addEventListener("click", () => login());
  registerButton.addEventListener("click", () => register());
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

  let confirmLoginButton = document.getElementById("confirm-login-button");
  confirmLoginButton.addEventListener("click", () => confirmLogin());
}


async function confirmLogin() {
  // Load users from assets
  const response = await fetch(studioUrl);
  const users = await response.json();


  let nameInput = document.getElementById("user-name");
  let passwordInput = document.getElementById("user-password");

  var loginUser = {
    "name": nameInput.value,
    "password": passwordInput.value
  }

  let matchingUser;

  users.forEach(user => {
    if (user.name === loginUser.name && user.password === loginUser.password) {
      matchingUser = user;
    }
  });

  if (matchingUser in window) {
    noUserMatch(loginUser);
  } else {
    localStorage.setItem("activeUser", JSON.stringify(matchingUser));
    console.log(matchingUser);

    // Create the logout button in navbar
    let logoutButton = document.createElement("a");
    logoutButton.classList.add("button", "nav-item");
    logoutButton.setAttribute("id", "logout-button");
    logoutButton.innerText = "Logout";

    // Dashboard button
    let dashboardButton = document.createElement("a");
    dashboardButton.classList.add("button", "nav-item");
    dashboardButton.setAttribute("id", "dashboard-button");
    dashboardButton.innerText = "Dashboard";

    // button events
    logoutButton.addEventListener("click", () => logout());
    dashboardButton.addEventListener("click", () => dashboard());

    let navAccountAccess = document.getElementById("account-access");
    clearContent(navAccountAccess);
    navAccountAccess.insertAdjacentElement(
      "beforeend",
      dashboardButton
    );
    
    navAccountAccess.insertAdjacentElement("beforeend", logoutButton);

    dashboard();
  }
}

function logout() {
  localStorage.removeItem("activeUser");
  resetAccountAccess();
  // Redirect to home:
  homeView();
}


async function noUserMatch() {
  const response = await fetch('../templates/loginUserAlert.html');
  const template = await response.text();

  mainContent.insertAdjacentHTML("beforeend", template);
}


function homeView() {
  clearContent(mainContent);
  mainContent.insertAdjacentHTML('beforeend', `
  <div class="container">
    <h1>Welcome to SFF movie franchise!</h1>
    <h3>Rent your movies here to be displayed at your studio</h3>
    <h3>You just have to create an account in the top right menu!</h3>
  </div>
  `); 
}


async function movieArchive() {
  let user = JSON.parse(localStorage.getItem("activeUser"));
  let rentedMovies = await getRentedMovies(user);
  clearContent(mainContent);
  let showRent = (user?.verified);
  
  movies.forEach(movie => {
    rentedMovies.forEach(rented => { 
      if (rented.studioId === user.id && rented.filmId === movie.id) { 
        movie.showReturnButton = true;
      }
    });

    movie.cardTriviaLimit = 2;
    movie.showRentButton = showRent;
    movie.render(mainContent);
    movie.resetButtons();
  });
}


function studioArchive() {
  clearContent(mainContent);
  studios.forEach(studio => {
    studio.render(mainContent);
  });
}


async function dashboard() {
  const response = await fetch('../templates/userDashboard.html');
  const template = await response.text();
  let activeUser = JSON.parse(localStorage.getItem("activeUser"));
  clearContent(mainContent);
  mainContent.innerHTML = template;
}


async function register() {
  let response = await fetch('../templates/registerStudio.html');
  let template = await response.text();

  clearContent(mainContent);
  mainContent.insertAdjacentHTML("beforeend", template);

  let confirmUserButton = document.getElementById("confirm-studio");
  confirmUserButton.addEventListener("click", () => {
    const name = document.getElementById("studio-name");
    const password = document.getElementById("studio-password");
    const confirmPassword = document.getElementById("confirm-studio-password");
    const email = document.getElementById("user-email");

    var activeUser = {
      "name": name.value,
      "password": (password.value === confirmPassword.value) ? password.value : null,
      "verified": false
      }
    confirmUser(activeUser);
  });
}


async function confirmUser(user) {
  let response = await fetch(studioUrl);
  let users = await response.json();

  let userExists = false;

  users.forEach(confirmedUser => {
    if (confirmedUser.name === user.name) {
      userExists = true;
    }
  });

  if (userExists) { userAlreadyExists(user); }
  else {
    localStorage.setItem("activeUser", JSON.stringify(user));
    
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(user)
    };
  
    const response = await fetch(studioUrl, options);
    const data = await response.json();
    console.log(data);
    if(response.status == 201) {
      dashboard();
  
    } else {
      // Return error message
    }
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


async function getMovies() {

  const movieResponse = await fetch(movieUrl);
  let fetchedMovies = await movieResponse.json();

  const triviaResponse = await fetch(triviaUrl);
  let fetchedTrivias = await triviaResponse.json();

  await fetchedMovies.forEach(movie => {
    let trivias = [];
    fetchedTrivias.forEach(trivia => {
      if (trivia.filmId === movie.id) {
        trivias.push(trivia);
      }
    });
    let newMovie = new Movie(movie, trivias);
    movies.push(newMovie);
    });
    movies.forEach(movie => {
      movie.detailButton.addEventListener("click", () => getMovie(movie.id));
      movie.rentButton.addEventListener("click", () => rentMovie(movie.id));
      movie.returnButton.addEventListener("click", () => returnMovie(movie.id));
  })
}


function getMovie(id) {

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


async function getStudios() {
  const response = await fetch(studioUrl);
  let fetchedStudios = await response.json();

  await fetchedStudios.forEach(studio => {
    let newStudio = new Studio(studio);
    studios.push(newStudio);
  });
}


async function rentMovie() {
  let user = JSON.parse(localStorage.getItem("activeUser"));
  if (user.verified) {

  }
    
  clearContent(mainContent);
  
}

async function confirmMovieRent(user) {
  let rentMovie = document.getElementById("movie-select").value;
  console.log("Movie select value: " + rentMovie);
  let movieAvailable = false;
  movies.forEach(movie => {
    if(movie.id == rentMovie && movie.stock > 0) {
      movieAvailable = true;
    }
  })
  if(!movieAvailable) {
    movieNotAvailable();
    return;
  }
  const data = {
    "filmId": Number(rentMovie),
    "studioId": user.studioId
  };

  console.log("data: " + JSON.stringify(data));

  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  };

  const response = await fetch(rentedUrl, options);
  const result = await response.json();

  movies = [];
  getMovies();


  console.log("Movie successfully rented!!!");
  console.log(result);

}

function movieNotAvailable() {
  clearContent(mainContent);
  mainContent.insertAdjacentHTML("beforeend", "<h>Movie stock 0!!!</h>");
}


async function returnMovie() {
  let user = JSON.parse(localStorage.getItem("activeUser"));
  let studioRents = [];  
  const response = await fetch(rentedUrl);
  const result = await response.json();

  result.forEach(rent => {
    if(rent.studioId == user.studioId && rent.returned == false) {
      studioRents.push(rent);
    }
  });

  if(studioRents.length < 1) {
    clearContent(mainContent);
    mainContent.insertAdjacentHTML("beforeend", "<h2>No returns available for studio!</h2>");
  } else {
    let movieSelect = document.getElementById("movie-select");
    studioRents.forEach(rent => {
      movies.forEach(movie => {
        if(rent.filmId == movie) {
          movieSelect.insertAdjacentHTML("beforeend", `<option value="${rent.id}">${movie.name}</option>`);
        }
      });
    });
    let confirmButton = document.getElementById("confirm-button");
    confirmButton.addEventListener("click", () => confirmReturn(user));
  }  
}


function confirmReturn(user) {
  let rentId = document.getElementById("movie-select").value;
  
  const data = {
    "id": rentId,
    "returned": true 
  };

  const options = {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  }
}

async function getRentedMovies(user) {
  let response = await fetch(rentedUrl);
  let rentedMovies = await response.json();

  let usersRents = [];

  rentedMovies.forEach(movie => {
    if (movie.studioId === user?.id) {
      usersRents.push(movie);
    }
  });
  return usersRents;
}
