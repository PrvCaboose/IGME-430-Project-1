const books = require('./books.json');
const userBookList = [];

const getGenres = (request, response) => {
    let genres = [];

    // Get a unique list of genres
    books.forEach(book => {
        // If the book has genres, combine the arrays and remove duplicates
        if (book.genres)
            genres = [...new Set(genres.concat(book.genres))];
        
    });
    
    const resBody = JSON.stringify(genres);

    response.writeHead(200, {
        'Content-Type': 'applicaiton/json',
        'Content-Length': Buffer.byteLength(resBody)
    });
    response.write(resBody);
    response.end();
}

const getBooks = (request, response) => {
    
}

const getLanguages = (request, response) => {

}

const getBookList = (request, response) => {

}

const addBookToList = (request, response) => {

}

const editBookOnList = (request, response) => {

}

module.exports = {
    getGenres,
    getBooks,
    getLanguages,
    getBookList,
    addBookToList,
    editBookOnList
}