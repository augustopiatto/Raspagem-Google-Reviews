const { Model } = require("objection");

class Reviews extends Model {
  static get tableName() {
    return "reviews";
  }
  static get idColumn() {
    return "id";
  }
  static get jsonSchema() {
    return {
      type: "object",
      required: ["autor", "comentario", "data", "loja"],

      properties: {
        id: { type: "string" },
        autor: { type: "string", minLength: 1, maxLength: 255 },
        comentario: { type: "string" },
        data: { type: "string" },
        loja: { type: "string", minLength: 1, maxLength: 255 },
        rating: { type: "number" },
      },
    };
  }
}

module.exports = { Reviews };
