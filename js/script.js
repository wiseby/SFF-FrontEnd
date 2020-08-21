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

// Resetting user in localStorage:
localStorage.removeItem("activeUser");

// Global variables and resources:
var movies = [];
var studios = [];
var mainContent = document.getElementById("main-content");

// Load data from server:
getMovies().then(() => movieArchive());

getStudios();
// First default view is to show all movies.

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
  // Redirect to movieArchive:
  movieArchive();
}


async function noUserMatch() {
  const response = await fetch('../templates/loginUserAlert.html');
  const template = await response.text();

  mainContent.insertAdjacentHTML("beforeend", template);
}


async function homeView() {
  let templateRes = await fetch("../templates/home.html");
  let template = await templateRes.text();
  clearContent(mainContent);
  mainContent.insertAdjacentHTML("afterbegin", template); 
}


async function movieArchive() {
  let user = JSON.parse(localStorage.getItem("activeUser"));
  let rentedMovies = await getRentedMovies(user);
  clearContent(mainContent);
  let showRent = (user?.verified);
  
  movies.forEach(movie => {
    movie.cardTriviaLimit = 2;
    movie.showRentButton = showRent;
    
    rentedMovies.forEach(rented => { 
      if (rented.studioId === user.id 
        && rented.filmId === movie.id 
        && !rented.returned) { 
        movie.showReturnButton = true;
        movie.showRentButton = false;
      }
    });

    movie.render(mainContent);
    movie.resetButtons();
  });
}


function studioArchive() {
  let studioList = document.createElement("ul");
  studioList.classList.add("row");
  studios.forEach(studio => {
    studio.render(studioList);
  });
  clearContent(mainContent);
  mainContent.insertAdjacentHTML("afterbegin", "<h1>List of studios</h1>");
  mainContent.insertAdjacentElement("beforeend", studioList);
}


async function dashboard() {
  const response = await fetch('../templates/userDashboard.html');
  const template = await response.text();
  let rents = await getUserRents();
  let activeUser = JSON.parse(localStorage.getItem("activeUser"));
  clearContent(mainContent);
  mainContent.innerHTML = template;
  let movieRentsElement = document.getElementById("rented-movies");
  rents.forEach(movie => {
    movie.showReturnButton = true;
    movie.render(movieRentsElement);
  })

  let adminButton = document.getElementById("admin");
  adminButton.addEventListener("click", () => adminDashboard());
}


async function register() {
  let response = await fetch('../templates/registerStudio.html');
  let template = await response.text();

  clearContent(mainContent);
  mainContent.insertAdjacentHTML("beforeend", template);

  let confirmUserButton = document.getElementById("confirm-studio");
  confirmUserButton.addEventListener("click", () => {
    confirmUser();
  });
}

async function adminDashboard() {
  let templateRes = await fetch("../templates/adminDashboard.html");
  let template = await templateRes.text();

  studios = [];
  await getStudios();

  clearContent(mainContent);
  mainContent.innerHTML = template;

  // Display all studios in table with toogle verified button:
  let tableBody = document.getElementsByTagName("tbody")[0];

  studios.forEach(studio => {
    studio.tableMode = true;
    studio.render(tableBody);
    studio.resetViewModes();
    studio.toggleButton.addEventListener("click", () => changeStudioStatus(studio));
  });
}

async function changeStudioStatus(studio) {
  const data = {
    id: studio.id,
    name: studio.name,
    password: studio.password,
    verified: !studio.verified
  }

  const options = {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  };

  let studioRes = await fetch(`${studioUrl}/${studio.id}`, options);

  studios = [];
  getStudios().then(() => adminDashboard());
}


async function confirmUser() {    
  let name = document.getElementById("studio-name");
  let password = document.getElementById("studio-password");
  let confirmPassword = document.getElementById("confirm-studio-password");

  let user = {
    "name": name.value,
    "password": (password.value === confirmPassword.value) ? password.value : null,
    "verified": false
    }

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
    
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(user)
    };
    try {
      let response = await fetch(studioUrl, options);
      localStorage.setItem("activeUser", JSON.stringify(user));
      dashboard();  
    } catch(error) {
      // Return error message
      console.log(error);
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
      movie.detailButton.addEventListener("click", () => getMovie(movie));
      movie.rentButton.addEventListener("click", () => rentMovie(movie));
      movie.returnButton.addEventListener("click", () => returnMovie(movie));
      movie.triviaButton.addEventListener("click", () => addTrivia(movie));
  })
}


function getMovie(movie) {
  movie.cardTriviaLimit = 10;
  movie.showDetailButton = false;
  clearContent(mainContent);
  movie.render(mainContent);
  movie.showDetailButton = true;
}


async function getStudios() {
  const response = await fetch(studioUrl);
  let fetchedStudios = await response.json();

  await fetchedStudios.forEach(studio => {
    let newStudio = new Studio(studio);
    studios.push(newStudio);
  });
}


async function rentMovie(movie) {
  let user = JSON.parse(localStorage.getItem("activeUser"));
  if (user?.verified) {
    confirmMovieRent(user, movie);
  } else { alert("User is not verified to rent movies.") }
    
  if(movie.stock < 1) {
    movieNotAvailable();
    return;
  }
  
  let rentRes = await fetch(rentedUrl);
  let rentedMovies = await rentRes.json();
  

  rentedMovies.forEach(rentedMovie => {
    if (rentedMovie.studioId === user.id 
      && rentedMovie.filmId == movie.id 
      && !rentedMovie.rented) {
      movieAlreadyRented();
      return;
    } 
  });
  
  // Show movie rented success:
}

async function confirmMovieRent(user, movie) {

  const data = {
    "filmId": movie.id,
    "studioId": user.id
  };

  const postOptions = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  };

  const response = await fetch(rentedUrl, postOptions);
  const result = await response.json();

  // Api endpoint for rentMovies has no feature removing stock when rented.
  // We have to remove it manually and it's possible to change stock from movies
  // endpoint.
  movie.stock -= 1;

  const putData = {
    id: movie.id,
    name: movie.name,
    stock: movie.stock
  }

  const putOptions = {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(putData)
  }

  let changeStockResponse = await fetch(`${movieUrl}/${movie.id}`, putOptions); 
  if (changeStockResponse.ok) {
    let message = "successfully rented movie and updated stock";
    console.log(message);
  }

  // Get a new fresh list of movies.
  movies = [];
  getMovies().then(() => movieArchive());
}

function movieNotAvailable() {
  clearContent(mainContent);
  mainContent.insertAdjacentHTML("beforeend", "<h>Movie stock 0!!!</h1>");
}

function movieAlreadyRented() {
  clearContent(mainContent);
  mainContent.insertAdjacentHTML("beforeend", "<h>You already rented this movie</h>");
}


async function returnMovie(movie) {
  let user = JSON.parse(localStorage.getItem("activeUser"));
  let studioRents = [];  
  const response = await fetch(rentedUrl);
  const result = await response.json();

  result.forEach(rent => {
    if(rent.studioId == user.id && rent.returned == false && rent.filmId == movie.id) {
      studioRents.push(rent);
    }
  });

  if(studioRents.length < 1) {
    clearContent(mainContent);
    mainContent.insertAdjacentHTML("beforeend", "<h2>No returns available for studio!</h2>");
  }
  confirmReturn(studioRents);
  changeMovieStock(movie, 1).then(() => movieArchive());
}


async function confirmReturn(rents) {
  const data = {
    "id": rents[0].id,
    "Returned": true 
  };

  const options = {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  }

  await fetch(`${rentedUrl}/${rents[0].id}`, options);
}

async function changeMovieStock(movie, quantity) {
  // Add stock to archive and endpoint:
  movie.stock += quantity;

  const putData = {
    id: movie.id,
    name: movie.name,
    stock: movie.stock
  }

  const putOptions = {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(putData)
  }

  await fetch(`${movieUrl}/${movie.id}`, putOptions); 
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

async function addTrivia(movie) {
  let templateRes = await fetch("../templates/addTrivia.html");
  let template = await templateRes.text();

  clearContent(mainContent);
  mainContent.insertAdjacentHTML("afterbegin", template);

  let triviaAddButton = document.getElementById("add-trivia-button");
  triviaAddButton.addEventListener("click", () => confirmTrivia(movie));
}

async function confirmTrivia(movie) {
  let triviaTextElement = document.getElementById("trivia-content");
  
  const data = {
    FilmId: movie.id,
    Trivia: triviaTextElement.value
  }

  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  }

  let response = await fetch(triviaUrl, options);

  movies = [];
  getMovies().then(() => movieArchive());

}

async function getUserRents() {
  let rentRes = await fetch(rentedUrl);
  let rents = await rentRes.json();
  
  let user = JSON.parse(localStorage.getItem("activeUser"));
  let rentedMovies = [];
  movies.forEach(movie => {
    rents.forEach(rent => {
      if ( rent.studioId === user.id 
        && rent.filmId == movie.id 
        && !rent.returned) {
        rentedMovies.push(movie);
      } 
    });
  });

  return rentedMovies;
}
