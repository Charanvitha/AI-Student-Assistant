export function errorHandler(err, _req, res, _next) {
  console.error("ERROR HANDLER:");
  console.error(err);

  res.status(err.status || 500).json({
    error: err.message,
    stack: process.env.NODE_ENV !== "production" ? err.stack : undefined,
    details: err.details
  });
}