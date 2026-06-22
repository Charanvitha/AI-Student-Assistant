export function errorHandler(err, _req, res, _next) {
  const status = err.status || 500;
  const message = err.message || 'Unexpected server error';
  if (status >= 500) {
    console.error(err);
  }
  res.status(status).json({ error: message, details: err.details || undefined });
}
