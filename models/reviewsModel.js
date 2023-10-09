const { Model } = require("objection");

class Reviews extends Model {
  static get tableName() {
    return "ReviewsTable";
  }
  static get idColumn() {
    return "id";
  }
  static get jsonSchema() {
    return {
      type: "object",
      required: ["autor", "comentario", "data", "loja"],

      properties: {
        id: { type: "integer" },
        autor: { type: "text", minLength: 1, maxLength: 255 },
        comentario: { type: "text", minLength: 1 },
        data: { type: "time" },
        loja: { type: "text", minLength: 1, maxLength: 255 },
      },
    };
  }
}

module.exports = { Reviews };
