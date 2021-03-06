const Joi = require('joi');
const mongoose = require('mongoose');
const { Genre, genreSchema, validate } = require('./genre');

const schemaMovie = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    minlength: 5,
    maxlength: 255.
  },
  genre: {
    type: genreSchema, 
    required: true,
  },
  numberInStock: {
    type: Number,
    required: true,
    min: 0,
    max: 255,
  },
  dailyRentalRate: {
    type: Number,
    required: true,
    min: 0,
    max: 255,
  },
})

const Movie = mongoose.model('Movie', schemaMovie)

function validateMovie(movie) {
  const schema = {
    title: Joi.string().min(5).max(255).required(),
    genreId: Joi.string().required(),
    numberInStock: Joi.number().min(0).required(),
    dailyRentalRate: Joi.number().min(0).required(),
  }
  return Joi.validate(movie, schema)
}

module.exports.schemaMovie = schemaMovie
module.exports.Movie = Movie;
module.exports.validate = validateMovie;