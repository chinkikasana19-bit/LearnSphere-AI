export function notFound(req, res, next) {
  res.status(404);
  next(new Error(`Route not found: ${req.originalUrl}`));
}

export function errorHandler(error, req, res, _next) {
  console.error(error);
  const status = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(status).json({
    success: false,
    message: error.message || "Server error",
    ...(process.env.NODE_ENV === "development" && { stack: error.stack })
  });
}
