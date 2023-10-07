const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;

async function getPlacesReviews(event) {
  const finalResponse = { reviews: [] };

  // temporario
  const addresses = [
    "Nema - R. Visc. de Pirajá, 595 - Ipanema, Rio de Janeiro - RJ, 22410-003",
    "Nema - R. Cap. Salomão, 11 - Humaitá, Rio de Janeiro - RJ, 22271-040",
    "Nema - Av. Ataulfo de Paiva, 1120 - loja c - Leblon, Rio de Janeiro - RJ, 22440-035",
  ];

  for (const address of addresses) {
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
    // busca reviews
    const reviewsUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&reviews_sort=newest&key=${GOOGLE_API_KEY}`;
    const reviewsResponse = await fetch(reviewsUrl);
    const reviewsResponseJson = await reviewsResponse.json();
    if (reviewsResponseJson.status === "OK") {
      finalResponse.reviews.push(...reviewsResponseJson.result.reviews);
    }
  }

  return {
    statusCode: 200,
    body: JSON.stringify(finalResponse),
  };
}

async function saveReviews(event) {}

module.exports = { getPlacesReviews, saveReviews };
