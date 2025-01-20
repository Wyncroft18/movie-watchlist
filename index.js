const inputBox = document.getElementById("input-box");
const searchBtn = document.getElementById("search-btn");
const movieSection = document.getElementById("movie-section");
const noMovies = document.getElementById("no-movies-icon");

let myList = [];

searchBtn.addEventListener("click", async () => {
    if (inputBox.value === "") {
        noMovies.innerHTML = `
            <h3>Unable to find what you're looking for. Please try another search.</h3>
        `;
    }

    let response = await fetch(
        `http://www.omdbapi.com/?apikey=26514f44&s=${inputBox.value}`
    );
    let data = await response.json();

    const movieTitles = [];

    data.Search.forEach((movie) => {
        movieTitles.push(movie.Title);
    });

    let moviesData = [];

    for (let movie of movieTitles) {
        let response = await fetch(
            `http://www.omdbapi.com/?apikey=26514f44&t=${movie}&plot=short`
        );
        let data = await response.json();
        moviesData.push(data);
    }

    movieSection.innerHTML = getMovieHtml(moviesData);
    inputBox.value = "";
});

document.addEventListener("click", (e) => {
    const movieId = e.target.dataset.movieId;

    if (movieId) {
        myList.push(movieId);
    }
});

function getMovieHtml(moviesData) {
    let movieHtml = "";

    moviesData.forEach((movie) => {
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
                            <img src="./img/add-icon.png" data-movie-id="${imdbID}" >
                            <p data-movie-id="${imdbID}" >Watchlist</p>
                        </span>
                    </div>
                    <p>${Plot}</p>
                </div>
            </div>
        `;
    });

    return movieHtml;
}
