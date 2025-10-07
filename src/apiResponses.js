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
  books.forEach((book) => {
    // If the book has genres, combine the arrays and remove duplicates
    if (book.genres) { genres = [...new Set(genres.concat(book.genres))]; }
  });

  sendResponse(request, response, 200, genres);
};

const getBookByGenre = (request, response) => {
  if (request.searchParams.getAll('genres')) {
    // Filter books by genre
    const genreParams = request.searchParams.getAll('genres');

    // Only return books in which all search genres are included
    const booksToSend = books.filter((book) => {
      if (book.genres) {
        return genreParams.every((g) => book.genres.includes(g));
      }
      return false;
    });

    sendResponse(request, response, 200, booksToSend);
  } else {
    sendResponse(request, response, 400, { message: 'Error: Missing genres to filter by' });
  }
};

const getAllBooks = (request, response) => {
  sendResponse(request, response, 200, books);
};

const getBooksByAuthor = (request, response) => {
  if (request.searchParams.getAll('author')) {
    // Filter books by author
    const booksToSend = books.filter((book) => book.author === request.searchParams.get('author'));

    sendResponse(request, response, 200, booksToSend);
  } else { // Missing filter params
    sendResponse(request, response, 400, { message: 'Error: Missing author to filter by' });
  }
};

const getBooksByTitle = (request, response) => {
  if (request.searchParams.get('title')) {
    // Filter by title
    const booksToSend = books.filter((book) => book.title === request.searchParams.get('title'));

    sendResponse(request, response, 200, booksToSend);
  } else {
    sendResponse(request, response, 400, { message: 'Error: Missing title to filter by' });
  }
};

const getFavoriteBooks = (request, response) => {
  sendResponse(request, response, 200, favoriteBooks);
};


// POST ENDPOINTS
const markAsFavorite = (request, response) => {
  const {author, title} = request.body;

  console.log(author + ' ' + title);

  if (!author || !title) {
    return sendResponse(request, response, 400, {'message':'Error: Missing coresponding author and title'});
  }

  const book = books.filter(book => book.author === author && book.title === title);
  console.log(book);
  if (book.length == 0) {
    return sendResponse(request, response, 400, {'message':`Error: ${title} by ${author} does not exist`});
  }
  //console.log(book);
  favoriteBooks.push(book);
  return sendResponse(request, response, 204, {});
};

const addBook = (request, response) => {
  const { book } = request.body;

  books.push(book);
  sendResponse(request, response, 201, { message: 'Book successfully added' });
};

module.exports = {
  getGenres,
  getBookByGenre,
  getAllBooks,
  getBooksByAuthor,
  getBooksByTitle,
  addBook,
  markAsFavorite,
  getFavoriteBooks,
};
