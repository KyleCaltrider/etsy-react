const helpers = {
    cleanText(text) {
        // Used to clean listing data coming from Etsy. It's pretty basic now.
        // - Converts Unicode values to Symbols
        // - Removes links
        // - Removes suspected HTML elements
        
        // Unicode to ASCII conversion
        text = text.replace(/&#\d+;/gi, unicode => String.fromCharCode(unicode.match(/\d+/)[0]));
        text = text.replace(/&quot;/gi, '"');
        // Scrub Any HTML Links/Elements
        const webAddresses = text.match(/\S*www.\S*|http\S*|\S*\.\w+\/\S+/gi);
        for (let i in webAddresses) {
          text = text.replace(webAddresses[i], "Etsy");
          // Making an assumption that all embedded links are to Etsy Product or Store,
          // which should make them redundent here anyway since the listing is a link
        }
        text = text.replace(/<.+>/g, "");
      
        return text;
      },

    randomWords(count) {
        // This function was mostly just used in development to generate fake listing data
        
      const randomNumb = () => {
        let num = 91;
        while ([91, 92, 93, 94, 95, 96].includes(num)){
          num = Math.floor(Math.random() * (123 - 65) + 65);
        }
        return num;
      }
      const randomLength = () => Math.floor(Math.random() * (12 - 2) + 2);
      const response = [];
      for (let i = 0; i < count; i++) {
        let word   = "",
            length = randomLength();
        for (let i = 0; i < length; i++) {
          word += String.fromCharCode(randomNumb());
        }
        response.push(word);
      }
      return response.join(' ');
    }
}

export default helpers;
