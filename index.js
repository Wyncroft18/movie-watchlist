const inputBox = document.getElementById("input-box");
const searchBtn = document.getElementById("search-btn");
const movieSection = document.getElementById("movie-section");
const noMovies = document.getElementById("no-movies-icon");

let myList = JSON.parse(localStorage.getItem("movieList"))
    ? JSON.parse(localStorage.getItem("movieList"))
    : [];

searchBtn.addEventListener("click", async (e) => {
    e.preventDefault();

    try {
        let response = await fetch(
            `https://www.omdbapi.com/?apikey=26514f44&s=${inputBox.value}`
        );

        let data = await response.json();

        if (!data.Search) {
            noMovies.innerHTML = `
                <h3>Unable to find what you're looking for. Please try another search.</h3>
            `;
            return;
        }

        const moviesDataPromises = data.Search.map((movie) => {
            return fetch(
                `https://www.omdbapi.com/?apikey=26514f44&t=${movie.Title}&plot=short`
            ).then((res) => res.json());
        });

        const moviesData = await Promise.all(moviesDataPromises);

        console.log(moviesData);

        movieSection.innerHTML = getMovieHtml(moviesData);
    } catch (error) {
        console.error("Error fetching movie data:", error);
        noMovies.innerHTML = `
            <h3>Something went wrong. Please try again later.</h3>
        `;
    }

    inputBox.value = "";
});

document.addEventListener("click", (e) => {
    const movieId = e.target.dataset.movieId;

    if (movieId) {
        myList.push(movieId);
        localStorage.setItem("movieList", JSON.stringify(myList));
    }
});

function getMovieHtml(moviesData) {
    let movieHtml = "";

    moviesData.forEach((movie) => {
        if (
            !movie ||
            !movie.imdbID ||
            !movie.Poster ||
            !movie.Title ||
            !movie.Runtime ||
            !movie.Plot ||
            !movie.Genre
        ) {
            return;
        }

        const { imdbID, Poster, Title, Runtime, Plot, Genre } = movie;

        movieHtml += `
            <div class="movie-card" id="${imdbID}">
                <img src="${Poster}" alt="${Title}">
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
