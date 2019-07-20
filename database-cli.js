require('dotenv').config();
const mongoose = require('mongoose');
const {cmsAdmin, cmsPage} = require('./models');
const bcrypt = require('bcrypt');

/*

Command-line tool for adding a new Administrator User or Initializing Site Content.

Arguments:
    -u --u --user --username | Username for adding a new user
    -p --p --password | Password foradding a new user
    --create_user --new_user -- create_new_user | [true or false] Boolean value for triggering creation of a new user
    --init --initialize | Seed DB with starting site content

*/

let args = process.argv.reduce((acc, arg, i, args) => {
    const val = args[i+1];
    if (arg.search(/^-?-u/i) !== -1) acc['user'] = val;
    else if (arg.search(/^-?-p/i) !== -1) acc['password'] = val;
    else if (arg.search(/create.+user|new.+user/i) !== -1) acc['newUser'] = val;
    else if (arg.search(/init\w?/i) !== -1)acc['init'] = val;
	return acc;
}, {});
args['init'] = args['init'] == 'true' ? true : false;
args['newUser'] = args['newUser'] == 'true' ? true : false;
console.log(args);


if ([0, 3].includes(mongoose.connection.readyState)) mongoose.connect(process.env.MONGO_DB, {useNewUrlParser: true});

if (args.user && args.password && args.newUser) {
    console.log("Adding A New Administrator");
    const saltRounds = 12;
    bcrypt.hash(args.password, saltRounds, function (err, hash) {
        if (err) console.error(err);
        console.log("Hash:", hash);
        if (hash) {
            cmsAdmin.findOne({user: args.user}, async function (err, user) {
                if (err) console.error(err);
                if (user) console.log("User with that username already in DB");
                else {
                    const newAdmin = new cmsAdmin({user: args.user, password: hash});
                    await newAdmin.save();
                    return console.log("Created New Admin User:", args.user);
                }
            })
        }
    })
}

if (args.init == true) {
    cmsPage.findOne({name: "About"}, function (err, page) {
        if (err) console.error(err);
        if (page) console.log("About Page already created");
        else {
            const aboutPage = new cmsPage({name: "About", contents: {
                welcome: "Welcome",
                motto: "This is our motto...",
                description: "This is a description of our business. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec finibus diam vitae enim ultrices sollicitudin. Integer viverra mi a dolor pulvinar bibendum. In hac habitasse platea dictumst. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Proin lacinia condimentum urna, eget tincidunt nibh semper at. Proin ultrices lobortis venenatis. Etiam consequat purus ullamcorper venenatis dignissim. Aliquam nulla erat, efficitur auctor nisi at, tempor ornare felis. Mauris pellentesque dignissim hendrerit. Nam euismod volutpat lobortis."
            }});
            aboutPage.save();
        }
    });
    cmsPage.findOne({name: "Home"}, function (err, page) {
        if (err) console.error(err);
        if (page) console.log("Home Page already created");
        else {
            const homePage = new cmsPage({name: "Home", contents: {
                shop: "T.n.T. Briggs Design"
            }});
            homePage.save();
        }
    })
}
