const { Model } = require("objection");
const Knex = require("knex");
const dbConfig = require("../../config/db");
const Reviews = require("../models/reviewsModel.js");

const knex = Knex({
  client: "postgres",
  connection: dbConfig,
});

Model.knex(knex);

async function saveReviews(event) {
  const reviews = await Reviews.query();
  console.log(reviews);
}

module.exports = { saveReviews };
