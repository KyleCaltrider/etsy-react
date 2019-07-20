const axios = require('axios');
const rateLimiter = require('axios-rate-limit');
const controller = rateLimiter(axios.create(), {maxRequests: 1, perMilliseconds: 2000})

class Etsy {
   /*
      Helper module for interacting with Etsy's API
      All shop listings are currently retrieved in one API call at the moment.
      To account for more frequent requests in the future, like if a pagination feature was added,
      a rate limit of 1 request per 2 seconds has been equipped. This limit is enforced by Etsy.
   */
   constructor() {
      this.base = "https://openapi.etsy.com/v2/";
   }

   async getListings(shop_id_or_name, limit) {
      const url = this.base + "shops/" + shop_id_or_name + "/listings/active?api_key=" + process.env.ETSY_API_KEY + "&limit=" + limit + "&includes=MainImage";
      console.log("Etsy API request: ", url);
      const listings = await controller.get(url);
      return listings;
   }
}

module.exports = Etsy;
