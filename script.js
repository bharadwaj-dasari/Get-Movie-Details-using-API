const APIURL = "https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key=04c35731a5ee918f014970082a0088b1&page=1";
const IMGPATH = "https://image.tmdb.org/t/p/w1280";
const SEARCHAPI = "https://api.themoviedb.org/3/search/movie?&api_key=04c35731a5ee918f014970082a0088b1&query=";
const movieBox = document.querySelector("#mv-box");

document.getElementById('search').addEventListener('click', () => {
    const title = document.getElementById('title').value;
    const minRating = document.querySelector('.min-rating').value || 0;
    const maxRating = document.querySelector('.max-rating').value || 10;
    const minYear = document.querySelector('.min-year').value || 0;
    const maxYear = document.querySelector('.max-year').value || new Date().getFullYear();
    const fullWordMatch = document.querySelector('.fullWordMatch').checked;

    let url = APIURL;

    if (title) {
        url = `${SEARCHAPI}${title}`;
    }

    fetchMovies(url, minRating, maxRating, minYear, maxYear, fullWordMatch);
});

function fetchMovies(url, minRating, maxRating, minYear, maxYear, fullWordMatch) {
    fetch(url)
        .then(response => response.json())
        .then(data => {
            showMovies(data.results, minRating, maxRating, minYear, maxYear, fullWordMatch);
        })
        .catch(error => console.error('Fetch error:', error));
}

const showMovies = (movies, minRating, maxRating, minYear, maxYear, fullWordMatch) => {
    movieBox.innerHTML = "";

    movies.forEach(movie => {
        const { title, vote_average, overview, release_date, poster_path } = movie;
        const year = release_date ? release_date.split('-')[0] : 'N/A';
        const rating = Math.floor(vote_average * 10) / 10;

        const titleMatch = fullWordMatch ? (title.toLowerCase() === document.getElementById('title').value.toLowerCase()) : title.toLowerCase().includes(document.getElementById('title').value.toLowerCase());

        if (titleMatch && rating >= minRating && rating <= maxRating && year >= minYear && year <= maxYear) {
            const movieElement = document.createElement('div');
            movieElement.classList.add('box');
            
            movieElement.innerHTML = `
                <div class="img-sec">
                    <img id="im" src="${IMGPATH + poster_path}" alt="Image Not Found">
                </div>
                <div class="txt">
                    <div class="B-title">${title}</div>
                    <div class="B-rating">Rating: ${rating}</div>
                    <div class="B-dic">
                        <p class="content">${overview}</p>
                        <span class="more" style="display:none;">Read More</span>
                    </div>
                    <div class="B-year">Year: ${year}</div>
                </div>
            `;
            movieBox.appendChild(movieElement);
        }
    });

    ReadMore();
};

function ReadMore() {
  document.querySelectorAll('.content').forEach(message => {
      const words = message.innerHTML.split(' ');

      if (words.length > 30) {
          const visiblePart = words.slice(0, 30).join(' ');
          const hiddenPart = words.slice(30).join(' ');

          message.innerHTML = `${visiblePart}<span class="ellipsis">...</span><span class="more-content">${hiddenPart}</span>`;
          message.nextElementSibling.style.display = 'inline';
      }
  });
  
  document.querySelectorAll('.more').forEach(button => {
      button.addEventListener('click', function() {
          const moreContent = this.previousElementSibling.querySelector('.more-content');
          const ellipsis = this.previousElementSibling.querySelector('.ellipsis');
          document.querySelector('.B-dic')
          if (moreContent.style.display === 'none') {
              moreContent.style.display = 'inline';
              ellipsis.style.display = 'none';
              this.innerHTML = 'Read less';

          } else {
              moreContent.style.display = 'none';
              ellipsis.style.display = 'inline';
              this.innerHTML = 'Read more';
          }
      });
  });
}

document.addEventListener('DOMContentLoaded', function() {
  ReadMore();
});

