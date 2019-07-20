const mongoose = require('mongoose');


const cmsSchema = new mongoose.Schema({
    name: String,
    contents: {},
    modified: {type: Date, default: Date.now()}
});


const cmsAdminSchema = new mongoose.Schema({
    user: String,
    password: String
});


const cmsAdmin = mongoose.model('CMS Admin', cmsAdminSchema);
const cmsPage = mongoose.model('CMS', cmsSchema);



module.exports = {
    cmsAdmin: cmsAdmin,
    cmsPage: cmsPage
};
