class ExpressError extends Error {
    constructor(message, statusCode) {
        super(); // Call the parent constructor with the message
        this.statusCode = statusCode; // Set the status code
        this.message = message
    }
}

module.exports = ExpressError; // Export the class for use in other files


//what this does is it creates a custom error class that extends the built-in Error class. This allows us to create errors with a specific status code and message, which can be used to handle errors in a more structured way in our Express application.
// This is useful for handling errors in a consistent way across our application, rather than using the built-in Error class which does not allow us to set a status code.