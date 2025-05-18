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
      <a href="movie-details.html?id=${movie.id}">
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
  const movieID = window.location.search.split("=")[1];
  const movie = await fetchData(`movie/${movieID}`);
  
  displayBackground("movie", movie.poster_path);
  const div = document.createElement("div");
    
  div.innerHTML = `
              <div class="details-top">
          <div>
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
          </div>
          <div>
            <h2>${movie.title}</h2>
            <p>
              <i class="fas fa-star text-primary">${movie.vote_average.toFixed(1)} / 10</i>
              
            </p>
            <p class="text-muted">Release Date: ${movie.release_date}</p>
            <p>
              ${movie.overview}
            </p>
            <h5>Genres</h5>
            <ul class="list-group">
              ${movie.genres.map((genre) => {
               return `<li>${genre.name}</li>`
              }).join("")}
            </ul>
            <a href="${movie.homepage}" target="_blank" class="btn">Visit Movie Homepage</a>
          </div>
        </div>
        <div class="details-bottom">
          <h2>Movie Info</h2>
          <ul>
            <li><span class="text-secondary">Budget:</span> $${movie.budget}</li>
            <li><span class="text-secondary">Revenue:</span> $${movie.revenue}</li>
            <li><span class="text-secondary">Runtime:</span> ${movie.runtime}</li>
            <li><span class="text-secondary">Status:</span> ${movie.status}</li>
          </ul>
          <h4>Production Companies</h4>
          <div class="list-group">${movie.production_companies.map((company) => {
              return `<span>${company.name}</span>`
            }).join("")}
          </div>
        </div>
    `
  document.querySelector("#movie-details").appendChild(div);
}

const showTvDetails = async () => {
  const showsID = window.location.search.split("=")[1];
  const movie = await fetchData(`movie/${showsID}`);

  displayBackground("shows", shows.poster_path);
  const div = document.createElement("div");
  
  document.querySelector("#show-details").appendChild(div);
}

const displayBackground = (type, backgroundPath) => {
  const overlay = document.createElement("div");
  overlay.style.backgroundImage = `url(https://image.tmdb.org/t/p/original/${backgroundPath})`;
  overlay.style.backgroundSize = "cover";
  overlay.style.backgroundPosition = "center";
  overlay.style.backgroundRepeat = "no-repeat";
  overlay.style.width = "100vw";
  overlay.style.height = "100vh";
  overlay.style.position = "absolute";
  overlay.style.top = "0";
  overlay.style.left = "0";
  overlay.style.zIndex = "-1";
  overlay.style.opacity = "0.1";
  
  
  if(type === "movie") {
    document.querySelector("#movie-details").appendChild(overlay);
  }
  else {
    document.querySelector("#-details").appendChild(overlay);
  }
}


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
    movieDetails();
    break;
    
    case "/flixx-app/tv-details.html" :
    showTvDetails();
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