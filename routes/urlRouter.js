const express = require("express");
const router = express.Router();
const {isLoggedIn} = require('../middlewares/auth');
const { createUrl, editUrl, deleteUrl, getAllUrls, redirectToOriginalUrl } = require('../controllers/urlController');

router.get('/all', isLoggedIn, getAllUrls)
router.get("/:shortUrl", redirectToOriginalUrl);

router.post("/shorten", isLoggedIn, createUrl)
router.put("/edit/:id", isLoggedIn, editUrl)

router.delete("/delete/:id", isLoggedIn, deleteUrl)

module.exports = router;