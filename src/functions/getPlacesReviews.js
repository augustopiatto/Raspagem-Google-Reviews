const { SQS } = require("@aws-sdk/client-sqs");
const crypto = require("crypto");
const chunkArray = require("../helpers/chunkArray.js");

const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;

//: https://stackoverflow.com/questions/49103137/why-does-aws-lambda-function-finishes-before-callback-function-is-executed
const wrappedGetPlacesReviews = async function (event) {
  const finalResponse = { reviews: [] };

  for (const address of event.addresses) {
    // busca ID do local
    const encodedAddress = encodeURIComponent(address);
    const placeUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodedAddress}&sensor=false&key=${GOOGLE_API_KEY}`;
    const placeIdResponse = await fetch(placeUrl);
    const placeIdResponseJson = await placeIdResponse.json();
    if (placeIdResponseJson.status !== "OK") {
      return {
        statusCode: 500,
        body: JSON.stringify(placeIdResponseJson.error_message),
      };
    }
    const placeId = placeIdResponseJson.results[0].place_id;
    const formattedAddress = placeIdResponseJson.results[0].formatted_address;
    // busca reviews
    const reviewsUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&reviews_sort=newest&key=${GOOGLE_API_KEY}`;
    const reviewsResponse = await fetch(reviewsUrl);
    const reviewsResponseJson = await reviewsResponse.json();
    if (reviewsResponseJson.status === "OK") {
      const reviews = reviewsResponseJson.result.reviews.map((review) => ({
        autor: review.author_name,
        comentario: review.text,
        data: new Date(review.time * 1000).toISOString(),
        loja: formattedAddress,
        avaliacao: review.rating,
      }));
      finalResponse.reviews.push(...reviews);
    }
  }
  // mandar pra fila (sqs)
  const sqs = new SQS();
  const entries = finalResponse.reviews.map((review) => ({
    Id: crypto.randomUUID(),
    MessageBody: JSON.stringify(review),
  }));
  const batches = chunkArray(entries, 10);
  for (batch of batches) {
    const params = {
      Entries: batch,
      QueueUrl: process.env.QUEUE_URL,
    };
    sqs.sendMessageBatch(params, function (error, data) {
      if (error) console.log(error, error.stack);
      else console.log(data);
      return;
    });
  }
};

function getPlacesReviews(event, context, callback) {
  return wrappedGetPlacesReviews(event).then(() => {
    callback(null, "Nice");
  });
}

module.exports = { getPlacesReviews };
