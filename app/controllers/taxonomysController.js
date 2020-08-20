const Content         = require('../../core/models/contentModel');//you can include all your lib
let contentModel = new Content();

const Taxonomy         = require('../../core/models/taxonomyModel');//you can include all your lib
let taxonomyModel = new Taxonomy();

const ContentTaxonomy = require('../../core/models/contentTaxonomy');//you can include all your lib
let contenttaxonomy     = new ContentTaxonomy();

let bgCompanyModel      = require('../../core/models/bgCompanyModel');//you can include all your lib

async                   = require("async");
var lodash              = require('lodash');
var shuffle = require('shuffle-array');


// ** Content data by taxonomy **//
exports.getContentTaxonomys = async function(req, res) {
    
    var contentType     = (req.body.contentType) ? req.body.contentType : '';
    req.body.pageUrl    = (req.body.pageUrl).replace("knowledge-center/", "");
    var slug            = (req.body.pageUrl).split("/");
    var pageNumber      = req.body.page;
    var limit           = (req.body.limit) ? req.body.limit : 20;
    pageUrl             = req.body.pageUrl;

    var err = ""; 
    if (err) {

        res.json({'status':'fail','message':err});
        return;

    } 

    slug = slug[slug.length-1];

    contentTypeSlug = slug.split("_");

    var contentTypeData = await contentModel.getContentType(slug,contentTypeSlug,pageUrl).then(async function(contentTypeData) {
        return contentTypeData;
    });

    contentType = contentTypeData['contentType'];
    subHeading = contentTypeData['subHeading'];
    slug = contentTypeData['slug'];

    var taxonomyData = await taxonomyModel.getTaxonomyData(slug,contentTypeSlug,pageUrl).then(async function(taxonomyData) {
        return taxonomyData;
    });

    if(taxonomyData.length){


        taxonomyData = taxonomyData[0];

        data = taxonomyModel    .getTaxonomyWhere(taxonomyData,contentType);
        
        var total = await contentModel.getAll(constant.CONTENTS,data).then(async function(total) {
            return total;
        });

        var content = await taxonomyModel.getTaxonomyContentData(data,pageNumber,limit).then(async function(content) {
            return content;
        });


        res.json({'status':'success','message':'ok','data':content,'total' : total.length,'page':pageNumber,'contentTypeName':(taxonomyData) ? taxonomyData.tag : ''});
        return;    

    }else{


        await contentModel.getAll(constant.CONTENTS,{where : {"contents.magazine_id" : MAGAZINE_ID,"contents.slug":slug},orderBy : "contents.publish_date desc"}).then(async function(content) {

            res.json({'status':'success','message':'ok','data':content,'total' : 1,'page':pageNumber,'contentTypeName':slug});
            return;

        });
    }
}

// ** Top taxonomy data all taxonomy page**//

exports.getTopTaxonomys = async function(req, res) {

    var contentType     = (req.body.contentType) ? req.body.contentType : '';
    var slugUrl = req.body.pageUrl;
    req.body.pageUrl    = (req.body.pageUrl).replace("knowledge-center/", "");
    var slug            = (req.body.pageUrl).split("/");
    var taxonomySlug            = (req.body.pageUrl).split("/");
    var err = ""; 
    if (err) {

        res.json({'status':'fail','message':err});
        return;

    } 

    slug = slug[slug.length-1];
    contentTypeSlug = slug.split("_");

    var contentTypeData = await contentModel.getContentType(slug,contentTypeSlug,slugUrl).then(async function(contentTypeData) {
        return contentTypeData;
    });
    contentType = contentTypeData['contentType'];
    subHeading = contentTypeData['subHeading'];
    slug = contentTypeData['slug'];

    var taxonomyData = await taxonomyModel.getTaxonomyData(slug,contentTypeSlug,slugUrl).then(async function(taxonomyData) {
        return taxonomyData;
    });

    var taxonomy = await taxonomyModel.getTaxonomyList(contentTypeSlug,taxonomySlug,slugUrl).then(async function(taxonomy) {
        return taxonomy;
    });


    res.json({'status':'success','message':'ok','contentTypeName':(taxonomyData) ? taxonomyData.tag : slug,CONTENT_TAXONOMYS: taxonomy.data,'taxonomyHeading' : subHeading,all:taxonomy.all});
    return;

}

// ** Content data by content type **//
exports.getContentTypeContent = async function(req, res) {

    var contentType     = (req.body.contentType) ? req.body.contentType : '';
    var slug            = (req.body.pageUrl).split("/");
    var pageNumber      = req.body.page;
    var limit           = (req.body.limit) ? req.body.limit : 20;
    var MAGAZINE_ID      = req.body.magazineId;

    var err = ""; 
    if (err) {

        res.json({'status':'fail','message':err});
        return;

    } 
    if(slug){
        slug = (slug[slug.length-1]).split("_");
        slug = slug[1];
    }

    var contentTypeData = await contentModel.getContentTypeData(slug,contentType).then(async function(contentTypeData) {
        return contentTypeData;
    });
    

    var data = contentModel.getContentTypeContentWhere(contentTypeData,contentType);

    var total = await contentModel.getContentTypeContentCount(data,pageNumber).then(async function(total) {
        return total;
    });


    contentTypeData.tag = contentModel.getContentTypeTagName(contentType,contentTypeData.tag);


    var content = await contentModel.getContentTypeContent(data,contentTypeData,pageNumber,limit,contentType).then(async function(content) {
        return content;
    });
   
    res.json({'status':'success','message':'ok','data':content,'total' : total,'page':pageNumber,'contentTypeName':(contentTypeData) ? contentTypeData.tag : ''});
    return;
}

// ** Top taxonomy data all content type page**//
exports.getContentTypeTopTaxonomy = async function(req, res) {

    var slug            = (req.body.pageUrl).split("/");
    var MAGAZINE_ID      = req.body.magazineId;

    var err = ""; 
    if (err) {

        res.json({'status':'fail','message':err});
        return;

    } 

    slug = (slug[slug.length-1]).split("_");
    
    slug = slug[1];

    var contentTypeData = await contentModel.getAll(constant.CONTENTTYPES,{where:{'slug' : slug}}).then(async function(contentTypeData) {

        return contentTypeData[0];
    });
    

    var taxonomy = await taxonomyModel.getContentTaxonomyList(req.body.pageUrl,contentTypeData).then(async function(taxonomy) {

        return taxonomy;
    });


    res.json({'status':'success','message':'ok','contentTypeName':(contentTypeData) ? contentTypeData.tag : '',CONTENT_TAXONOMYS: taxonomy.data,all:taxonomy.all});
    return;   
}

// ** View content page data**//
exports.getViewContent = async function(req, res) {

    CONTENT_TAXONOMYS = IsJsonString(magazineDetail.site_options).KEYWORDS;
    CONTENT_KEYWORDS = (CONTENT_TAXONOMYS.value).split(",");


    var contentUrl     = (req.body.contentUrl) ? req.body.contentUrl : '';
    
   let data = contentModel.getViewContentWhere(contentUrl);


    contentModel.getAll(constant.CONTENTS,data).then(async function(contentData) {

        contentData = await contentModel.getViwContentData(contentData[0],CONTENT_KEYWORDS).then(async function(item1) {
            return item1;
        });  

        res.json({'status':'success','message':'ok','data':contentData});
        return;

    }).catch(function(error){

        res.json({'status':'fail','message':'NO record found','data':''});
        return;
    });


}
// ** All content tagged taxonomy data**//
exports.getContentTaxonomyTagged = async function(req, res) {

    var contentId     = (req.body.contentId) ? req.body.contentId : '';
    var MAGAZINE_ID      = req.body.magazineId;

    KNOWLEDGE_CENTER_TAXONOMY = await contenttaxonomy.getContentTaxonomyTagged(contentId,CONTENT_TAXONOMY).then( async function(item1){
                    return item1;
                });

    NEWS_TAXONOMY = await contenttaxonomy.getContentTaxonomyTagged(contentId,NEWS_TAXONOMY_ID).then( async function(item1){
                return item1;
            });

    taggedTaxonomy = {

        KNOWLEDGE_CENTER_TAXONOMY:KNOWLEDGE_CENTER_TAXONOMY,
        NEWS_TAXONOMY:NEWS_TAXONOMY
    };

    res.json({'status':'success','message':'ok','data':taggedTaxonomy});
    return;

}

// ** Releated content data according to company and contenttype base on view content page**//
exports.getContentReleated = async function(req, res) {

    var companyId     = (req.body.companyId) ? req.body.companyId : '';
    var contentType     = (req.body.contentType) ? req.body.contentType : '';
    var limit         = (req.body.limit) ? req.body.limit : 5;
    var pageNumber         = (req.body.page) ? req.body.page : 0;

    data = contentModel.getContentReleatedWhere(companyId,contentType);
    
    total = await contentModel.getAll(constant.CONTENTS,data).then(async function(item) {

        return item.length;

    });

    data.offset = (pageNumber) ? (pageNumber)*limit : 0;
    data.limit = limit;

    contentModel.getAll(constant.CONTENTS,data).then(function(contentData) {

        res.json({'status':'success','message':'ok','data':contentData,'total' : total});
        return;


    }).catch(function(error){

        res.json({'status':'fail','message':'NO record found','data':'','total' : ''});
        return;
    });
}

// ** Releated content data on view content page**//
exports.getReleatedContent = function(req, res) {

    var contentId     = (req.body.contentId) ? req.body.contentId : '';
    var limit         = (req.body.limit) ? req.body.limit : '';

   let data = {

        where : { 
            "contents.id": contentId,

        },
        cols : "contents.related_content_ids"
    };

    contentModel.getAll(constant.CONTENTS,data).then(function(contentData) {


        where = contentModel.getReleatedContentWhere(contentData[0].related_content_ids,limit);

        contentModel.getAll(constant.CONTENTS,where).then(function(contentData) {

            res.json({'status':'success','message':'ok','data':contentData});
            return;

       });

    }).catch(function(error){

        res.json({'status':'fail','message':'NO record found','data':''});
        return;
    });
}

// ** Buyerguide company all company list and search filter**//
exports.buyersguideSearchDirectory = async function(req, res) {

    var slug          = (req.body.slug) ? req.body.slug : '';
    slug    = (slug).replace("all_companies", "");

    data = contentModel.getBuyersguideCategoryCountry(slug.split("/"));

    var category = data.category;
    var childCategory = data.childCategory;
    var country = data.country;
    var state = data.state;

    taxonomyData = await taxonomyModel.getBuyersguideTaxonomyList(category,childCategory).then(async function(item) {

        return item;
    });


    CatIds = taxonomyData.CatIds;
    taxonomyId = taxonomyData.taxonomyId;

    has_priority_listing = await contentModel.getAll(constant.PROPERTIES,{where:{'property_tag':'has_priority_listing','magazine_id':MAGAZINE_ID}}).then(async function(item) {

        return item[0];
    });

    has_microsite_listing = await contentModel.getAll(constant.PROPERTIES,{where:{'property_tag':'page_wide_layout','magazine_id':MAGAZINE_ID}}).then(async function(item) {

        return item[0];
    });

    has_featured_mircosite_listing = await contentModel.getAll(constant.PROPERTIES,{where:{'property_tag':'has_featured_mircosite_listing','magazine_id':MAGAZINE_ID}}).then(async function(item) {

        return item[0];
    });


    data = contentModel.getBuyersguideCompanyWhere(CatIds,category,childCategory,country,state);
 

    contentModel.getAll(constant.CONTENTS,data).then(async function(content) {

        content = contentModel.getBuyersguideCompanyFilter(content,taxonomyId,has_priority_listing,has_microsite_listing,has_featured_mircosite_listing,slug);

        res.json({'status':'success','message':'ok','data':content});
        return;

    }).catch(function(error){

        res.json({'status':'fail','message':'NO record found','data':''});
        return;
    });
 
}

// ** Buyerguide company company detail data**//
exports.viewBuyersguideSearchDirectory = async function(req, res) {


    var CONTENT_TAXONOMY = IsJsonString(magazineDetail.site_options).CONTENT_TAXONOMY;
    CONTENT_TAXONOMY = (CONTENT_TAXONOMY.value).split(",");

    var contentUrl     = (req.body.contentUrl) ? (req.body.contentUrl).split("/") : '';
    var url = '';
    for (var i = 3; i < contentUrl.length; i++) {
        if(i!=Number(contentUrl.length)-1){
            url += '/'+contentUrl[i];
        }     

    }

    contentUrl = contentUrl[0]+'/'+contentUrl[1]+'/'+contentUrl[2];


    has_priority_listing = await contentModel.getAll(constant.PROPERTIES,{where:{'property_tag':'has_priority_listing','magazine_id':MAGAZINE_ID}}).then(async function(item) {

        return item[0];
    });

    has_microsite_listing = await contentModel.getAll(constant.PROPERTIES,{where:{'property_tag':'page_wide_layout','magazine_id':MAGAZINE_ID}}).then(async function(item) {

        return item[0];
    });

    has_featured_mircosite_listing = await contentModel.getAll(constant.PROPERTIES,{where:{'property_tag':'has_featured_mircosite_listing','magazine_id':MAGAZINE_ID}}).then(async function(item) {

        return item[0];
    });

    data = contentModel.getViewBuyersguideCompanyWhere(contentUrl);


    contentModel.getAll(constant.CONTENTS,data).then(async function(content) {

        contents = await contentModel.getViewBuyersguideCompanyFilter(content[0],has_priority_listing,has_microsite_listing,has_featured_mircosite_listing).then(async function(items) {

            return items;
        });


        taxonomyData = await taxonomyModel.getBuyersguideCompanyTaxonomyList(CONTENT_TAXONOMY,content[0].id).then(async function(items) {

            return items;
        });


        contents.buyersguideCategory = taxonomyData;

        var selectedFilter ={
            'tag' : contents.title,
            'url' : url,
            'type' : 4
        }


        res.json({'status':'success','message':'ok','data':contents,'selectedFilter':selectedFilter});
        return;

    }).catch(function(error){

        res.json({'status':'fail','message':'NO record found','data':''});
        return;
    });
 
}

// ** Buyerguide company releated content data**//

exports.buyersguideReleatedContent = async function(req, res) {

    var contentType     = (req.body.contentType) ? req.body.contentType : '';
    var companyId     = (req.body.companyId) ? req.body.companyId : '';
    var slug            = (req.body.slug).split("/");

    var err = ""; 
    if (err) {

        res.json({'status':'fail','message':err});
        return;

    } 


    if(slug[3]){
        
        slug = (slug[3]).split("_");
        slug = slug[1];

    }else if(slug[2]){

        slug = (slug[2]).split("_");
        slug = slug[1];
    
    }else if(slug[1]){
    
        slug = (slug[1]).split("_");
        slug = slug[1];

    }else{
    
        slug = slug[0]

    }

    var contentTypeData = await contentModel.getAll(constant.CONTENTTYPES,{where:{'slug' : slug}}).then(async function(contentTypeData) {

            return contentTypeData[0];
    });

    var data = {

        where : { 

            "contents.magazine_id" : MAGAZINE_ID,
            "contents.published" : '1', 
            "contents.publish_date <=" : moment().format("YYYY-MM-DD HH:mm:ss"), 
            "contents.content_type_id": contentTypeData.id,
             "content_contents.content_id": companyId,
        },
        orderBy : "contents.publish_date desc",
        join : 'content_contents ON content_contents.associated_content_id = contents.id',
        cols : "contents.id,contents.primary_image,contents.title,contents.summary,contents.publish_date,contents.updated_at,contents.uploaded_by,contents.viewUrl"
    };          
    contentModel.getAll(constant.CONTENTS,data).then(async function(content) {

        res.json({'status':'success','message':'ok','data':content});
        return;
    }).catch(function(error){

        res.json({'status':'fail','message':'NO record found','data':''});
        return;
    });

}

// ** Buyerguide category  filter  data**//

async function buyersguideCategoryFilter (req, res) {

    var slug          = (req.body.slug) ? req.body.slug : '';
    slug    = (slug).replace("all_companies", "");
    
    slug = contentModel.buyersguideCategoryViewFilter(slug);

    data = contentModel.getBuyersguideCategory(slug.split("/"));
    var parentId = data.parentId;
    var child = data.child;
    var mainUrl = data.mainUrl;
    var country = data.country;
    var state = data.state;

    CONTENT_TAXONOMY = IsJsonString(magazineDetail.site_options).CONTENT_TAXONOMY;
    CONTENT_TAXONOMY = (CONTENT_TAXONOMY.value).split(",");

    var texonomy = [];

    for(const item in CONTENT_TAXONOMY){ 


        taxonomyData = await contentModel.getAll(constant.TAXONOMY,{where:{'magazine_id':MAGAZINE_ID,'slug':CONTENT_TAXONOMY[item]},'orderBy':'tag asc'}).then(async function(taxonomyData) {
            

            for(const item1 in taxonomyData){ 

                if(parentId!=""){
                    

                    content_type_id = 2543;
                    if((taxonomyData[item1].id=="17644" || taxonomyData[item1].id=="17673") && MAGAZINE_ID==5){
                        content_type_id = 2666;
                    }

                    where = contentModel.getBuyersguideCategoryWhere(content_type_id,taxonomyData[item1].id,country,state,child);

                    taxonomyData1 = await taxonomyModel.getBgDirectoryCategory(where).then(async function(taxonomyData1) {


                        for(const item2 in taxonomyData1){ 

                            taxonomyData1[item2].url = slug+'/'+taxonomyData1[item2].slug;
                        }

                        return taxonomyData1;

                    });

                    taxonomyData[item1].child = taxonomyData1;
                }

                if(s.length==1){

                    content_type_id = 2543;
                    where = {'content_type_id':content_type_id,'child_of':9760};
                    taxonomyData1 = await taxonomyModel.getBgDirectoryCategory(where).then(async function(taxonomyData1) {


                        for(const item2 in taxonomyData1){ 

                            taxonomyData1[item2].url = slug+'/'+taxonomyData1[item2].slug;
                        }

                        return taxonomyData1;

                    });

                    taxonomyData[item1].child = taxonomyData1;

                }

            }

            return taxonomyData
        
        });

        texonomy.push(taxonomyData);

    };

    parentName = {};
    childName = {};

    if(child){


        childName = {'tag':texonomy[0][0].child[0].tag,'url':mainUrl+'/'+parentId,'type':3};
        parentName = {'tag':texonomy[0][0].tag,'url':mainUrl,'type':2};
        texonomy = [];

    }else{
        
        if(parentId!=""){
            parentName = {'tag':texonomy[0][0].tag,'url':mainUrl,'type':2};
        }
    }

    res.json({'status':'success','message':'ok','data':texonomy,'parentName':parentName,"childName":childName});
    return; 
}

// ** Buyerguide category  data**//

exports.buyersguideCategory = async function(req, res) {

    var slug          = (req.body.slug) ? req.body.slug : '';

    slug = contentModel.buyersguideCategoryViewFilter(slug);

    if(MAGAZINE_ID==7){

        buyersguideCategoryFilter(req, res);
        return;
    }

    if(MAGAZINE_ID==5 || MAGAZINE_ID==9){
        slug    = (slug).replace("directory", "buyersguide");
    }
    slug    = (slug).replace("all_companies", "");

    data = contentModel.getBuyersguideCategory(slug.split("/"));

    var parentId = data.parentId;
    var child = data.child;
    var mainUrl = data.mainUrl;
    var country = data.country;
    var state = data.state;
    CatIds = [];

    CONTENT_TAXONOMY = IsJsonString(magazineDetail.site_options).CONTENT_TAXONOMY;
    CONTENT_TAXONOMY = (CONTENT_TAXONOMY.value).split(",");

    var texonomy = [];

    for(const item in CONTENT_TAXONOMY){ 


        taxonomyData = await contentModel.getAll(constant.TAXONOMY,{where:{'magazine_id':MAGAZINE_ID,'slug':CONTENT_TAXONOMY[item]},'orderBy':'tag asc'}).then(async function(taxonomyData) {
            

            for(const item1 in taxonomyData){ 
                 content_type_id = 2543;
                if((taxonomyData[item1].id=="17644" || taxonomyData[item1].id=="17673") && MAGAZINE_ID==5){
                    content_type_id = 2666;
                }

                where = contentModel.getBuyersguideCategoryWhere(content_type_id,taxonomyData[item1].id,country,state,parentId);

                taxonomyData1 = await taxonomyModel.getBgDirectoryCategory(where).then(async function(taxonomyData1) {


                    for(const item2 in taxonomyData1){ 

                        taxonomyData1[item2].url = slug+'/'+taxonomyData1[item2].slug;

                        if(parentId!=""){

                            where = contentModel.getBuyersguideCategoryWhere(content_type_id,taxonomyData1[item2].id,country,state,child);

                            taxonomyData2 = await taxonomyModel.getBgDirectoryCategory(where).then(async function(taxonomyData2) {

                                for(const item3 in taxonomyData2){ 

                                    taxonomyData2[item3].url = slug+'/'+taxonomyData2[item3].slug;

                                }

                                return taxonomyData2;
                            });

                            taxonomyData1[item2].child = taxonomyData2;
                        }

                    
                    }

                    return taxonomyData1;

                });

                taxonomyData[item1].child = taxonomyData1;

            }

            return taxonomyData
        
        });

        texonomy.push(taxonomyData);


    };

    data = contentModel.getBuyersguideCategorySelected(child,texonomy,mainUrl,parentId);
    parentName = data.parentName;
    childName = data.childName;
    taxonomy = data.taxonomy;

    res.json({'status':'success','message':'ok','data':taxonomy,'parentName':parentName,"childName":childName});
    return; 
}

// ** Buyerguide country and state  data**//
exports.buyersguideCountry = async function(req, res) {

    var slug          = (req.body.slug) ? req.body.slug : '';

    if(MAGAZINE_ID==5 || MAGAZINE_ID==9){
        slug    = (slug).replace("directory", "buyersguide");
    }
    slug    = (slug).replace("all_companies", "");

    slug = contentModel.buyersguideCategoryViewFilter(slug);

    data = contentModel.getBuyersguideCountry(slug.split("/"));
    
    parentId = data.parentId;
    subUrl = data.subUrl;
    child = data.child;
    category = data.category;
    childCategory = data.childCategory;
    mainUrl = data.mainUrl;
    s = (slug).split("/");

    taxonomyData = await taxonomyModel.getBuyersguideTaxonomyList(category,childCategory).then(async function(item) {

        return item;
    });

    taxonomyId = taxonomyData.taxonomyId;
    

        where = {'content_type_id':2543,'child_of':taxonomyId};
        if(parentId){
           code = parentId.split("_");
           where['code'] = code[1];
        }
   

        country = await taxonomyModel.getBgDirectoryCountry(where).then(async function(country) {

            for(const item in country){ 

                country[item].url = contentModel.getBuyersguideCountryFilterUrl(slug,country[item].iso_code,(slug).split("/"));


                if(parentId){
                    if(MAGAZINE_ID==5 || MAGAZINE_ID==9){
                        mainTaxonomyId = taxonomyId[0];
                        taxonomyId =[];
                        taxonomyId.push(mainTaxonomyId);
                    }
                    swhere = {'content_type_id':2543,'child_of':taxonomyId,'country_id':country[item].iso_code};

                    if(child){
                        code = child.split("_");
                        swhere.code = code[1];
                    }

                    state = await taxonomyModel.getBgDirectoryState(swhere).then(async function(state) {

                        for(const item1 in state){ 
                    

                            state[item1].url = contentModel.getBuyersguideStateFilterUrl(slug,country[item].iso_code,(slug).split("/"),state[item1].Code);

                           
                        }

                        return state;
                    });
                    country[item].child = state;
                } 
            
            }

            return country;
        });
    data = contentModel.getBuyersguideCountrySelected(mainUrl,subUrl,parentId,country);
    parentName = data.parentName;
    childName = data.childName;
    country = data.country;


    res.json({'status':'success','message':'ok','country':country,'parentName':parentName,'childName':childName});
    return; 
}


function IsJsonString(str) {
    try {
    return  JSON.parse(str);
    } catch (e) {
        return false;
    }
}
