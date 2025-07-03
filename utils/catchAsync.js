module.exports = (func) => {
    return (req,res,next) => {
        func(req,res,next).catch(e => {
            next(e); // Pass the error to the next middleware
        });
    }
}


//what this does is it takes a function that returns a promise and wraps it in a function that catches any errors that occur in the promise and passes them to the next middleware. This allows us to handle errors in a single place, rather than having to catch them in every route handler.
// This is useful for handling errors in asynchronous code, such as when using async/await syntax
