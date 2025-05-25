const global = {
  currentPage: window.location.pathname,
  search: {
    type: "",
    term: "",
    page: 1,
    total_pages: 1,
    total_results: 1
  }
}

// highlighting the best link that is currently active
const showActiveLink = () => {
  const allLinks = document.querySelectorAll(".nav-link");
  allLinks.forEach((link) => {
    if(link.getAttribute("href") === global.currentPage) {
      link.classList.add("active");
    }
  })
}

// creating a function that will be fetchibg ednpoint from the  api of the themoviedatabase
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

// displaying popular movies
const showPopularMovies = async () => {
  const { results } = await fetchData("movie/upcoming");
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

// displaying popular shows
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

// displaying shows details
const showTvDetails = async () => {
  const showsID = window.location.search.split("=")[1];
  const show = await fetchData(`tv/${showsID}`);

  displayBackground("show", show.poster_path);
  const div = document.createElement("div");
  div.innerHTML = `
            <div class="details-top">
          <div>
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
          </div>
          <div>
            <h2>${show.name}</h2>
            <p>
              <i class="fas fa-star text-primary"></i>
              ${show.vote_average} / 10
            </p>
            <p class="text-muted">Release Date: ${show.first_air_date}</p>
            <p>
              ${show.overview}
            </p>
            <h5>Genres</h5>
            <ul class="list-group">
              ${show.genres.map((genre) => {
                return `<li>${genre.name}</li>`
              }).join("")}
            </ul>
            <a href="${show.homepage}" target="_blank" class="btn">Visit Show Homepage</a>
          </div>
        </div>
        <div class="details-bottom">
          <h2>Show Info</h2>
          <ul>
            <li><span class="text-secondary">Number Of Episodes:</span> ${show.number_of_episodes}</li>
            <li>
              <span class="text-secondary">Last Episode To Air:</span> ${show.last_episode_to_air.episode_number}
            </li>
            <li><span class="text-secondary">Status:</span>${show.status}</li>
          </ul>
          <h4>Production Companies</h4>
          <div class="list-group">${show.production_companies.map((company) => {
            return `${company.name}`
          })}</div>
        </div>
  `
  document.querySelector("#show-details").appendChild(div);
}

// creating the search function to be able to search for a movie/show

const search = async () => {
  const queryString = window.location.search;
  const params = new URLSearchParams(queryString);
  global.search.type = params.get("type");
  global.search.term = params.get("search-term");
  
  //check to see if the user inputed anything in the search box
  if(global.search.term !== "" && global.search.term !== null){
    const {results} = await searchAPI();
    results.forEach((result) => {
 const div = document.createElement("div");
 div.classList.add("card");
 div.innerHTML = `
      <a href="${global.search.type}-details.html?id=${result.id}">
            ${
            result.poster_path ? 
            `<img
              src="https://image.tmdb.org/t/p/w500${result.poster_path}"
              class="card-img-top"
              alt="${global.search.type === "movie" ? result.title : result.name}"
            />`
            :
            `<img
              src="images/no-image.jpg"
              class="card-img-top"
              alt="${global.search.type === "movie" ? result.title : result.name}"
            />`
              
            }
          </a>
          
      <div class = "card-body" >
        <h5 class="card-title">${global.search.type === "movie" ? result.title : result.name}</h5> 
        <p class = "card-text" >
        <small class="text-muted">Release:${global.search.type === "movie" ? result.release_date : result.first_air_date}</small></p> 
      </div>
    `
   document.querySelector("#search-results").appendChild(div);
})
  }
  else {
    showAlert("you haven't inputed anything");
  }
}

const searchAPI = async () => {
  const url = "https://api.themoviedb.org/3/";
  const API_KEY = "c44bc25193aa9b19ea9441b23874ecb2";
  const language = "en-US";
  showSpinner()
  const request = await fetch(`${url}search/${global.search.type}?api_key=${API_KEY}&language=${language}&query=${global.search.term}`);
  const response = await request.json();
  const data = await response;
  hideSpinner();
  return data;
}

const showAlert = (error) => {
  const div = document.createElement("div");
  div.classList.add("alert");
  div.appendChild(document.createTextNode(error));
  document.querySelector("#alert").appendChild(div)
}

//creates the background in the movie/tv details page
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
    document.querySelector("#show-details").appendChild(overlay);
  }
}

//creating the slider for movie/homepage
const movieSlider = async () => {
  const { results } = await fetchData("movie/now_playing");
  results.forEach((movie) => {
    const div = document.createElement("div");
    div.classList.add("swiper-slide");
    div.innerHTML = `
      <a href="movie-details.html?id=${movie.id}">
              <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title}" />
            </a>
            <h4 class="swiper-rating">
              <i class="fas fa-star text-secondary"></i> ${movie.vote_average} / 10
            </h4>
    `
    document.querySelector(".swiper-wrapper").appendChild(div);
  });
  initSwiper();
}

const initSwiper = () => {
  const swiper = new Swiper(".swiper", {
    slidesPerView: 1,
    spaceBetween: 30,
    freeMode: true,
    loop: true,
    autoPlay: {
      delay: 4000,
      disableOnInteraction: false
    },
    breakpoints: {
      500: {
        slidesPerView: 1
      },
      700: {
        slidesPerView: 2
      },
      1200: {
        slidesPerView: 3
      }
    }
  })
  
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
        movieSlider();
        showPopularMovies();
    break;
    
    case "/flixx-app/movie-details.html" :
    movieDetails();
    break;
    
    case "/flixx-app/tv-details.html" :
    showTvDetails();
    break;
    
    case "/flixx-app/search.html" :
      search();
    break;
    
    case "/flixx-app/shows.html" : 
      showPopularShow();
    break;
  }
  
  showActiveLink();
}


document.addEventListener("DOMContentLoaded", init);