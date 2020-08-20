const Content         = require('../../core/models/contentModel');//you can include all your lib
let contentModel = new Content();

exports.heapBox = function(req, res) {
 
    let options      = (req.body.id).split(",");

    let date =  moment().format("YYYY-MM-DD HH:mm:ss");
    let limit = (options[2]) ? options[2] : 5;


    let data = {

        where : {"contents.magazine_id" :  MAGAZINE_ID,"contents.published" : '1',"contents.publish_date <=" :date},
        orderBy : "'publish_date' DESC",
        limit : limit
    };

    if (options[1]) {

        data.where['content_taxonomy.taxonomy_id'] = options[1];
        data.join  = 'content_taxonomy ON contents.id = content_taxonomy.content_id';
    } else {
        data.where['heap_contents.heap_id'] = options[0];
        data.join  = 'heap_contents ON contents.id = heap_contents.content_id';
    }

    contentModel.getAll(constant.CONTENTS,data).then(function(allContents) {
      
        res.json({'status':'success','message':'ok','data':allContents});
        return;

    }).catch(function(error){

        res.json({'status':'fail','message':'NO record found','data':''});
        return;
    });


}

exports.heapContent = function(req, res) {



    var contentIds     = req.body.contentIds; 
    var heap_id     = req.body.heap_id;
    var priority     = req.body.priority;
    var heapTypeTitle     = req.body.heapTypeTitle;
    var err = ""; 

    if (contentIds == '') {

        err =  'contentIds is required';
 
    }  
    if (heapTypeTitle == '') {

        err =  'heapTypeTitle is required';
 
    }  
    if (heap_id == '') {

        err =  'heap_id is required';
 
    }   
    if (err) {

        res.json({'status':'fail','message':err});
        return;

    } 
    var where = '';
    var variables = {};


    let date =  moment().format("YYYY-MM-DD");  

    let data = {

        where : {"contents.magazine_id" :  MAGAZINE_ID,"contents.published" : '1', "heap_contents.heap_id": heap_id,"contents.publish_date <=" :date},
        cols : "*,heap_contents.priority,contents.id",
        join : "heap_contents ON heap_contents.content_id = contents.id",
        orderBy : "'heap_contents.priority' DESC",
        limit : '1',
    };

    a = (req.body.contentIds).split(",");
    if (req.body.contentIds) {
        data.whereNotIn = {key:"contents.id",value:a};
    }

    if (priority) {
        data.where['heap_contents.priority <= '] = priority;
    }

    contentModel.getAll(constant.CONTENTS,data).then(function(content) {

        variables.content = content[0];


        data.where = {"content_id" : content[0].id, "content_link_type": "video"};
       
        data.cols = data.join = data.whereNotIn = "";

        contentModel.getAll(constant.CONTENTLINKS,data).then(function(videos) {

            variables.videos = videos;

            res.json({'status':'success','message':'ok','data':variables});
            return;

        });


    }).catch(function(error){

        res.json({'status':'fail','message':'NO record found','data':''});
        return;
    });
}


exports.heapScroller = async function(req, res) {


    var pageUrl     = req.body.pageUrl; 
    var err = ""; 

    if (pageUrl == '') {

        err =  'pageUrl is required';
 
    }  

    if (err) {

        res.json({'status':'fail','message':err});
        return;

    } 
    var pageUrl     = (req.body.pageUrl).split("/"); 
    let date =  moment().format("YYYY-MM-DD");  

    let data = {

        where : {"magazine_id" :  MAGAZINE_ID,"published" : '1', "id": pageUrl[2]},
        limit : '1'
    };

    heap = await contentModel.getAll(constant.HEAPS,data).then(async function(result) {
        return result[0];
    });

    let tData = {

        where : {"magazine_id" :  MAGAZINE_ID,"published" : '1', "heap_type_id": heap.heap_type_id},
        orderBy : "publish_date DESC",
        cols : 'id,title,magazine_id',
        limit :8
    };

    contentModel.getAll(constant.HEAPS,tData).then(function(result) {
       
        res.json({'status':'success','message':'ok','data':result,currentHeap: pageUrl[2]});
        return;

    }).catch(function(error){

        res.json({'status':'fail','message':'NO record found','data':''});
        return;
    });
}

exports.getHeapContent = async function(req, res) {

   var pageUrl     = req.body.pageUrl; 
   var pageNumber     = req.body.pageNumber; 
   var types        = req.body.types; 
   var limit     = req.body.limit; 
    var err = ""; 

    if (pageUrl == '') {

        err =  'pageUrl is required';
 
    }  

    if (err) {

        res.json({'status':'fail','message':err});
        return;

    } 

    var pageUrl     = (req.body.pageUrl).split("/"); 
    var MAGAZINE_ID      = req.body.magazineId;
    var cols ="contents.id,contents.primary_image,contents.title,contents.summary,contents.publish_date,contents.updated_at,contents.uploaded_by,contents.viewUrl,contents.body,contents.author_name";
    if(types){
        var cols ="contents.id,contents.primary_image,contents.title";   
    }

    var data = {

        where : { 

            "contents.magazine_id" : MAGAZINE_ID,
            "contents.published" : '1', 
            "contents.publish_date <=" : moment().format("YYYY-MM-DD HH:mm:ss"), 
            "heap_contents.heap_id": pageUrl[2],

        },
        orderBy : "heap_contents.priority desc",
        join : 'heap_contents ON heap_contents.content_id = contents.id',
        cols : cols
    };

    if(types=="" && pageUrl[4]){
        data.where['contents.id >='] = pageUrl[4];
        if(MAGAZINE_ID==7){
           data.whereNotIn = {'key':'contents.id',value:['318119']};            
        }
    }
    total = 0;
    if(types==""){
        total = await contentModel.getAll(constant.CONTENTS,data).then(async function(total) {

            return total.length;
        });

        data.limit   = limit;
        data.offset  = (pageNumber) ? (pageNumber)*limit : 0;
    }

    contentModel.getAll(constant.CONTENTS,data).then(async function(content) {


        res.json({'status':'success','message':'ok','data':content,'total' : total,'page':pageNumber});
        return;

    }).catch(function(error){

        res.json({'status':'fail','message':'NO record found','data':'','total' : 0});
        return;
    });
}
