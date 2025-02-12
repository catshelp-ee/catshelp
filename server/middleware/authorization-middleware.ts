export function authenticate(req, res, next) {
  console.log("running authentication");
  console.log(req.cookies.oauth)
  if(req.cookies.oauth !== undefined){
    next();
    return;
  }

  console.log("wtf");

  return res.redirect("/register");
  //res.json({redirect: `/register`})
}
