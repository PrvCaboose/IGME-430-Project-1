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
  if (request.searchParams['genres']) {
    // Filter books by genre
    const genreParams = request.searchParams.getAll('genres');

    const booksToSend = books.filter(book => {
      if (book.genres){
        // Only return books in which all search genres are included
        return genreParams.every(g => book.genres.includes(g));
      }
    });

    sendResponse(request, response, 200, booksToSend);
  } else {
    sendResponse(request, response, 400, {"message": "Error: Missing genres to filter by"});
  }
}

const getAllBooks = (request, response) => {
  sendResponse(request, response, 200, books);    
}

const getBooksByAuthor = (request, response) => {
  if (request.searchParams['author']) { 
    // Filter books by author
    const authorParams = request.searchParams['author'];

    const booksToSend = books.filter(book => {
      return book.author === authorParams;
    });
    console.log(booksToSend);

    sendResponse(request, response, 200, booksToSend);
  } else { // Missing filter params
    sendResponse(request, response, 400, {"message": "Error: Missing author to filter by"});
  }

}

const getBooksByTitle = (request, response) => {
  if (request.searchParams['title']) {
    // Filter by title
    const booksToSend = books.filter(book => {
      return book.title === request.searchParams['title'];
    });

    sendResponse(request, response, 200, booksToSend);
  } else {
    sendResponse(request, response, 400, {'message':"Error: Missing title to filter by"});
  }
}

const getFavoriteBooks = (request, response) => {
  sendResponse(request, response, 200, favoriteBooks);
}

const markAsFavorite = (request, response) => {
  const book = request.body.book;
  
  favoriteBooks.push(book);
  sendResponse(request, response, 204, {});
}

const addBook = (request, response) => {
  const book = request.body.book;

  books.push(book);
  sendResponse(request, response, 201, {'message': 'Book successfully added'});
}

module.exports = {
    getGenres,
    getBookByGenre,
    getAllBooks,
    getBooksByAuthor,
    getBooksByTitle,
    addBook,
    markAsFavorite,
    getFavoriteBooks
}