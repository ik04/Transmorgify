function VideoNotFoundException(message) {
  const error = new Error(message);

  error.code = 404;
  return error;
}

VideoNotFoundException.prototype = Object.create(Error.prototype);
module.exports = VideoNotFoundException;
