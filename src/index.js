const API_KEY = "";

async function getPlacesReviews(event) {
  const finalResponse = { reviews: [] };

  // temporario
  const addresses = [
    "R. Visc. de Pirajá, 595 - Ipanema, Rio de Janeiro - RJ, 22410-003",
    "R. Cap. Salomão, 11 - Humaitá, Rio de Janeiro - RJ, 22271-040",
    "Av. Ataulfo de Paiva, 1120 - loja c - Leblon, Rio de Janeiro - RJ, 22440-035",
  ];

  for (const address of addresses) {
    // busca ID do local
    const placeUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${address}&sensor=false&key=${API_KEY}`;
    const placeIdResponse = await fetch(placeUrl);
    if (placeIdResponse.status !== "OK") {
      return {
        statusCode: 500,
        body: JSON.stringify(placeIdResponse),
      };
    }
    const placeId = placeIdResponse.results[0].place_id;
    // busca reviews
    const reviewsUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&reviews_sort=newest&key=${API_KEY}`;
    const reviewsResponse = await fetch(reviewsUrl);
    if (reviewsResponse.status === "OK") {
      finalResponse.reviews.append(reviewsResponse.result.reviews);
    }
  }

  return {
    statusCode: 200,
    body: JSON.stringify(finalResponse),
  };
}

async function saveReviews(event) {}

module.exports = { getPlaceReviews, saveReviews };
