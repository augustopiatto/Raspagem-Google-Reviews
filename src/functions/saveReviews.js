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
  const reviewsIds = reviews.map((review) => review.id);

  const filteredReviews = recordsWithHash.filter(
    (record) => !reviewsIds.includes(record.id)
  );
  const dataToInsert = filteredReviews.filter((review, idx) => {
    return idx === filteredReviews.findIndex((el) => review.id === el.id);
  }, []);

  if (dataToInsert.length) await Reviews.query().insert(dataToInsert);
}

module.exports = { saveReviews };
