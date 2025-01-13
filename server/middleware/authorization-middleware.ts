export function authenticate(req, res, next) {
    console.log("running authentication");
    next();
}