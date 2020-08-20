
const Content           = require('../../core/models/contentModel');//you can include all your lib
contentModel = new Content();

const ContentTaxonomy = require('../../core/models/contentTaxonomy');//you can include all your lib
let contenttaxonomy = new ContentTaxonomy();

//** Get home page box  content data**//
exports.getBoxContent = function(req, res) {

    var id     = req.body.id;

    let options        = (req.body.id).split(",");
    let  contentType    = options[0];
    let  limit          = (options[1]) ? options[1] : 5;

    let date =  moment().format("YYYY-MM-DD HH:mm:ss");


    let wdata = {
        where : {'id' : contentType}
    }
    contentModel.getAll(constant.CONTENTTYPES,wdata).then(function(result) {

        let data = contentModel.getBoxContentWhere(contentType,limit);

        contentModel.getAll(constant.CONTENTS,data).then(function(allContents) {
          
            res.json({'status':'success','message':'ok','data':allContents,contentType:result});
            return;
        })

	}).catch(function(error){

        res.json({'status':'fail','message':'NO record found','data':''});
        return;
    });


}

//** Get home page slider  content data**//
exports.getHomeSliderContent = function(req, res) {

    var id     = req.body.id;

    let options        = (req.body.id).split(",");
    let  contentType    = options[0];
    let  limit          = (options[1]) ? options[1] : 5;

   let data = contentModel.getHomeSliderWhere(contentType,limit);

    contentModel.getAll(constant.CONTENTS,data).then(function(allContents) {
      
        res.json({'status':'success','message':'ok','data':allContents});
        return;

    }).catch(function(error){

        res.json({'status':'fail','message':'NO record found','data':''});
        return;
    });


}

//** Get content data**//
exports.getContent = function(req, res) {

    var contentType     = req.body.contentType;
    var page            = req.body.page;
    var limit           = (req.body.limit) ? req.body.limit : 20;
    var err = ""; 

    if (contentType == '') {

        err =  'contentType is required';
 
    }   
    if (err) {

        res.json({'status':'fail','message':err});
        return;

    } 

    contentType    = req.body.contentType;
    page           = (page) ? (page)*limit : 0;


    let data = contentModel.getContentWhere(contentType);

    contentModel.getAll(constant.CONTENTS,data).then(function(countsContents) {

        data.limit = limit;
        data.offset = page;

        contentModel.getAll(constant.CONTENTS,data).then(function(allContents) {
       
            res.json({'status':'success','message':'ok','data':allContents,'total' : countsContents.length});
            return;

        });

    }).catch(function(error){

        res.json({'status':'fail','message':'NO record found','data':''});
        return;
    });

}

//** get All dynamic query **//
exports.getAll = function(req, res) {

    var table           = req.body.table;
    var where           = req.body.where;
    var orderBy         = req.body.orderBy;
    var join            = req.body.join;
    var cols            = req.body.cols;
    var page            = req.body.page;
    var limit           = (req.body.limit) ? req.body.limit : 20;

    var data = {};

    if(where)
        data.where   = JSON.parse(where);

    if(orderBy)
        data.orderBy = orderBy;

    if(join)
        data.join    = join;

    if(cols)
        data.cols    = cols;

    if(limit)
        data.limit   = limit;

    if(page)
        data.offset  = page;


    contentModel.getAll(table,data).then(function(allContents) {

        res.json({'status':'success','message':'ok','data':allContents});
        return;


    }).catch(function(error){

        res.json({'status':'fail','message':'NO record found','data':''});
        return;
    });

}

//** Data save dynamic query **//
exports.save = function(req, res) {

    let table  = req.body.table;
    let data   = JSON.parse(req.body.data);
    
    var err = ""; 

    if (table == '') {

        err =  'table is required';
 
    }   
    if (err) {

        res.json({'status':'fail','message':err});
        return;

    }


    contentModel.save(table,data).then(function(countsContents) {

        res.json({'status':'success','message':'Data saved successfully'});
        return;


    }).catch(function(error){

        res.json({'status':'fail','message':'something went wrong'});
        return;
    });

}
//** Data delete dynamic query **//
exports.delete = function(req, res) {

    let table  = req.body.table;
    let where   = JSON.parse(req.body.data);
    
    var err = ""; 

    if (table == '') {

        err =  'table is required';
 
    }   
    if (err) {

        res.json({'status':'fail','message':err});
        return;

    }


    contentModel.deleteData(table,where).then(function(countsContents) {

        res.json({'status':'success','message':'Data deleted successfully'});
        return;


    }).catch(function(error){

        res.json({'status':'fail','message':'something went wrong'});
        return;
    });

}

//** get content type data **//
exports.getContentType = async function(req, res) {

    value = myCache.get( "content"+MAGAZINE_ID);
    if ( value != undefined ){
        
        res.json({'status':'success','message':'ok','country':value});
        return; 
    }


    var data = contentModel.getContentTypeWhere();

    contentModel.getAll(constant.CONTENTTYPES,data).then(function(content) {
        myCache.set( "content"+MAGAZINE_ID, content);
        res.json({'status':'success','message':'ok','data':content});
        return;

    }).catch(function(error){

        res.json({'status':'fail','message':'NO record found','data':''});
        return;
    });


}

//** get search bg company data **//
exports.getSearchBgCompanies = async function(req, res) {

    var search          = (req.body.search) ? req.body.search : '';
    var searchDateFrom  = (req.body.searchDateFrom) ? req.body.searchDateFrom : '';
    var searchDateTo  = (req.body.searchDateTo) ? req.body.searchDateTo : '';
    var content_type_id  = (req.body.contentTypeId) ? req.body.contentTypeId : '';
    var pageNumber      = req.body.page;
    var limit           = (req.body.limit) ? req.body.limit : 20;

    var err = ""; 
    if (err) {

        res.json({'status':'fail','message':err});
        return;

    } 

    bgCategories = [];     
    bgTopCompanies = [];     

    if(content_type_id!=2543){

            bgCategories = await contentModel.getAll(constant.TAXONOMY,{'where':{'magazine_id':MAGAZINE_ID},'like' : {'tag' : search},orderBy:'tag asc','limit':10}).then(async function(item) {

                return item;
            });

            tag = await contentModel.getAll(constant.TAXONOMY,{'where':{'magazine_id':MAGAZINE_ID},'like' : {'tag' : search},orderBy:'tag asc'}).then(async function(item) {

                    data = [];

                    item.forEach(items => {
                        
                        data.push(items.id);  
                        
                    });

                return data;
            });

            var data = contentModel.searchBgCompaniesWhere(tag,search);

            has_priority_listing = await contentModel.getAll(constant.PROPERTIES,{where:{'property_tag':'has_priority_listing','magazine_id':MAGAZINE_ID}}).then(async function(item) {

                return item[0];
            });

            page_wide_layout = await contentModel.getAll(constant.PROPERTIES,{where:{'property_tag':'page_wide_layout','magazine_id':MAGAZINE_ID}}).then(async function(item) {

                return item[0];
            });

            has_featured_mircosite_listing = await contentModel.getAll(constant.PROPERTIES,{where:{'property_tag':'has_featured_mircosite_listing','magazine_id':MAGAZINE_ID}}).then(async function(item) {

                return item[0];
            });


            bgTopCompanies = await contentModel.getAll(constant.CONTENTS,data).then(async function(item) {

                item.forEach(contents => {
                    contents.has_priority_listing = 0;
                    contents.page_wide_layout = 0;
                    contents.has_featured_mircosite_listing = 0;
                    if(IsJsonString(contents.resource_properties_remaining)!=false){

                        if(has_priority_listing.id in IsJsonString(contents.resource_properties_remaining)){
                           
                            contents.has_priority_listing = 1;
                        }
                        if(page_wide_layout.id in IsJsonString(contents.resource_properties_remaining)){
                           
                            contents.page_wide_layout = 1;
                        }
                        if(has_priority_listing.id in IsJsonString(contents.resource_properties_remaining)){
                           
                            contents.has_featured_mircosite_listing = 1;
                        }
                    }
                                    
                });

                return item;
            });

    }

    res.json({'status':'success','message':'ok','bgCategories':bgCategories,'bgTopCompanies' : bgTopCompanies});
    return;
        

}
//** get search content data **//
exports.getSearchContent = async function(req, res) {

    var search          = (req.body.search) ? req.body.search : '';
    var searchDateFrom  = (req.body.searchDateFrom) ? req.body.searchDateFrom : '';
    var searchDateTo  = (req.body.searchDateTo) ? req.body.searchDateTo : '';
    var content_type_id  = (req.body.contentTypeId) ? req.body.contentTypeId : '';
    var pageNumber      = req.body.page;
    var limit           = (req.body.limit) ? req.body.limit : 20;

    var err = ""; 
    if (err) {

        res.json({'status':'fail','message':err});
        return;

    } 
    var gdata = {};
    if(pageNumber==0){

        gdata = await contentModel.googleSearch(search).then(async function(data) {

           return data;

        }).catch(function(error){

            res.json({'status':'fail','message':'NO record found','data':''});
            return;
        });

    }

    var data = contentModel.searchContentWhere(search,gdata,searchDateFrom,searchDateTo,content_type_id);

    total = await contentModel.getAll(constant.CONTENTS,data).then(async function(total) { 
        return total.length;
    });
    

    data.limit       = limit;
    data.offset  = (pageNumber) ? (pageNumber)*limit : 0;


    await contentModel.getAll(constant.CONTENTS,data).then(async function(content) {

        for(const item in content){  

            KNOWLEDGE_CENTER_TAXONOMY = await contenttaxonomy.getContentTaxonomyTagged(content[item].id,CONTENT_TAXONOMY).then( async function(item1){
                            return item1;
            });

            content[item].taggedTaxonomy = {

                KNOWLEDGE_CENTER_TAXONOMY:KNOWLEDGE_CENTER_TAXONOMY,
                NEWS_TAXONOMY:{}
            };
        
        };

        res.json({'status':'success','message':'ok','data':content,'total' : total,'page':pageNumber});
        return;

    }).catch(function(error){

        res.json({'status':'fail','message':'NO record found','data':'','total' : 0});
        return;
    });


}
//** spot light company box data **//
exports.spotLightCompaniesBox = async function(req, res) {

    microSitePackageIds = await contentModel.getAll(constant.PACKAGES,{where:{'magazine_id':MAGAZINE_ID},like : {'title':"Microsite"},cols:'id'
    }).then(async function(items) {

        return items[0].id;
    });

    var data = contentModel.spotLightCompaniesBoxWhere(microSitePackageIds);
    contentModel.getAll(constant.CONTENTS,data).then(async function(content) {

        content.forEach(contents => {
            contents.has_priority_listing = 0;
            contents.has_microsite_listing = 0;
            contents.has_featured_mircosite_listing = 0;                        
        });

        res.json({'status':'success','message':'ok','data':content});
        return;

    }).catch(function(error){

        res.json({'status':'fail','message':'NO record found','data':''});
        return;
    });

}

function IsJsonString(str) {
    try {
    return  JSON.parse(str);
    } catch (e) {
        return false;
    }
}


