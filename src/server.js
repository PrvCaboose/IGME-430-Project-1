const http = require('http');
const query = require('querystring');
const htmlHandler = require('./htmlResponses');
const jsonHandler = require('./jsonResponses');

const port = process.env.PORT || process.env.NODE_PORT || 3000;

const urlStruct = {
  '/': htmlHandler.getIndex,
  '/style.css': htmlHandler.getStyles,
  '/getUsers': jsonHandler.getUsers,
  '/notReal': jsonHandler.notReal,
  '/addUser': jsonHandler.addUser,
};

const handlePost = (request, response, parsedURL) => {
  if (urlStruct[parsedURL.pathname]) {
    // Store body parts in here
    const body = [];

    // Set up error handler
    request.on('error', (err) => {
      console.dir(err);
      response.statusCode = 400;
      response.end();
    });

    // Collect new body parts when they arrive
    request.on('data', (chunk) => {
      body.push(chunk);
    });

    // When request finished combine body parts and turn them into a single string
    //  then turn it into an object
    request.on('end', () => {
      const bodyString = Buffer.concat(body).toString();
      request.body = query.parse(bodyString);
      urlStruct[parsedURL.pathname](request, response);
    });
  }
};

const handleGetHead = (request, response, parsedURL) => {
  console.log(parsedURL.pathname);
  if (urlStruct[parsedURL.pathname]) {
    return urlStruct[parsedURL.pathname](request, response);
  }
  // Fallback if url fails
  return urlStruct['/notReal'](request, response);
};

const onRequest = (request, response) => {
  // Parse URL info
  const protocol = request.connection.encryted ? 'https' : 'http';
  const parsedURL = new URL(request.url, `${protocol}://${request.headers.host}`);

  if (request.method === 'POST') {
    handlePost(request, response, parsedURL);
  } else {
    handleGetHead(request, response, parsedURL);
  }
};

http.createServer(onRequest).listen(port, () => {
  // console.log(`Listening on 127.0.0.1:${port}`);
});
