const global = {
  currentPage: window.location.pathname
}


const showActiveLink = () => {
  const allLinks = document.querySelectorAll(".nav-link");
  allLinks.forEach((link) => {
    if(link.getAttribute("href") === global.currentPage) {
      link.classList.add("active");
    }
  })
}

const fetchData = async (endpoint) => {
  const url = "https://api.themoviedb.org/3/";
  const API_KEY = "c44bc25193aa9b19ea9441b23874ecb2";
  const language = "en-US";
  showSpinner()
  const request = await fetch(`${url}${endpoint}?api_key=${API_KEY}&language=${language}`);
  const response = await request.json();
  const data = await response;
  hideSpinner();
  return data;
}

const showPopularMovies = async () => {
  const { results } = await fetchData("movie/popular");
  results.forEach((movie) => {
    const div = document.createElement("div");
    div.classList.add("card");
    div.innerHTML = `
      <a href="movie-details.html?id={movie.id}">
            ${
            movie.poster_path ? 
            `<img
              src="https://image.tmdb.org/t/p/w500${movie.poster_path}"
              class="card-img-top"
              alt="Movie Title"
            />`
            :
            `<img
              src="images/no-image.jpg"
              class="card-img-top"
              alt="Movie Title"
            />`
              
            }
          </a>
          
      <div class = "card-body" >
        <h5 class="card-title">${movie.title}</h5> 
        <p class = "card-text" >
        <small class="text-muted">Release:${movie.release_date}</small></p> 
      </div>
    `
    document.querySelector("#popular-movies").appendChild(div);
  })
}


const showPopularShow = async () => {
  const { results } = await fetchData("tv/popular");
  results.forEach((show) => {
    const div = document.createElement("div");
    div.classList.add("card");
    div.innerHTML = `
      <a href="tv-details.html?id=${show.id}">
            ${
            show.poster_path ? 
            `<img
              src="https://image.tmdb.org/t/p/w500${show.poster_path}"
              class="card-img-top"
              alt="Movie Title"
            />`
            :
            `<img
              src="images/no-image.jpg"
              class="card-img-top"
              alt="Movie Title"
            />`
              
            }
          </a>
          
      <div class = "card-body" >
        <h5 class="card-title">${show.name}</h5> 
        <p class = "card-text" >
        <small class="text-muted">Release:${show.first_air_date}</small></p> 
      </div>
    `
    document.querySelector("#popular-shows").appendChild(div);
  })
}

//movie details
const movieDetails = async () => {
  console.log(window.location.search);
}
movieDetails();


const showSpinner = () => {
  document.querySelector(".spinner").classList.add("show");
}

const hideSpinner = () => {
  document.querySelector(".spinner").classList.remove("show");
}

const init = () => {
  switch(global.currentPage) {
    case "/flixx-app/" : 
      case "/flixx-app/index.html" :
        showPopularMovies();
    break;
    
    case "/flixx-app/movie-details.html" :
      console.log("Movie");
    break;
    
    case "/flixx-app/tv-details.html" :
    break;
    
    case "/flixx-app/search.html" :
      console.log("Search");
    break;
    
    case "/flixx-app/shows.html" : 
      showPopularShow();
    break;
  }
  
  showActiveLink();
}


document.addEventListener("DOMContentLoaded", init);