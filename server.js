const Etsy = require('./etsy');
const express = require('express');
const path = require('path');
const helmet = require('helmet');

const app = express();
const etsy = new Etsy();

app.use(express.static('./build'));
app.use(helmet());

app.get('/', function (req, res) {
    console.log("Sending Index Request");
    res.sendFile(path.join(__dirname, './build', 'index.html'))
});

app.get('/api/get-listings', async function (req, res) {
    console.log("Sending Shop Listings")
    const shopName = process.env.REACT_APP_SHOP;
    let listings = await etsy.getListings(shopName, 50);
    let results = listings.data.results;
    res.json(results);
})

app.listen(5000);


async function addImagesToListing(listing) {
    let listingImages = await etsy.getListingImage(listing.listing_id);
    listingImages = listingImages.data.results[0];
    listing.images = listingImages;
    return listing;
}