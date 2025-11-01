class MyNotFoundError extends Error {
  constructor(message) {
    super(message);
    this.name = 'Not_Found_Error';
    this.statusCode = 404;
  }
}

export default MyNotFoundError;
