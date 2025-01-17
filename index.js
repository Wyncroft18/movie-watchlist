const inputBox = document.getElementById("input-box");
const searchBtn = document.getElementById("search-btn");
const movieSection = document.getElementById("movie-section");

searchBtn.addEventListener("click", async () => {
    let response = await fetch(
        `http://www.omdbapi.com/?apikey=26514f44&s=${inputBox.value}`
    );
    let data = await response.json();

    const movieTitles = [];

    data.Search.forEach((movie) => {
        movieTitles.push(movie.Title);
    });

    // how would i fetch data for each movie???
    let moviesData = [];

    for (let movie of movieTitles) {
        let response = await fetch(
            `http://www.omdbapi.com/?apikey=26514f44&t=${movie}&plot=short`
        );
        let data = await response.json();
        moviesData.push(data);
    }

    movieSection.innerHTML = getMovieHtml(moviesData);
});

function getMovieHtml(moviesData) {
    let movieHtml = ""

    moviesData.forEach((movie) => {
        const {Poster, Title, Runtime, Plot} = movie

        movieHtml += `
            <div class="movie-card">
                <img src="${Poster}" >
                <div class="movie-description">
                    <div>
                        <h2>${Title}</h2>
                        <span>
                            
                        </span>
                    </div>
                    <div>${Runtime}</div>
                    <p>${Plot}</p>
                </div>
            </div>
        `
    })

    return movieHtml
}
