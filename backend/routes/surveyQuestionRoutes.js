const express = require('express');
const router = express.Router();
const surveyQuestionController = require('../controllers/surveyQuestionController');

// GET request to fetch survey questions
router.get('/', surveyQuestionController.getSurveyQuestions);

// POST request to add a new survey question
router.post('/', surveyQuestionController.createSurveyQuestion);

module.exports = router;
