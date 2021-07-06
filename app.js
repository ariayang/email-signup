//To be included in almost every page:
const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");
const client = require("@mailchimp/mailchimp_marketing");
//const client = require("mailchimp-marketing");

const app = express();
app.use(express.static(__dirname));   //Tell the server to look for static, or any root folder when it's published
app.use(bodyParser.urlencoded({ extended: true })); 

app.get("/", function (req, res) {
    res.sendFile(__dirname + "/signup.html"); //from wherever current file resides in, open the index.html in it
});

app.get("/failure", function(req, res){
    //console.log('opening failure page');
    res.sendFile(__dirname + "/failure.html");
})

app.get("/success", function(req, res){
    res.sendFile(__dirname + "/success.html");
})

client.setConfig({
    apiKey: "dacf034f47cb2f49e660139543a85066-us6",
    server: "us6",  //Server name is the part after the dash in your API key. It should be something like "us1".
  });

app.post("/", function (req, res) {
    const firstName = req.body.firstName;   //using body-parser
    const lastName = req.body.lastName;
    const email = req.body.email;
    //console.log(firstName + " " + lastName + " " + email);
    let serverError = false;

    const subscribingUser = {firstName: firstName, lastName: lastName, email: email};
    const member = {
        email_address: email,
        status: "subscribed",
        merge_fields: {
            FNAME: firstName,
            LNAME: lastName
            } 
        };
    const members = [member];
    const addUser = async () => {
        try {
            const response = await client.lists.batchListMembers("10c98fb2c6", {
          members: [member],
        });
        //console.log(response);
        if (response.error_count !== 0) {
            serverError = true;
            //console.log("within if, inside async: " + serverError);
            //console.log("if serverError true: print " + serverError);
            res.sendFile(__dirname + "/failure.html");
        } else {
            //console.log("if serverError false: print " + serverError);
            res.sendFile(__dirname + "/success.html");
        } 
    } catch (error) {
        console.error(error);
    }
        }; 
             
    addUser();

});


//need to response to button type "submit" instead of button
app.post("/failure", function(req, res) {
    //console.log("button clicked");
    //res.sendFile(__dirname + "/signup.html"); //browser still shows /failure in the address
    res.redirect("/");
});

app.listen(3000, function () {
    console.log("Express server started on port 3000...");
});


//npm install @mailchimp/mailchimp_marketing

//mailchimp api key
//dacf034f47cb2f49e660139543a85066-us6

//mailchimp list id
//10c98fb2c6

//Now works locally and Heroku as well
//web: node app.js
// app.listen(process.env.PORT || 3000, function() {
//     console.log("Server started on Heroku or 3000 locally");
// });

