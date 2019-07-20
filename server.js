if (process.env.NODE_ENV !== "production") require('dotenv').config(); // Development Module
const {cmsAdmin, cmsPage} = require('./models');
const Etsy = require('./etsy');
const async = require('async');
const express = require('express');
const path = require('path');
const helmet = require('helmet');
const multer = require('multer');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
mongoose.connect(process.env.MONGO_DB, {useNewUrlParser: true });


const app = express();
const etsy = new Etsy();
const form = multer().array()

app.use(express.static('./build'));
app.use(express.static('./cms/build'));
app.use(helmet());
app.use(form);



app.get('/', function (req, res) {
    console.log("Recieved Index Request");
    res.sendFile(path.join(__dirname, './build', 'index.html'));
});

app.get('/admin', function (req, res) {
    console.log("Recieved Admin Index Request");
    res.sendFile(path.join(__dirname, './cms', './build', 'index.html'));
});

app.get('/api/get-listings', async function (req, res) {
    console.log("Recieved Shop Listings Request");
    const shopName = process.env.SHOP;
    let listings = await etsy.getListings(shopName, 50);
    let results = listings.data.results;
    res.json(results);
})

app.get('/api/update', function (req, res) {
    console.log("Recieved Update Request");
    cmsPage.find({}, function (err, pages) {
        if (err) console.error(err);
        if (!pages) {
            console.error("DB Error Likely. No Site Pages Were Found");
            return res.json({fail: "DB Error Likely. No Site Pages Were Found"})
        }
        let response = pages.map(page => {
            // Preprocess Pages Here
            let clone = Object.assign({}, page._doc);
            delete clone._id;
            delete clone.__v;
            // End Preprocessing
            return clone;
        });
        return res.json(response);
    });
});

app.post('/api/cms', async function (req, res) {
    console.log("Recieved CMS Change Request");
    const changes  = await JSON.parse(req.body.updates);
    const user = req.body.user;
    const password = req.body.password;
    if (typeof changes !== "object") return res.json({fail: "No Valid Updates Were Requested"});
    const pageNames = changes.reduce((acc, p) => {
              if (!acc.includes(p.name)) acc.push(p.name);
              return acc;
            }, []);
    cmsAdmin.findOne({user: user}, function (err, admin) {
        if (err) return console.error(err);
        if (!admin) return res.json({fail: "Username or Password are Incorrect"});
        bcrypt.compare(password, admin.password, (err, verified) => {
            if (err) console.error(err);
            if (!verified)  return res.json({fail: "Username or Password are Incorrect"});
            else {
                cmsPage.find({name: {$in: pageNames}}, async function (err, pages) {
                    if (err) console.error(err);
                    async.each(changes, async (update, callback) => {
                        let page = pages.find(p => p.name === update.name);
                        if (page) {
                            page.contents = Object.assign(page.contents, update);
                            if (page.contents.hasOwnProperty("name")) delete page.contents.name;
                            page.modified = Date.now();
                            console.log("CMS Page Change:", page);
                            page.markModified('contents');
                            page.markModified('modified');
                            await page.save((err, p) => {if (err) callback(err)});
                        }
                    }, (err) => {
                        if (err) {
                            console.error(err);
                            return res.json({fail: err});
                        }
                        return res.json({success: "Site content has been updated"})
                    });
                });
            };
        });
    });
});


app.listen(5000);


async function addImagesToListing(listing) {
    let listingImages = await etsy.getListingImage(listing.listing_id);
    listingImages = listingImages.data.results[0];
    listing.images = listingImages;
    return listing;
};