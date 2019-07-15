const axios = require('axios');
const rateLimiter = require('axios-rate-limit');
const controller = rateLimiter(axios.create(), {maxRequests: 1, perMilliseconds: 2000})

class etsy {
   constructor() {
      this.base = "https://openapi.etsy.com/v2/";
   }

   async getListings(shop_id_or_name, limit) {
      const url = this.base + "shops/" + shop_id_or_name + "/listings/active?api_key=" + process.env.REACT_APP_ETSY_API_KEY + "&limit=" + limit + "&includes=MainImage";
      console.log("Etsy API request: ", url);
      const listings = await controller.get(url);
      return listings;
   }
}

module.exports = etsy;