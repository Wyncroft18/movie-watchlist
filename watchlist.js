const movieSection = document.getElementById("movie-section");

let movieId = JSON.parse(localStorage.getItem("movieList"))
    ? JSON.parse(localStorage.getItem("movieList"))
    : [];

renderMovies()

// listens for movies being removed
document.addEventListener("click", (e) => {
    const id = e.target.dataset.movieId

    if (id) {
        movieId.splice(movieId.indexOf(id), 1)
        if (movieId.length === 0) {
            localStorage.clear()        
        } else {
            localStorage.setItem("movieList", JSON.stringify(movieId));
        }
        renderMovies()
    }
});

// renders movies
async function renderMovies() {
    if (movieId.length > 0) {
        movieSection.innerHTML = await getMovieHtml()
    } else {
        movieSection.innerHTML = `
            <div class="no-movies" id="no-movies">
                <p>Your watchlist is looking a little empty...</p>
                <a href="./index.html">
                    <img src="./img/add-icon.png" >
                    <p>Let's add some movies!</p>
                </a>
            </div>
        `
    }
}

// gets the html of all the movie for movie card
async function getMovieHtml() {
    const movies = await getMovieData(movieId)
    
    let movieHtml = "";
    
    movies.forEach((movie) => {
        const { imdbID, Poster, Title, Runtime, Plot, Genre } = movie;
        
        movieHtml += `
        <div class="movie-card" id="${imdbID}">
        <img src="${Poster}" >
        <div class="movie-description">
        <div>
        <h2>${Title}</h2>
        </div>
        <div class="runtime">
        <span>${Runtime}</span>
        <span>${Genre}</span>
        <span class="add-to-watchlist">
        <img src="./img/remove-icon.png" data-movie-id="${imdbID}" >
        <p data-movie-id="${imdbID}" >Remove</p>
        </span>
        </div>
        <p>${Plot}</p>
        </div>
        </div>
        `;
    });
    
    return movieHtml
}

// fetches movie data from database
async function getMovieData(movieId) {
    let moviesData = [];

    for (let id of movieId) {
        let response = await fetch(
            `https://www.omdbapi.com/?apikey=26514f44&i=${id}&plot=short`
        );
        let data = await response.json();
        moviesData.push(data);
    }

    return moviesData
}