const request = require("postman-request");

const geocode = (address, callback) => {
  request(
    {
      url: `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
        address
      )}.json?access_token=pk.eyJ1IjoibG9oaXlhbGF2YXJ0aGkiLCJhIjoiY2t4cGR1anNoMXpqejJ2cGNwZml3Y3FkbiJ9.SH9okQSXKqrdM9hzimW1sQ`,
      json: true,
    },
    function (error, response, body) {
      if (error) {
        callback(`Unable to connect to weather Service`, undefined);
      } else if (body.features.length === 0) {
        callback(`Unable to find location , Try another search`, undefined);
      } else {
        if (response.statusCode == 200) {
          const { center, place_name } = body.features[0];
          const [longitude, latitude] = center;
          const data = {
            longitude,
            latitude,
            location: place_name,
          };
          callback("", data);
        }
      }
    }
  );
};
module.exports = geocode;
