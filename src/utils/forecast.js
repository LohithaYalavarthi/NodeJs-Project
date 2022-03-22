const request = require("postman-request");
const forecast = (latitude, longitude, callback) => {
  const url = `http://api.weatherstack.com/current?access_key=49aed2d561f77cfab3504e8b55a674ad&query=${latitude},${longitude}&units=f`;
  request(
    {
      url: url,
      json: true,
    },
    function (error, response, body) {
      if (error) {
        callback(`Unable to connect to weather Service`, undefined);
      } else if (body.error) {
        callback(`Unable to find location`, undefined);
      } else {
        if (response.statusCode == 200) {
          const { temperature, humidity, weather_descriptions } = body.current;
          callback(
            undefined,
            `${weather_descriptions[0]} It is currently ${temperature} degrees out. It feels like ${humidity} degrees out.`
          );
        }
      }
    }
  );
};
module.exports = forecast;
