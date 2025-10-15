const books = require('./books.json');

const favoriteBooks = [];

// prepares response content and sends a response to the client
const sendResponse = (request, response, statusCode, content) => {
  const jsonBody = JSON.stringify(content);
  response.writeHead(statusCode, {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(jsonBody, 'utf8'),
  });

  // only send body if needed
  if (request.method !== 'HEAD' && statusCode !== 204) {
    response.write(jsonBody);
  }

  response.end();
};
// Get all genres
const getGenres = (request, response) => {
  let genres = [];

  // Get a unique list of genres
  books.forEach((book) => {
    // If the book has genres, combine the arrays and remove duplicates
    if (book.genres) { genres = [...new Set(genres.concat(book.genres))]; }
  });

  sendResponse(request, response, 200, genres);
};
// filter books by selected genres, no genres will return all books
const getBooksByGenre = (request, response) => {
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
// return all books
const getAllBooks = (request, response) => {
  sendResponse(request, response, 200, books);
};
// filters books by a given author
const getBooksByAuthor = (request, response) => {
  if (request.searchParams.get('author')) {
    // Filter books by author
    const booksToSend = books.filter((book) => book.author === request.searchParams.get('author'));

    if (booksToSend.length === 0) {
      return sendResponse(request, response, 400, { message: `Error: No books found by author '${request.searchParams.get('author')}'` });
    }

    return sendResponse(request, response, 200, booksToSend);
  } // Missing filter params
  return sendResponse(request, response, 400, { message: 'Error: Missing author to filter by' });
};
// filter books by a given title
const getBooksByTitle = (request, response) => {
  if (request.searchParams.get('title')) {
    // Filter by title
    const booksToSend = books.filter((book) => book.title === request.searchParams.get('title'));

    if (booksToSend.length === 0) {
      return sendResponse(request, response, 400, { message: `Error: No books found with title '${request.searchParams.get('title')}'` });
    }

    return sendResponse(request, response, 200, booksToSend);
  }
  return sendResponse(request, response, 400, { message: 'Error: Missing title to filter by' });
};

const getFavoriteBooks = (request, response) => {
  sendResponse(request, response, 200, favoriteBooks);
};

// POST ENDPOINTS

// marks a book as a favorite given a title and author
const markAsFavorite = (request, response) => {
  let author; let
    title;
  // parse json or url-encoded body
  if (request.headers['content-type'] === 'application/json') {
    author = JSON.parse(Object.keys(request.body)[[0]]).author;
    title = JSON.parse(Object.keys(request.body)[[0]]).title;
  } else {
    author = request.body.author;
    title = request.body.title;
  }
  // check for author and title
  if (!author || !title) {
    return sendResponse(request, response, 400, { message: 'Error: Missing coresponding author and title' });
  }
  // filter books by title and author
  const filteredBook = books.filter((book) => book.author === author && book.title === title);
  if (filteredBook.length === 0) {
    return sendResponse(request, response, 400, { message: `Error: ${title} by ${author} does not exist` });
  }
  // check if its already favorited
  if (favoriteBooks.indexOf(filteredBook[0]) < 0) { favoriteBooks.push(filteredBook[0]); }

  return sendResponse(request, response, 204, {});
};
// creates a new book given at least a title
const addBook = (request, response) => {
  // get the key value of req.body which is where the stringified data is,
  //  then parse it and get the book value
  let newBook;
  if (request.headers['content-type'] === 'application/json') {
    newBook = JSON.parse(Object.keys(request.body)[[0]]).book;
  } else {
    newBook = request.body.book;
  }

  if (!newBook.title) {
    return sendResponse(request, response, 400, { message: 'Error: No title given' });
  }

  // check to see if any books exist with the same author or title
  const filter = books.filter((book) => book.author === newBook.author
                                         && book.title === newBook.title);

  if (filter.length === 0) {
    books.push(newBook);
    return sendResponse(request, response, 201, { message: 'Book successfully added' });
  }
  return sendResponse(request, response, 400, { message: 'Error: Book already exists' });
};

module.exports = {
  getGenres,
  getBooksByGenre,
  getAllBooks,
  getBooksByAuthor,
  getBooksByTitle,
  addBook,
  markAsFavorite,
  getFavoriteBooks,
};
