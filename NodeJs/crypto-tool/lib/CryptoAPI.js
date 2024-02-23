const axios = require("axios");
require("colors");

class CryptopApi {
  constructor(apiKey) {
    this.apiKey = apiKey;
    this.baseURL = "https://rest.coinapi.io/v1/exchangerate";
  }

  async getPriceData(coinOption, curOption) {
    try {
      // Formater for currency
      const formatter = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: curOption,
      });
      const res = await axios.get(
        `${this.baseURL}/${coinOption}/${curOption}`,
        {
          headers: {
            Accept: "application/json",
            "X-CoinAPI-Key": this.apiKey,
          },
        },
      );

      let output = "";

      // Check if the response data is an array or an object
      if (Array.isArray(res.data)) {
        res.data.forEach((coin) => {
          output += `Coin: ${coin.asset_id_base.yellow} | Price: ${formatter.format(coin.rate).green}\n`;
        });
      } else if (typeof res.data === "object") {
        // If the response data is an object, process it accordingly
        output += `Coin: ${res.data.asset_id_base.yellow}\nPrice: ${formatter.format(res.data.rate).green}\n`;
      } else {
        output = "Unexpected response format";
      }
      return output;
    } catch (err) {
      handleAPIError(err);
    }
  }
}

function handleAPIError(err) {
  if (err.response.status === 401) {
    throw new Error("Your API key is invalid");
  } else if (err.response.status === 404) {
    throw new Error("Your API is not responding");
  } else {
    throw new Error("Something is not working");
  }
}

module.exports = CryptopApi;
