const { Model } = require("objection");
const Knex = require("knex");
const dbConfig = require("../../config/db");
const { Reviews } = require("../../models/reviewsModel.js");
const crypto = require("crypto");

const knex = Knex({
  client: "pg",
  connection: dbConfig,
});

Model.knex(knex);

async function saveReviews(event) {
  const records = event.Records.map((record) => JSON.parse(record.body));

  const recordsWithHash = records.map((record) => ({
    id: crypto
      .createHash("md5")
      .update(`${record.autor}${record.data}${record.loja}`)
      .digest("hex"),
    ...record,
  }));

  const hashs = recordsWithHash.map((record) => record.id);
  const reviews = await Reviews.query().select("id").whereIn("id", hashs);
  const dataToInsert = recordsWithHash
    .filter((record) => !reviews.includes(record.id))
    .reduce((acc, curr) => {
      if (!acc.includes(curr)) acc.push(curr);
      return acc;
    }, []);

  await Reviews.query().insert(dataToInsert);
}

module.exports = { saveReviews };
