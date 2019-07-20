## [Try It Live](https://react-etsy.herokuapp.com "React-Etsy Demo")

# Etsy-React App
## Main App
This is a template web application intended for custom Etsy shops.

The landing page loads a particular Etsy Shop's active listings and displays each item for sale in a card. When a user clicks on a card it routes them directly to the purchase page on Etsy.
Each card will render the items title, main image, description, and price/currency.

## Content Management System
The Administrator Portal can be accessed at the "/admin" route. Here, a site admin can manage the content displayed on the main app. Shop Name, Contact Email, and About page elements are all easily configurable out-of-the box. The "database-cli.js" tool can be used to seed a Mongo database with initial site content, as well as adding administrator user accounts. All passwords are hashed with bcrypt before storage.

Source can be found in the "/cms" directory

## Server
The backend is built on Node/Express. The server manages all Etsy API calls and proxys the site content between the database, CMS, and main app. It is secured with HelmetJS.

### Needed Environmental Variables
SHOP - The Etsy Shope Name, used in the API calls (This can be different from the chosen Shop Name managed via CMS)

ETSY_API_KEY - developer API key aquired from Etsy

MONGO_DB - URI for mongo database
