const express = require("express");
const router = express.Router();

// Load required models
const Course = require("../db/models/course");
const Review = require("../db/models/review");

// Load middleware
const authUser = require("../middleware").authUser;

/*** 
 * Course Routes 
 ***/

const paramCourseId = (req, res, next, id) => {
  Course // Retrieve a specific course
    .findById(id)
    .exec((err, course) => { 
      if (err) {
        err.status = 400;
        return next(err);
      }
      
      req.course = course;
      return next();
    });
};

// GET /api/courses
const getCourses = (req, res, next) => {
  Course.find({}, { title: true }) // Retrieve all courses
    .exec((err, courses) => {
      if (err) return next(err);

      res.status(200);
      res.json(courses);
    });
};

// GET /api/courses/:courseId
const getSpecificCourse = (req, res, next) => {
  Course // Retrieve a specific course
    .findById(req.params.courseId)
    .populate({
      path: "user",
      select: "fullName",
      model: "User",
    })
    .populate("reviews")
    .exec((err, course) => { 
      if (err) return next(err);

      res.status(200);
      res.json(course);
      return res.end();
  });
};

// POST /api/courses
const createCourse = (req, res, next) => {
  // Creates a course
  const course = new Course(req.body);
  
  course.save(err => {
    if (err) {
      err.status = 400;
      return next(err);
    }

    res.status(201);
    res.location("/");
    return res.end();
  });
};

// PUT /api/courses/:courseId
const updateCourse = (req, res, next) => {
  // Update a specific course
  Course.updateOne({ _id: req.params.courseId }, req.body, err => {
    if (err) {
      err.status = 400;
      return next(err);
    }

    res.status(204);
    res.location(`/courses/${req.params.courseId}`);
    return res.end();
  });
};

// POST /api/courses/:courseId/reviews
const createReview = (req, res, next) => {
  if (req.currentUser._id == req.course.user) {
    const err = new Error("You are not allowed to review your own course.");
    err.status = 403;
    return next(err);
  }

  // Creates a review
  const review = new Review(req.body);
  
  // Saves the review
  review.save(err => {
    if (err) {
      err.status = 400;
      return next(err);
    }

    Course // Retrieve a specific course
      .findById(req.params.courseId)
      .populate("reviews")
      .exec((err, course) => { 
        if (err) {
          err.status = 400;
          return next(err);
        }
        
        // Adds the review to the course
        course.reviews.push(review);

        // Saves the course
        course.save(err => {
          if (err) {
            err.status = 400;
            return next(err);
          }

          res.status(201);
          res.location("/");
          return res.end();
        });
      });
  });
};

module.exports.paramCourseId = paramCourseId;
module.exports.getCourses = getCourses;
module.exports.getSpecificCourse = getSpecificCourse;
module.exports.createCourse = createCourse;
module.exports.updateCourse = updateCourse;
module.exports.createReview = createReview;