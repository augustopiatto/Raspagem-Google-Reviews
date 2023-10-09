const { Model } = require("objection");

class Reviews extends Model {
  static get tableName() {
    return "ReviewsTable";
  }
}

module.exports = Reviews;
