const express = require("express");
const router = express.Router();

const dreamDates = require('./dreamDates.routes')
const AuthController = require("../controllers/auth.controller");
const authMiddleware = require("../middleware/authorization.middleware");


router.use('/dreamdates', dreamDates)
router.post("/register", AuthController.registerUser);
router.post("/login", AuthController.loginUser);
router.get("/verified", authMiddleware, AuthController.isVerified);
router.get("/fetchmovies", authMiddleware, AuthController.fetchMovies);

module.exports = router;