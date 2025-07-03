export default function errorMiddleware(error, _request, response, _next) {
  const status = error.status ? error.status : 500;
  const message = status === 500 ? 'Rakenduse töös tekkis viga' : error.message;
  const errors = error.error;
  response.status(status).send({ status, message, error: errors });
}
