const express = require("express");
const router = express.Router();

// Require middleware
const authUser = require("../middleware").authUser;

// Require route logic
const userRoutes = require("./user");
const courseRoutes = require("./course");

/****************
 * User Routes 
 ****************/

// GET /api/users
router.get("/users", authUser, userRoutes.getUsers);

// POST /api/users
router.post("/users", userRoutes.createUser);

/****************
 * Course Routes 
 ****************/

router.param("courseId", courseRoutes.paramCourseId);

// GET /api/courses
router.get("/courses", courseRoutes.getCourses);

// GET /api/courses/:courseId
router.get("/courses/:courseId", courseRoutes.getSpecificCourse);

// POST /api/courses
router.post("/courses", authUser, courseRoutes.createCourse);

// PUT /api/courses/:courseId
router.put("/courses/:courseId", authUser, courseRoutes.updateCourse);

// POST /api/courses/:courseId/reviews
router.post("/courses/:courseId/reviews", authUser, courseRoutes.createReview);

module.exports = router;