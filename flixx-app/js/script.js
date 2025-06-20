//this holds all the global properties
const global = {
    currentPage: window.location.pathname,
    search: {
        term: "",
        type: "",
        page: 1,
        totalPage: 1,
        results: 0
    }
}

//shows which link is currently active
function showActiveLink (){
    //loops through all the links
    const links = document.querySelectorAll(".nav-link");
    links.forEach((link) => {
        //checks to see if the link that is being clicked on matches that of the currentpage/filepath
        if(link.getAttribute("href") === global.currentPage){
            link.classList.add("active");
        }
    });
}

//fetch data from themoviedatbase api
async function fetchAPIData(endpoint){
    const URL_LINK = "https://api.themoviedb.org/3/";
    const API_KEY = "c44bc25193aa9b19ea9441b23874ecb2";
    const language = 'en-US';
    
    showSpinner();
    //make a request using fetch
    const request = await fetch(`${URL_LINK}${endpoint}?api_key=${API_KEY}&language=${language}`);
    const response = await request.json();
    const data = await response;
    hideSpinner();
    return data;
}

//fetch the popular/upcoming movies from themoviedatabse api and display them in the DoM
async function displayPopularMovies (){
    //making a fetch request using endpoints
    const {results} = await fetchAPIData('movie/popular');
    results.forEach((movie) => {
        const div = document.createElement("div");
        div.classList.add("card");
        div.innerHTML = `
            <a href="movie-details.html?id=${movie.id}">
                ${movie.poster_path ? 
                    `
                        <img src='https://image.tmdb.org/t/p/w500${movie.poster_path}' 
                            class='card-img-top' 
                            alt="Movie Title"
                        />
                    `
                    :
                    `
                        <img src='../images/no-image.jpg' 
                            class='card-img-top' 
                            alt="Movie Title"
                        />
                   `
                      }
            </a>
            <div class="card-body">
                <h5 class="card-title">${movie.title}
                    <p class="card-text">
                        <small class="text-muted">Release:${movie.release_date}
                        </small>
                    </p>
                </h5>
            </div>
        `
        document.querySelector("#popular-movies").appendChild(div);
    });
}

//displaying popular tv shows
async function displayPopularShows () {
    //making a fetch request to be able to get the popular tv shows fro themoviedb api
    const {results} = await fetchAPIData("tv/popular");
    results.forEach((show) => {
        const div = document.createElement("div");
        div.classList.add("card");
        div.innerHTML = `
            <a href="tv-details.html?id=${show.id}">
                ${show.poster_path ? 
                    `
                        <img src='https://image.tmdb.org/t/p/w500${show.poster_path}' 
                            class='card-img-top' 
                            alt="${show.name}"
                        />
                    `
                    :
                    `
                        <img src='../images/no-image.jpg' 
                            class='card-img-top' 
                            alt="${show.name}"
                        />
                   `
                      }
            </a>
            
            <div class="card-body">
                <h5 class="card-title">${show.name}
                    <p class="card-text">
                        <small class="text-muted">Release:${show.first_air_date}
                        </small>
                    </p>
                </h5>
            </div>
        `
        document.querySelector("#popular-shows").appendChild(div);
    });

}

// displaying the movie details
async function movieDetails () {
    //getting the id that is specific to a certain movie using the query string
    const movieID = window.location.search.split("=")[1];

    //making a request to fetch the movie details on themoviedb api
    const movie = await fetchAPIData(`movie/${movieID}`);

    showBackground('movie', movie.backdrop_path);

    const div = document.createElement("div");
    div.innerHTML = `
        <div class="details-top">
          <div>
            ${movie.poster_path ? 
                    `
                        <img src='https://image.tmdb.org/t/p/w500${movie.poster_path}' 
                            class='card-img-top' 
                            alt="${movie.title}"
                        />
                    `
                    :
                    `
                        <img src='../images/no-image.jpg' 
                            class='card-img-top' 
                            alt="${movie.title}"
                        />
                   `
                      }
          </div>
          <div>
            <h2>Movie Title</h2>
            <p>
              <i class="fas fa-star text-primary"></i>
              ${movie.vote_average.toFixed(1)} / 10
            </p>
            <p class="text-muted">Release Date: ${movie.release_date}</p>
            <p>${movie.overview}</p>
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
          <div class="list-group">
              ${movie.production_companies.map((company) => {
                return `<span>${company.name}</span>`
              }).join("")}
          </div>
        </div>
    `
    document.querySelector("#movie-details").appendChild(div);
}



//displaying the show details
async function showDetails() {
    //getting the id that is specific to a certain movie using the query string
    const showID = window.location.search.split("=")[1];

    
    //making a request to fetch the movie details on themoviedb api
    const show = await fetchAPIData(`tv/${showID}`);
    
    showBackground('show', show.backdrop_path);
    const div = document.createElement("div");
    div.innerHTML = `
        <div class="details-top">
          <div>
            ${show.poster_path ? 
                    `
                        <img src='https://image.tmdb.org/t/p/w500${show.poster_path}' 
                            class='card-img-top' 
                            alt="${show.name}"
                        />
                    `
                    :
                    `
                        <img src='../images/no-image.jpg' 
                            class='card-img-top' 
                            alt="${show.name}"
                        />
                   `
            }
          </div>
          <div>
            <h2>Show Name</h2>
            <p>
              <i class="fas fa-star text-primary"></i>
              ${show.vote_average.toFixed(1)} / 10
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
              <span class="text-secondary">Last Episode To Air:</span> ${show.last_air_date}
            </li>
            <li><span class="text-secondary">Status:</span> ${show.status}</li>
          </ul>
          <h4>Production Companies</h4>
          <div class="list-group">
              ${show.production_companies.map((company) => {
                return `<span>${company.name}</span>`
              }).join("")}
          </div>
        </div>
    `
    
    document.querySelector("#show-details").appendChild(div);
}


function showBackground(type, backgroundPath) {
    const overlayDiv = document.createElement("div");
    overlayDiv.style.backgroundImage = `url(https://image.tmdb.org/t/p/original/${backgroundPath})` ;
    overlayDiv.style.backgroundSize = "cover";
    overlayDiv.style.backgroundPosition = "center";
    overlayDiv.style.backgroundRepeat = "no-repeat";
    overlayDiv.style.height = "100vh";
    overlayDiv.style.width = "100vw";
    overlayDiv.style.top = "30%";
    overlayDiv.style.left = "0";
    overlayDiv.style.zIndex = "-99";
    overlayDiv.style.position = "absolute";
    overlayDiv.style.opacity = "0.1";

    if(type === "movie"){
        document.querySelector("#movie-details").appendChild(overlayDiv);
    }
    else {
        document.querySelector("#show-details").appendChild(overlayDiv);
    }
}

//function that creates a slider on the homepage
async function showSlider() {
    const {results} = await fetchAPIData("movie/now_playing");
    results.forEach((movie) => {
        const div = document.createElement("div");
        div.classList.add("swiper-slide");
        div.innerHTML = `
            <a href="movie-details.html?${movie.id}">
              <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title}" />
            </a>
            <h4 class="swiper-rating">
              <i class="fas fa-star text-secondary"></i> ${movie.vote_average.toFixed(1)} / 10
            </h4>
        `
        document.querySelector(".swiper-wrapper").appendChild(div);
    });
    
    initSwiper();
}

// creating a function for our seach api
async function searchAPI() {
    const URL_LINK = "https://api.themoviedb.org/3/";
    const API_KEY = "c44bc25193aa9b19ea9441b23874ecb2";
    const language = 'en-US';

//make a request using fetch
    const request = await fetch(`${URL_LINK}search/${global.search.type}?api_key=${API_KEY}&language=${language}&query=${global.search.term}&page=${global.search.page}`);
    const response = await request.json();
    const data = await response;
    return data;
}

// creating a function that search movies and shows
async function searchMoviesandShows() {
    const queryString = window.location.search;
    const params = new URLSearchParams(queryString);
    
    global.search.type = params.get("type");
    global.search.term = params.get("search-term");
    
    // make a request only when the user inputs a search term
    if(global.search.term !== "" && global.search.term !== null){
        const {results, page, total_pages, total_results} = await searchAPI();
        
        //display results
        
        global.search.totalPage = total_pages;
        global.search.results = total_results;
        global.search.page = page;
        
        displayResult(results);
    }
    else {
        showError("Field is empty");
    }
}

//displaying search results
async function displayResult(results) {
    document.querySelector("#search-results").innerHTML = "";
    document.querySelector("#search-results-heading").innerHTML = "";
    document.querySelector("#pagination").innerHTML = "";
    
    results.forEach((result) => {
            const div = document.createElement("div");
            div.classList.add("card");
            div.innerHTML = `
            <a href="movie-details.html?id=${result.id}">
                ${result.poster_path ? 
                    `
                        <img src='https://image.tmdb.org/t/p/w500${result.poster_path}' 
                            class='card-img-top' 
                            alt="${global.search.type === "movie" ? result.title : result.name}"
                        />
                    `
                    :
                    `
                        <img src='../flixx-app/images/no-image.jpg' 
                            class='card-img-top' 
                            alt="${global.search.type === "movie" ? result.title : result.name}"
                        />
                   `
                      }
            </a>
            <div class="card-body">
                <h5 class="card-title">${global.search.type === "movie" ? result.title : result.name}
                    <p class="card-text">
                        <small class="text-muted">Release:${global.search.type === "movie" ? result.release_date : result.first_air_date}
                        </small>
                    </p>
                </h5>
            </div>
      `
      
      document.querySelector("#search-results-heading").innerHTML = `<h2>${results.length} of ${global.search.results} results for ${global.search.term}</h2>`;
      
      document.querySelector("#search-results").appendChild(div);
    });
    
    pagination()
}

function pagination () {
    const div = document.createElement("div");
    div.classList.add("pagination");
    div.innerHTML = `
        <button class="btn btn-primary" id="prev">Prev</button>
        <button class="btn btn-primary" id="next">Next</button>
         <div class="page-counter">Page ${global.search.page} of ${global.search.totalPage}</div>
      `
  document.querySelector("#pagination").appendChild(div);
    
    //disable prev btn if search results is on the firdt page
    if(global.search.page === 1){
        document.querySelector("#prev").disabled = true;
    }
    
    if (global.search.page === global.search.results) {
        document.querySelector("#next").disabled = true;
    }
    
    document.querySelector("#next").addEventListener("click", nextPage);
    document.querySelector("#prev").addEventListener("click", prevPage);
}

//next page
async function nextPage() {
    //increament the page
    global.search.page++;
    const {results, total_results} = await searchAPI();
    displayResult(results);
}

//prev page
async function prevPage() {
    //increament the page
    global.search.page--;
    const { results, total_results } = await searchAPI();
    displayResult(results);
}

// creating error function
function showError(error) {
    const div = document.createElement("div");
    div.classList.add("alert");
    div.appendChild(document.createTextNode(error));
    document.querySelector("#alert").appendChild(div);

    setTimeout(() => {
        div.remove();
    }, 3000);
}

//pagination 

//show spinner
function showSpinner () {
    document.querySelector(".spinner").classList.add("show");
}

//hide spinner
function hideSpinner() {
    document.querySelector(".spinner").classList.remove("show");
}

// initialize the swiper
function initSwiper() {
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

//dynamically changes the web files without delay
function router () {
    switch(global.currentPage){
        case "/":
            case "/index.html":
        showSlider();
        displayPopularMovies();
        break;

        case "/movie-details.html":
            movieDetails();
        break;

        case "/search.html":
            searchMoviesandShows();
        break;

        case "/shows.html":
            displayPopularShows();
        break;
        case "/tv-details.html":
            showDetails();
        break;
    }

    showActiveLink();
}

document.addEventListener("DOMContentLoaded", router);
