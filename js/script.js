import { Movie } from './models/movie.js';
import { Studio } from './models/studio.js';

const movieUrl = "http://localhost:5000/api/film";
const studioUrl = "http://localhost:5000/api/filmstudio";
const triviaUrl = "http://localhost:5000/api/filmTrivia";
const rentedUrl = "http://localhost:5000/api/rentedFilm";
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
    navAccountAccess.insertAdjacentElement(
      "beforeend",
      logoutButton
    );

    dashboard();
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
  <h1>Welcome to SFF movie franchise!</h1>
  <h3>Rent your movies here to be displayed at your studio</h3>
  <h3>You just have to create an account in the top right menu!</h3>
  `); 
}


function movieArchive() {
  clearContent(mainContent);
  movies.forEach(movie => {
    movie.cardTriviaLimit = 2;
    movie.showDetailButton = true;
    movie.render(mainContent);
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

  let registerStudioButton = document.getElementById("create-studio-button");
  let rentMovieButton = document.getElementById("rent-movie-button");
  let returnMovieButton = document.getElementById("return-movie-button");
  registerStudioButton.addEventListener("click", () => registerStudio());  
  rentMovieButton.addEventListener("click", () => rentMovie());
  returnMovieButton.addEventListener("click", () => returnMovie());
}


async function registerStudio() {
  const response = await fetch('../templates/registerStudio.html');
  const template = await response.text();

  clearContent(mainContent);
  mainContent.innerHTML = template;
  let confirmButton = document.getElementById("confirm-studio");
  confirmButton.addEventListener("click", () => confirmStudio());
}


async function confirmStudio() {
  let nameInput = document.getElementById("studio-name");
  let passwordInput = document.getElementById("studio-password");

  let studio = {
    "name": nameInput.value,
    "password": passwordInput.value,
    "verified": false
  };
  console.log(JSON.stringify(studio));
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(studio)
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


async function register() {
  let response = await fetch('../templates/registerUser.html');
  let template = await response.text();

  clearContent(mainContent);
  mainContent.insertAdjacentHTML("beforeend", template);

  let confirmUserButton = document.getElementById("confirm-button");
  confirmUserButton.addEventListener("click", () => {
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
    movies.forEach(movie => {
      movie.detailButton.addEventListener("click", () => getMovie(movie.id));
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
  if(user.studioId > 0) {
    const response = await fetch('../templates/rentMovie.html');
    const template = await response.text();
    
    clearContent(mainContent);
    mainContent.insertAdjacentHTML("beforeend", template);
    let movieSelect = document.getElementById("movie-select");
    movies.forEach(movie => {
      movieSelect.insertAdjacentHTML("beforeend", `<option value=${movie.id}>${movie.name}</option>`);
    });
    let confirmButton = document.getElementById("confirm-button");
    confirmButton.addEventListener("click", () => confirmMovieRent(user));
  } else {
    userHasNoStudio();
    return;
  } 
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

function userHasNoStudio() {
  clearContent(mainContent);
  mainContent.insertAdjacentHTML("afterbegin", "<h1>No Studio registered for user!</h1>");  
  mainContent.insertAdjacentHTML("beforeend", "<h2>Only users registered to a studio can rent movies!</h2>");  
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
    body: JSON.stringify(data);
  }
}
