export function validate(schema) {
  return (req, _res, next) => {
    const result = schema.safeParse({ body: req.body, params: req.params, query: req.query });
    if (!result.success) {
      return next({ status: 400, message: 'Validation failed', details: result.error.flatten() });
    }
    req.validated = result.data;
    next();
  };
}
