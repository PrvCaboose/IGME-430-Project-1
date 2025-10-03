const books = require('./books.json');
const favoriteBooks = [];

const sendResponse = (request, response, statusCode, content) => {
  const jsonBody = JSON.stringify(content);
  response.writeHead(statusCode, {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(jsonBody, 'utf8'),
  });

  if (request.method !== 'HEAD' && statusCode !== 204) {
    response.write(jsonBody);
  }

  response.end();
};

const getGenres = (request, response) => {
    let genres = [];

    // Get a unique list of genres
    books.forEach(book => {
        // If the book has genres, combine the arrays and remove duplicates
        if (book.genres)
            genres = [...new Set(genres.concat(book.genres))];
        
    });
    
    sendResponse(request, response, 200, genres);
}

const getBookByGenre = (request, response) => {
  const genreParams = request.searchParams.getAll('genres');
  console.log(genreParams)
  
  const booksToSend = books.filter(book => {
    if (book.genres){
      return genreParams.every(g => book.genres.includes(g));
    }
  });
  console.log(booksToSend);
}

const getAllBooks = (request, response) => {
    
}

const getBooksByAuthor = (request, response) => {

}

const getBooksByTitle = (request, response) => {

}

const getFavoriteBooks = (request, response) => {
    sendResponse(request, response, 200, favoriteBooks);
}

const markAsFavorite = (request, response) => {

}

const addBook = (request, response) => {

}

module.exports = {
    getGenres,
    getBookByGenre,
    getAllBooks,
    getBooksByAuthor,
    getBooksByTitle,
    addBook,
    markAsFavorite
}