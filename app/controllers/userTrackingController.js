// import entire SDK
var AWS = require('aws-sdk');
/*let awsConfig = {
    "region" : "",
    "endpoint" : "",
    "accessKeyId"
}*/

const mailgun = require("mailgun-js");

const Content           = require('../../core/models/contentModel');//you can include all your lib
let contentModel = new Content();

exports.userTracking = function(req, res) {

    const DOMAIN = 'https://api.mailgun.net/v3/sandbox026c0b65be3c46e19d5f9a7054f04449.mailgun.org';
    const api_key = "3774311abc157bb7d93650426bc6b45f-0a4b0c40-f3580231";
    const mg = mailgun({apiKey: api_key, domain: DOMAIN});
    const data = {
        from: 'Excited User <me@samples.mailgun.org>',
        to: 'gautam.goyal@bezoarsoftware.com',
        subject: 'Hello',
        text: 'Testing some Mailgun awesomness!'
    };
    mg.messages().send(data, function (error, body) {
        console.log(mg);
        console.log(error);
        console.log(body);
        console.log(data);
    });


   /* let object_type  = req.body.object_type;
    let object_id    = req.body.object_id;
    let req_url      = req.body.req_url;
    let http_referer = req.body.http_referer;
    let accessed_on  = moment().format("YYYY-MM-DD HH:mm:ss");
    let user_id      = req.body.user_id;
    let ref_type     = req.body.ref_type;
    let ref_id       = req.body.ref_id;
    let user_ip      = req.body.user_ip;
    let user_agent  = req.body.user_agent;

    var data = {

        'object_type' : {S: object_type},
        'object_id' : {S: object_id},
        'req_url' : {S: req_url},
        'http_referer' : {S: http_referer},
        'accessed_on' : {S: accessed_on},
        'user_id' : {N: user_id},
        'ref_type' : {S: ref_type},
        'ref_id' : {S: ref_id},
        'user_id' : {S: user_id},
        'user_agent' : {S: user_agent},
        id : {N: '1'}
    }*/
    // Set the region 
// AWS.config.update({region: 'us-east-1'});

// Create the DynamoDB service object
    /*var ddb = new AWS.DynamoDB({apiVersion: '2012-08-10'});

        var params = {
          TableName: 'UserTracking',
          Item:data
        };

    var params = {
          TableName: 'UserTracking',
          Key: {
            'id': {N: '1'}
          },
          ProjectionExpression: 'id,req_url'
        };*/

// Call DynamoDB to read the item from the table
/*ddb.getItem(params, function(err, data) {
  if (err) {
    console.log("Error", err);
  } else {
    console.log("Success", data.Item);
  }
});*/



        // Call DynamoDB to add the item to the table
/*        ddb.putItem(params, function(err, data) {
          if (err) {
            console.log("Error", err);
          } else {
            console.log("Success", data);
          }
        });
            console.log(data);*/

}

/*exports.userTracking = function(req, res) {

    let object_type  = req.body.object_type;
    let object_id    = req.body.object_id;
    let req_url      = req.body.req_url;
    let http_referer = req.body.http_referer;
    let accessed_on  = moment().format("YYYY-MM-DD HH:mm:ss");
    let user_id      = req.body.user_id;
    let ref_type     = req.body.ref_type;
    let ref_id       = req.body.ref_id;
    let user_ip      = req.body.user_ip;
    let user_agent  = req.body.user_agent;

    var data = {

        'object_type' : object_type,
        'object_id' : object_id,
        'req_url' : req_url,
        'http_referer' : http_referer,
        'accessed_on' : accessed_on,
        'user_id' : user_id,
        'ref_type' : ref_type,
        'ref_id' : ref_id,
        'user_id' : user_ip,
        'user_agent' : user_agent,
    }
    contentModel.save(constant.USER_TRACKING+MAGAZINE_ID,data).then(function(rs) {

        res.json({'status':'success','message':'Data saved successfully'});
        return

    }).catch(function(error){

        res.json({'status':'fail','message':'Something went wrong','data':error});
        return;
    });
}*/