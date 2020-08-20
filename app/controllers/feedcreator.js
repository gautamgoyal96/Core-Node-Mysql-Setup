const Content           = require('../../core/models/contentModel');//you can include all your lib
let contentModel = new Content();
var xml = require('xml');
var RSS = require('rss');

var feed = new RSS({
   version : '2.0',
    custom_namespaces: {
      'itunes': 'http://www.itunes.com/dtds/podcast-1.0.dtd'
    },
    author : 'test',
    custom_elements: [

      {'itunes:image': {
      }},
      {'itunes:category': [
      ]}
    ]
});


exports.rss = function(req, res) {


    var contentType     = req.params.contentType;
    var MAGAZINE_ID     = req.params.magazineId;
    var err = ""; 

    if (contentType == '') {

        err =  'contentType is required';
 
    }   
    if (err) {
        res.set('Content-Type', 'text/xml');
        res.send(xml(err));

    } 


    let date       =  moment().format("YYYY-MM-DD HH:mm:ss");

    let data = {

        where : {"content_type_id":contentType,"contents.magazine_id" :  MAGAZINE_ID,"contents.published" : '1',"contents.publish_date <=" :date},
        orderBy : "publish_date desc",
        join : 'users ON users.id = contents.uploaded_by',
        cols : "contents.id,contents.primary_image,contents.title,contents.summary,contents.publish_date,contents.updated_at,contents.uploaded_by,users.firstName,users.lastName,users.webUserName,contents.viewUrl",
        limit : 15,
        offset : 0
    };


    contentModel.getAll(constant.CONTENTS,data).then(function(content) {

        for(const item in content){  

            feed.item({
                'id' : content[item].id,
                'title' : content[item].title,
                'description' : content[item].summary,
                'url' : magazineDetail.url+content[item].viewUrl,
                'date' : content[item].publish_date,
                'author' : content[item].webUserName +' ('+content[item].firstName+' '+content[item].lastName+')',
n            });

        };

        var xml = feed.xml({indent: true});
        res.set('Content-Type', 'text/xml');
        res.send(xml);
        return;

    }).catch(function(error){

        res.set('Content-Type', 'text/xml');
        res.send(xml('NO record found'));
    });

}