const express = require("express");
const router = express.Router();
const AuthController = require("./controllers/authControllers");
const authorization = require("./authorization");
const verifyjwt = require("./authorization");
router.post("/register", AuthController.registerUser);
router.post("/login", AuthController.loginUser);
router.get("/verified", authorization, AuthController.isVerified);
router.get("/fetchmovies", verifyjwt, AuthController.fetchMovies);

module.exports = router;
