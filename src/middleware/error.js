const AppError = require("./../utils/AppError");

// Duplicate value in MongoDB
const handleDuplicateError = (err) => {
  const dupKey = Object.keys(err.keyValue)[0];
  const dupValue = Object.values(err.keyValue)[0];
  console.log(dupKey, dupValue);
  const message = `Duplicate ${dupKey}: "${dupValue}". exists already`;
  return new AppError(message, 400);
};

// Cast Id error
const handleCastError = (err) => {
  const message = `Invalid ${err.path}: ${err.value}.`;
  return new AppError(message, 400);
};

// Validation error
const handleValidationError = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);
  const message = `Invalid Input Data: ${errors.join(". ")}`;
  return new AppError(message, 400);
};

// JWT errors
const handleJWTError = () => {
  return new AppError("Invalid Token. Please login again", 401);
};

const handleJWTExpiredError = () => {
  return new AppError("Your Token has expired. Please login again", 401);
};

// Send error to client in development
const sendDevError = (err, res) => {
  const statusCode = err.statusCode || 500;
  const status = err.status || "error";
  res.status(statusCode).json({
    status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

// Send error to client in production
const prodDevError = (err, res) => {
  const statusCode = err.statusCode || 500;
  const status = err.status || "error";

  if (err.isOperational) {
    res.status(statusCode).json({
      status,
      message: err.message,
    });
  } else {
    // Operational error / unknown error fallback
    res.status(500).json({
      status: "error",
      message: "Something went wrong",
    });
  }
};

const errorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  if (process.env.NODE_ENV === "development") {
    sendDevError(err, res);
  } else {
    let error = { ...err, message: err.message };
    if (err.code === 11000) error = handleDuplicateError(err);
    if (err.name === "CastError") error = handleCastError(err);
    if (err.name === "ValidationError") error = handleValidationError(err);
    if (err.name === "JsonWebTokenError") error = handleJWTError();
    if (err.name === "TokenExpiredError") error = handleJWTExpiredError();

    prodDevError(error, res);
  }
};

module.exports = errorHandler;