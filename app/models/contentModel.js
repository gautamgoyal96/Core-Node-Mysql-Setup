var shuffle = require('shuffle-array');

const MagazineContentType     = require('./magazineContentTypeModel');//you can include all your lib
let magazineContentTypeModel = new MagazineContentType();

class Content {


    updateData(table,set,where) {

        return new Promise((resolve, reject) => {

            query.update(table,set,where, (err, data) => {
                
                if (err){
                   reject(err);
                }else{
                    resolve(data);
                }
               
            });
        });
       
    }


    deleteData(table,newData) {

        return new Promise((resolve, reject) => {

            query.delete(table, newData, (err, data) => {
               
                if (err){
                   reject(err);
                }else{
                    resolve(data);
                }
               
            });
        });
       
    }

    save(table,newData) {

        return new Promise((resolve, reject) => {

            query.returning('id').insert(table, newData, (err, data) => {
                
                if (err){
                   reject(err);
                }else{
                    resolve(data);
                }
               
            });
        });
       
    }

   getAll(table,data) {

        return new Promise((resolve, reject) => {
            (data.cols) ? query.select(data.cols) : query.select('*');
            (data.whereNotIn) ? query.where_not_in(data.whereNotIn.key,data.whereNotIn.value) : '';
            (data.whereIn) ? query.where_in(data.whereIn.key,data.whereIn.value) : '';
            (data.where) ? query.where(data.where) : '';
            (data.orWhere) ? query.or_where(data.orWhere) : '';
            (data.like) ? query.like(data.like) : '';
            (data.join) ? query.join(data.join) : '';
            (data.join1) ? query.join(data.join1) : '';
            (data.join2) ? query.join(data.join2) : '';
            (data.join3) ? query.join(data.join3) : '';
            (data.join4) ? query.join(data.join4) : '';
             (data.join5) ? query.join(data.join5) : '';
            (data.limit) ? query.limit(data.limit) : '';
            (data.offset) ? query.offset(data.offset) : '';
            (data.orderBy) ? query.order_by(data.orderBy) : '';
            (data.group_by) ? query.group_by([data.group_by]) : '';

            query.get(table, (err, result) => {

                if (err){

                   reject(err);

                }else{

                    resolve(result);
                    
                }

            });
        });
       
    }

    getAllAds(sqlQuery){

        return new Promise((resolve, reject) => {

            var qb = query;        
            qb.query(sqlQuery, (err, result) => {

                if (err){

                  reject(err);

                }else{

                    resolve(result);
                    
                }

            });
        });

    }

    googleSearch(search) {

        request = require("request");


        return new Promise((resolve, reject) => {

            let options = "https://www.googleapis.com/customsearch/v1?key="+constant.GOOGLE_API_KEY+"&q="+search+"&cx="+constant.GOOGLE_SEARCH_ENGINE_ID+"&alt=json";
            request(options,function(error, response, body) {


                if(error){

                    reject(error);

                }else{   

                    const url = [];
                    const result = JSON.parse(body);

                    if(result.spelling){
                        
                        resolve(contentModel.googleSearch(result.spelling.correctedQuery));

                    }else{


                        if(result.items){
                            (result.items).forEach(results => {
                                const link = (results.link).split("/");
                                const linkData = "/"+link[3]+"/"+link[4]+"/"+link[5]+"/"+link[6]+"/";
                                url.push(linkData);
                            });
                            resolve(url);

                        }else{
                           reject('failed.....');
                        }
                    }
                }


            });            
        });
      
    }


    async getContentType(slug,contentTypeSlug,pageUrl) {

        return new Promise(async (resolve,reject) => {

            const Content         = require('./contentModel');//you can include all your lib
            let contentModel = new Content();

            var contentType;
            var subHeading;
            var taxonomyContentType;
            if(contentTypeSlug[0]=="view"){
               slug   = (pageUrl).split("/");
                if(slug.length==3){
                    slug = slug[1];

                }else{

                    slug = slug[0];
                }

               subHeading = (contentTypeSlug[1]).replace("-"," ");

               var contentType= await contentModel.getAll(constant.CONTENTTYPES,{where:{'slug' : contentTypeSlug[1]}}).then(async function(contentTypeData) {
                    return contentTypeData[0].id;
                });
              

            }
            resolve({'contentType':contentType,'subHeading':subHeading,slug:slug});


        });
    }

    async getContentTypeData(slug="",contentType) {

        return new Promise(async (resolve,reject) => {

            const Content         = require('./contentModel');//you can include all your lib
            let contentModel = new Content();
           
            var contentTypeData = [];

            var contentTypeData = await contentModel.getAll(constant.CONTENTTYPES,{where:{'slug' : slug}}).then(async function(contentTypeData) {

                return contentTypeData[0];
            });
              
            var contentTypeSlug = contentType.split(",");

            if(slug=='' && contentType!='' && contentTypeSlug.length==1){

                var contentTypeData = await contentModel.getAll(constant.CONTENTTYPES,{where:{'id' : contentType}}).then(async function(contentTypeData) {

                    return contentTypeData[0];
                });
            }

            resolve(contentTypeData);


        });
    }

    getContentTypeContentWhere(contentTypeData,contentType){


        var data = {

            where : { 

                "magazine_id" : MAGAZINE_ID,
                "published" : '1', 
                "publish_date <=" : moment().format("YYYY-MM-DD HH:mm:ss"), 
                "content_type_id": (contentTypeData.length!=0) ? contentTypeData.id : contentType.split(","),

            },
            orderBy : "contents.publish_date desc",
            cols : "contents.id,contents.primary_image,contents.title,contents.summary,contents.publish_date,contents.updated_at,contents.uploaded_by,contents.viewUrl,contents.body,contents.author_name"
        };
        

        if(contentTypeData.length!=0){


            if(contentTypeData.id!="2557" && contentTypeData.id!="2542" && contentTypeData.id!="2769" && contentTypeData.id!="2584" && contentTypeData.id!="2657" && contentTypeData.id!="2565" && contentTypeData.id!="2566" && contentTypeData.id!="2613" && contentTypeData.id!="2656" && contentTypeData.id!="2567" && contentTypeData.id!="2568" && contentTypeData.id!="2719"){
               var data = {

                    where : { 

                        "magazine_id" : MAGAZINE_ID,
                        "published" : '1', 
                        "publish_date <=" : moment().format("YYYY-MM-DD HH:mm:ss"), 
                        "content_type_id": (contentTypeData) ? contentTypeData.id : contentType.split(","),

                    },
                    orderBy : "contents.publish_date desc",
                    cols : "contents.id,contents.primary_image,contents.title,contents.summary,contents.publish_date,contents.updated_at,contents.uploaded_by,contents.viewUrl,contents.body,contents.author_name"//,users.firstName,users.lastName
                };
            }
            
            if(contentTypeData.id=="2653"){
                
                var data = {

                    where : { 

                        "magazine_id" : MAGAZINE_ID,
                        "published" : '1', 
                        "publish_date <=" : moment().format("YYYY-MM-DD HH:mm:ss"), 
                        "content_type_id": (contentTypeData) ? contentTypeData.id : contentType.split(","),

                    },
                    orderBy : (contentType=="2653") ? "contents.publish_date desc" : "contents.title asc",
                    cols : "contents.id,contents.title,contents.publish_date,contents.viewUrl,contents.summary,contents.body"
                };
            }

            if(contentTypeData.id=="2539"){

                var data = {

                    where : { 

                        "contents.magazine_id" : MAGAZINE_ID,
                        "contents.published" : '1', 
                        "contents.publish_date <=" : moment().format("YYYY-MM-DD HH:mm:ss"), 
                        "events.start_date >= " : moment().format("YYYY-MM-DD"), 
                        "content_type_id": (contentTypeData) ? contentTypeData.id : contentType.split(","),

                    },
                    orderBy : "events.start_date ASC",
                    join : 'events  on  contents.id= events.id',
                    cols : "contents.id,contents.title,contents.publish_date,contents.viewUrl,events.start_date,events.end_date,events.location,events.venue,events.contact,events.phone,events.start_time,events.end_time,events.website"
                };

            }
        }

        return data;
    }

    getContentTypeTagName(contentType,tagName){

        if(contentType=="2539,2559,2720,2585,2698,2557" || contentType == "2546,2501,2557,2539,2559,2542,2585,2560,2584,2698,2720,2722" || contentType == "2539,2585,2667,2698,2720,2542"){

            tagName = "Resources";

        }else if(contentType=="2499,2488,2557" ){

            tagName = "Research";

        }
        return tagName;

    }

    async getContentTypeContentCount(data,pageNumber) {

        return new Promise(async (resolve,reject) => {

            const Content         = require('./contentModel');//you can include all your lib
            let contentModel = new Content();
            var total;
            if(pageNumber == 0){

                total = await contentModel.getAll(constant.CONTENTS,data).then(async function(total) {

                    return total.length;
                });
                myCache.set( "totalContent"+MAGAZINE_ID, total); 

            }else{

                total = myCache.get( "totalContent"+MAGAZINE_ID);

            }
            resolve(total);


        });
    }

    async getContentTypeContent(data,contentTypeData,pageNumber,limit,contentType) {

        return new Promise(async (resolve,reject) => {

            const Content         = require('./contentModel');//you can include all your lib
            let contentModel = new Content();



            if(contentTypeData.id!="2653" && contentTypeData.id!="2539"){
                data.limit   = limit;
                data.offset  = (pageNumber) ? (pageNumber)*limit : 0;
            }

            if(contentType=="2653"){
                data.limit   = limit;
                data.offset  = (pageNumber) ? (pageNumber)*limit : 0;
            }

            var content = contentModel.getAll(constant.CONTENTS,data).then(async function(content) {

        

                if(contentTypeData.id!="2653" && contentTypeData.id!="2539"){



                    for(const item in content){  

                        content[item].companyDetail = [];
                        content[item].firstName = '';
                        content[item].lastName = '';
                        
                        if(contentTypeData.id==2557 || contentTypeData.id==2657){

                            cData = {
                                where:{'content_contents.associated_content_id':content[item].id},
                                join : 'contents ON contents.id = content_contents.content_id',
                                join1 : "asset_packages on asset_packages.resource_id = contents.id",
                                join2 : "packages on asset_packages.package_id = packages.id",
                                cols : 'contents.id,contents.title,contents.primary_image,packages.title as packagesName'
                            };
                            companyDetail = await contentModel.getAll(constant.CONTENT_CONTENTS,cData).then(async function(item1) {

                                return item1[0];

                            });

                            content[item].companyDetail = companyDetail;
                        }
           
                        
                        const ContentTaxonomy = require('./contentTaxonomy');//you can include all your lib
                        let contenttaxonomy     = new ContentTaxonomy();

                        var KNOWLEDGE_CENTER_TAXONOMY = await contenttaxonomy.getContentTaxonomyTagged(content[item].id,CONTENT_TAXONOMY).then( async function(item1){
                            return item1;
                        });


                        content[item].taggedTaxonomy = {

                            KNOWLEDGE_CENTER_TAXONOMY:KNOWLEDGE_CENTER_TAXONOMY,
                            NEWS_TAXONOMY:{}
                        };


                    };
                }
                return content;

            });            
            resolve(content);


        });
    }

    getViewContentWhere(contentUrl){
        var data;
        return data =  {

            where : { 

                "magazine_id" : MAGAZINE_ID,
                "published" : '1', 
                "publish_date <=" : moment().format("YYYY-MM-DD HH:mm:ss"), 
            },
            like : {"contents.viewUrl":contentUrl},
            orderBy : "contents.publish_date desc",
            join1 : 'content_types ON content_types.id = contents.content_type_id',
            cols : "contents.id,contents.content_type_id,contents.author_name,contents.primary_image,contents.title,contents.summary,contents.body,contents.publish_date,contents.uploaded_by,contents.viewUrl,content_types.short_tag,content_types.slug,contents.content_type_id,contents.magazine_id"
        };

    }

    async getContentCompany(contentData) {

        return new Promise(async (resolve,reject) => {

            const Content         = require('./contentModel');//you can include all your lib
            let contentModel = new Content();

            var companyDetail = {};
            if(contentData.content_type_id==2557){

                cData = {
                    where:{'content_contents.associated_content_id':contentData.id},
                    join : 'contents ON contents.id = content_contents.content_id',
                    join1 : "asset_packages on asset_packages.resource_id = contents.id",
                    join2 : "packages on asset_packages.package_id = packages.id",
                    cols : 'contents.id,contents.title,contents.primary_image,packages.title as packagesName'
                };
                companyDetail = await contentModel.getAll(constant.CONTENT_CONTENTS,cData).then(async function(item1) {

                    companyDetail = item1[0];

                   var  content_links = await contentModel.getAll(constant.CONTENTLINKS,{where:{'content_id':companyDetail.id}}).then(async function(item2) {
                        return item2;
                    });

                    var n = (companyDetail.primary_image).toString();
                    companyDetail.content_links = content_links;
                    companyDetail.primary_image_main = image.displayImageUrl(n);
                    return companyDetail
                });

            }
            resolve(companyDetail);
        })
    }


    async getContentKeywords(id,CONTENT_KEYWORDS) {

        return new Promise(async (resolve,reject) => {

            const ContentTaxonomy = require('./contentTaxonomy');//you can include all your lib
            let contenttaxonomy     = new ContentTaxonomy();

            var CONTENT_KEYWORDS = await contenttaxonomy.getContentTaxonomyTagged(id,CONTENT_KEYWORDS,25).then( async function(item1){
                    return item1;
                });

            shuffle(CONTENT_KEYWORDS);
            resolve((CONTENT_KEYWORDS).slice(0, 4));
        })
    }

    async getContentUserData(uploaded_by) {

        return new Promise(async (resolve,reject) => {

            const Content         = require('./contentModel');//you can include all your lib
            let contentModel = new Content();
            var firstName = "";
            var lastName = "";
            if(uploaded_by!=0){

                var USER_Data = await contentModel.getAll(constant.USERS,{where:{'id':uploaded_by}}).then(async function(item1) {
                        return item1[0];
                    });
                firstName = USER_Data.firstName;
                lastName = USER_Data.lastName;
            }
            resolve({'firstName':firstName,'lastName':lastName});
        })
    }

    async getViwContentData(contentData,CONTENT_KEYWORDS) {

        return new Promise(async (resolve,reject) => {

            const Content         = require('./contentModel');//you can include all your lib
            let contentModel = new Content();


            var content_links = await contentModel.getAll(constant.CONTENTLINKS,{where:{'content_id':contentData.id}}).then(async function(item1) {
                    return item1[0];
                });

            contentData.link = (content_links) ? content_links.link : '';
            contentData.link_title = (content_links) ? content_links.link_title : "";

            var USER_Data = await contentModel.getContentUserData(contentData.uploaded_by).then(async function(item) {
                return item;
            });
            contentData.firstName = USER_Data.firstName;
            contentData.lastName = USER_Data.lastName;

            contentData.companyDetail = await contentModel.getContentCompany(contentData).then(async function(item) {
                return item;
            });

            contentData.RELATED_SEARCHES = await contentModel.getContentKeywords(contentData.id,CONTENT_KEYWORDS).then(async function(item) {
                return item;
            });

            var video = await contentModel.getAll(constant.CONTENTLINKS,{where:{'content_id':contentData.id,'content_link_type':"video"},orderBy:'id desc'}).then(async function(item2) {
                        return item2;
                    });

            contentData.video = video;
            contentData.slider_image = [];
            
            resolve(contentData);


        });
    }

    getContentReleatedWhere(companyId,contentType){

        var data = {

            where : { 
                "contents.published" : '1', 
               "contents.publish_date <=" : moment().format("YYYY-MM-DD HH:mm:ss"), 
                'content_contents.content_id' : companyId,
                "magazine_id" : MAGAZINE_ID
            },
            join : 'content_contents ON contents.id = content_contents.associated_content_id',
            join1 : 'content_types ON contents.content_type_id = content_types.id',
            cols : "contents.id,contents.title,contents.viewUrl,contents.summary,contents.publish_date,contents.content_type_id,content_types.tag,contents.author_name",
            group_by : 'contents.id',
            orderBy : "contents.publish_date desc",
        }

        if(contentType){
        
            data.where['content_type_id'] = contentType;
        }else{

            data.where['content_type_id != '] = 2557;

        }

        return data;

    }

    getReleatedContentWhere(related_content_ids,limit){

        var str = related_content_ids;
        var related_content_id = str.replace(/"/g,'',).replace("[",'',).replace("]",'',)
        related_content_id = related_content_id.split(',')

        var data = {

            where : { 

            "published" : '1', 
            "publish_date <=" : moment().format("YYYY-MM-DD HH:mm:ss"), 
            },
            cols : "id,title,viewUrl,summary,publish_date,primary_image,author_name,body",
            whereIn :{'value' : related_content_id,'key':'id'},
            limit : limit
        }

        return data;


    }


    getBuyersguideCategoryCountry(slug){

        var category = '';
        var childCategory = '';
        var country = '';
        var state = '';

        if(slug.length==2){

            category = slug[1];
            if(slug[1].indexOf("C_")==0){
                country = slug[1]; 
            }

        }else if(slug.length==3){

            category = slug[2];
            country = slug[1];

            if(slug[2].indexOf("S_")==0){
                state = slug[2];
            }

            if(slug[1].indexOf("C_")!=0){


                if(slug[2].indexOf("S_")==0){
                    state = slug[1];

                }else{
                    parentId = slug[1];
                    childCategory = slug[2];
                }
            }
        }else if(slug.length==4){

            country = slug[1];
            category = slug[3];
            childCategory = "";
            if(slug[1].indexOf("C_")==0){
                if(slug[2].indexOf("S_")==0){
                    state = slug[2];
                    category = slug[3];

                }else{
                    category = slug[2];
                    childCategory = slug[3];
                }
            }

        }else if(slug.length==5){

            category = slug[3];
            childCategory = slug[4];
            country = slug[1];
            state = slug[2];
        }

        if(category.indexOf("C_")==0 || category.indexOf("S_")==0){
            category = "";
        }

        if(country.indexOf("C_")!=0){
            country = "";
        }

        if(childCategory.indexOf("C_")==0 || childCategory.indexOf("S_")==0){
            childCategory = "";
        }

        return {'category':category,childCategory:childCategory,country:country,state:state};


    }

    getBuyersguideCompanyWhere(CatIds,category,childCategory,country,state){

        var where = "contents.id IN (select content_taxonomy.content_id from content_taxonomy where taxonomy_id IN "+CatIds+")";
        var data;
        data = {
            'where':{
                'contents.magazine_id':MAGAZINE_ID,
                "contents.published" : '1',
                "contents.publish_date <=" : moment().format("YYYY-MM-DD HH:mm:ss"),
                "asset_packages.published" : '1'+" and asset_packages.resource = contents.resource_id",
                "asset_packages.expire_at >=" : moment().format("YYYY-MM-DD HH:mm:ss") +where,

            },
            join : "asset_packages on asset_packages.resource_id = contents.id",
            join1 : "packages on asset_packages.package_id = packages.id",
            join2 : "content_locations on content_locations.content_id = contents.id",
            join3 : "locations on locations.id = content_locations.location_id",
            join4 : "content_taxonomy on content_taxonomy.content_id = contents.id",
            join5 : "taxonomy on content_taxonomy.taxonomy_id = taxonomy.id",
            orderBy:'contents.title ASC',
            cols :'contents.id,contents.primary_image,contents.content_type_id,contents.title,contents.summary,contents.publish_date,contents.uploaded_by,contents.viewUrl,packages.title as packagesTitle,asset_packages.resource_properties_remaining as resource_properties_remaining,content_locations.location_id,locations.country,locations.state,locations.city,locations.address1,locations.zip,taxonomy.tag,taxonomy.slug',
            group_by : 'contents.id'
        };


        if(category){
            data.where['taxonomy.slug'] = category;
        }

        if(childCategory){

            data = {
                'where':{
                    'contents.magazine_id':MAGAZINE_ID,
                    "contents.published" : '1',
                    "contents.publish_date <=" : moment().format("YYYY-MM-DD HH:mm:ss"),
                    "asset_packages.published" : '1'+" and asset_packages.resource = contents.resource_id",
                    "taxonomy.slug" : category,
                    "taxonomy.slug" : childCategory,
                    "asset_packages.expire_at >=" : moment().format("YYYY-MM-DD HH:mm:ss") +where,

                },
                join : "asset_packages on asset_packages.resource_id = contents.id",
                join1 : "packages on asset_packages.package_id = packages.id",
                join2 : "content_locations on content_locations.content_id = contents.id",
                join3 : "locations on locations.id = content_locations.location_id",
                join4 : "content_taxonomy on content_taxonomy.content_id = contents.id",
                join5 : "taxonomy on content_taxonomy.taxonomy_id = taxonomy.id",
                orderBy:'contents.title ASC',
                cols :'contents.id,contents.primary_image,contents.content_type_id,contents.title,contents.summary,contents.publish_date,contents.uploaded_by,contents.viewUrl,packages.title as packagesTitle,asset_packages.resource_properties_remaining as resource_properties_remaining,content_locations.location_id,locations.country,locations.state,locations.city,locations.address1,locations.zip,taxonomy.tag,taxonomy.slug',
                group_by : 'contents.id'
            };

        }

        if(country){

            var country = country.split("_");
            data.where['locations.country'] = country[1];
        }
        if(state){
            var state = state.split("_");
            data.where['locations.state'] = state[1];
        }

        return data;
    }

    getBuyersguideCompanyFilter(content,taxonomyId,has_priority_listing,has_microsite_listing,has_featured_mircosite_listing,slug){

        const Content         = require('./contentModel');//you can include all your lib
        let contentModel = new Content();
        content.forEach(contents => {

            contents.has_priority_listing = 0;
            contents.has_microsite_listing = 0;
            contents.has_featured_mircosite_listing = 0;
            
            var n = (contents.primary_image).toString();
            contents.primary_image_main = image.displayImageUrl(n);
            
            contents.viewUrl = contents.viewUrl+slug+'/'+taxonomyId[0];

            if(contentModel.IsJsonString(contents.resource_properties_remaining)!=false){
                var resource =JSON.parse(contents.resource_properties_remaining);

                if((has_priority_listing.id in contentModel.IsJsonString(contents.resource_properties_remaining)) && (resource[has_priority_listing.id]>=1)){
                   
                    contents.has_priority_listing = 1;
                }
                if(MAGAZINE_ID!=14){
                    if((has_microsite_listing.id in contentModel.IsJsonString(contents.resource_properties_remaining)) && (resource[has_microsite_listing.id]>=1)){
                       
                        contents.has_microsite_listing = 1;
                    }
                }
                if((has_featured_mircosite_listing.id in contentModel.IsJsonString(contents.resource_properties_remaining)) && (resource[has_featured_mircosite_listing.id]>=1)){
                   
                    contents.has_featured_mircosite_listing = 1;
                }
            }
                            
        });

        return content;
    }


    getViewBuyersguideCompanyWhere(contentUrl){
        
        return {
            'where':{
                'contents.magazine_id':MAGAZINE_ID,
                "contents.published" : '1',
                "contents.publish_date <=" : moment().format("YYYY-MM-DD HH:mm:ss"),
                "asset_packages.published" : '1'+" and asset_packages.resource = contents.resource_id",
                "asset_packages.expire_at >=" : moment().format("YYYY-MM-DD HH:mm:ss"),

            },
            like : {"contents.viewUrl":contentUrl},
            join : "asset_packages on asset_packages.resource_id = contents.id",
            join1 : "packages on asset_packages.package_id = packages.id",
            join2 : "content_locations on content_locations.content_id = contents.id",
            join3 : "locations on locations.id = content_locations.location_id",
            join4 : "content_links on content_links.content_id = contents.id and content_links.content_link_type= 'website' ",
            orderBy:'contents.title ASC',
            cols :'contents.id,contents.body,contents.primary_image,contents.content_type_id,contents.title,contents.summary,contents.publish_date,contents.uploaded_by,contents.viewUrl,packages.title as packagesTitle,asset_packages.resource_properties_remaining as resource_properties_remaining,content_locations.location_id,locations.country,locations.state,locations.city,locations.address1,locations.zip,locations.phone,locations.fax,content_links.link as website,contents.custom_fields',
            group_by : 'contents.id'
        };
    }

    getViewcompanyTabWhere(id){
        return {

            where : { 

                "contents.magazine_id" : MAGAZINE_ID,
                "contents.published" : '1', 
                "contents.publish_date <=" : moment().format("YYYY-MM-DD HH:mm:ss"), 
                "content_contents.content_id": id,

            },
            join : 'content_contents ON content_contents.associated_content_id = contents.id',
            join1 : 'content_types ON content_types.id = contents.content_type_id',
            orderBy : "content_types.id asc",
            cols : "content_types.id,content_types.tag,content_types.short_tag,content_types.slug",
            group_by : 'contents.content_type_id'                

        };
    }

    getViewcompanyreleatedWhere(id){
        return {

            where : { 

                "contents.magazine_id" : MAGAZINE_ID,
                "contents.published" : '1', 
                "contents.publish_date <=" : moment().format("YYYY-MM-DD HH:mm:ss"), 
                "content_contents.content_id": id,

            },
            join : 'content_contents ON content_contents.associated_content_id = contents.id',
            orderBy : "contents.publish_date desc",
            cols : "contents.id,contents.primary_image,contents.title,contents.summary,contents.publish_date,contents.updated_at,contents.uploaded_by,contents.viewUrl"                

        };
    }




    async getViewBuyersguideCompanyFilter(contents,has_priority_listing,has_microsite_listing,has_featured_mircosite_listing) {

        return new Promise(async (resolve,reject) => {

            const Content         = require('./contentModel');//you can include all your lib
            let contentModel = new Content();

            contents.website = 'http://'+(contents.website).replace('http://','').replace('https://','');

            contents.custom_fields = await magazineContentTypeModel.getBrands(contents.content_type_id,JSON.parse(contents.custom_fields)).then(async function(data) {
                return data;
            });


            contents.has_priority_listing = 0;
            contents.has_microsite_listing = 0;
            contents.has_featured_mircosite_listing = 0;

            if(contentModel.IsJsonString(contents.resource_properties_remaining)!=false){

                var resource =JSON.parse(contents.resource_properties_remaining);

                if((has_priority_listing.id in contentModel.IsJsonString(contents.resource_properties_remaining)) && (resource[has_priority_listing.id]>=1)){
                       
                    contents.has_priority_listing = 1;
                }
                if(MAGAZINE_ID!=14){
                    if((has_microsite_listing.id in contentModel.IsJsonString(contents.resource_properties_remaining)) && (resource[has_microsite_listing.id]>=1)){
                       
                        contents.has_microsite_listing = 1;
                    }
                }
                if((has_featured_mircosite_listing.id in contentModel.IsJsonString(contents.resource_properties_remaining)) && (resource[has_featured_mircosite_listing.id]>=1)){
                   
                    contents.has_featured_mircosite_listing = 1;
                }

            }

            var where = contentModel.getViewcompanyreleatedWhere(contents.id);

            contents.releatedContent = await contentModel.getAll(constant.CONTENTS,where).then(async function(contentData) {
                return contentData;
            });

            var data = contentModel.getViewcompanyTabWhere(contents.id);
            contents.tab = await contentModel.getAll(constant.CONTENTS,data).then(async function(contentData) {
                return contentData;
            });
            resolve(contents);
        });
    }

    getBuyersguideCategory(slug){

        var parentId = "";
        var child = "";
        var mainUrl = slug[0];
        var country = '';
        var state = '';

        if(slug.length==2){

            parentId = slug[1];
            if(slug[1].indexOf("C_")==0){
                country = slug[1]; 

            }

        }else if(slug.length==3){

            parentId = slug[2];
            country = slug[1];

            if(slug[2].indexOf("S_")==0){
                state = slug[2];
            }

            if(slug[1].indexOf("C_")!=0){

                country = '';

                if(slug[2].indexOf("S_")==0){
                    parentId = slug[1];

                }else{
                    parentId = slug[1];
                    child = slug[2];
                }
            }else{
                var mainUrl = slug[0]+'/'+slug[1];

            }
        }else if(slug.length==4){
            country = slug[1];
            parentId = slug[3];
            child = "";
            if(slug[1].indexOf("C_")==0){
                if(slug[2].indexOf("S_")==0){
                    state = slug[2];

                    var mainUrl = slug[0]+'/'+slug[1]+'/'+slug[2];
                    parentId = slug[3];

                }else{
                    var mainUrl = slug[0]+'/'+slug[1];
                    parentId = slug[2];
                    child = slug[3];
                }
            }

        }else if(slug.length==5){

            parentId = slug[3];
            child = slug[4];
            if(slug[1].indexOf("C_")==0){
                country = slug[1];
            }
            if(slug[2].indexOf("S_")==0){
                state = slug[2];
            }

            var mainUrl = slug[0]+'/'+slug[1]+'/'+slug[2];

        }

        if(parentId.indexOf("C_")==0 || parentId.indexOf("S_")==0){
            parentId = "";
            mainUrl = slug[0]+'/'+slug[1]+'/'+slug[2];
        }

        if(child.indexOf("C_")==0 || child.indexOf("S_")==0){
            child = "";
        }

        return {'parentId':parentId,'child':child,'mainUrl':mainUrl,'country':country,'state':state}
    }

    getBuyersguideCountry(slug){

        var parentId = '';
        var child = '';
        var subUrl = '';
        var category = '';
        var childCategory = '';
        var mainUrl = slug[0];
        if(slug.length>=2){

            parentId = slug[1];       
            if(parentId.indexOf("C_")!=0){
                parentId = "";
                category =slug[1];
            }
        }
        if(slug.length>=3){

            child = slug[2];  
         
            if(child.indexOf("S_")!=0){
                child = "";
            }

           if(slug[1].indexOf("C_")==0 && slug[2].indexOf("S_")==0){
                category = '';
                childCategory = "";
           }else  if(slug[1].indexOf("C_")!=0 && slug[2].indexOf("S_")!=0){
                category = slug[1];
                childCategory = slug[2];
           }else  if(slug[1].indexOf("C_")==0 && slug[2].indexOf("S_")!=0){
                category = slug[2];
                childCategory = "";
                subUrl = '/'+slug[2];
           }

        }
        if(slug.length>=4){
            category =slug[3];

            if(slug[1].indexOf("C_")==0 && slug[2].indexOf("S_")!=0){
                category = slug[2];
                childCategory = slug[3];
           }
            subUrl = '/'+slug[2]+'/'+slug[3];
        };
        if(slug.length>=5){
            category =slug[3];
            childCategory =slug[4];
            subUrl = '/'+slug[3]+'/'+slug[4];
        };
        return {'parentId':parentId,'child':child,'mainUrl':mainUrl,'category':category,'childCategory':childCategory,subUrl:subUrl,}
    }

    getBuyersguideCountryFilterUrl(mainSlug,iso_code,slug){

        var url;
        if(slug.length==2){
            if(slug[1].indexOf("C_")<-1){

                url = slug[0]+'/C_'+ iso_code; 

            }else{

                url = slug[0]+'/C_'+ iso_code+"/"+slug[1];

            }

        }else if(slug.length==3){
            if(slug[1].indexOf("C_")<-1){

                url = slug[0]+'/C_'+ iso_code; 

            }else{

                url = slug[0]+'/C_'+ iso_code+"/"+slug[1]+"/"+slug[2];

            }

        }else{

            url = mainSlug+'/C_'+ iso_code;
        }
      
        return url;
    }

    getBuyersguideStateFilterUrl(mainSlug,iso_code,slug,code){

        var url;
        if(slug.length==2){

            if(slug[1].indexOf("C_")==0){

                url = slug[0]+'/C_'+ iso_code+'/S_'+ code;

            }else{

                url = slug[0]+'/C_'+ iso_code+'/S_'+ code+"/"+slug[1];

            }


        }else if(slug.length==3){

             if(slug[1].indexOf("C_")==0 || slug[2].indexOf("C_")==0){

               url = slug[0]+'/C_'+ iso_code+'/S_'+ code+"/"+slug[2];

            }else{

               url = slug[0]+'/C_'+ iso_code+'/S_'+ code+"/"+slug[2];


            }


        }else if(slug.length==4){

           url = slug[0]+'/C_'+ iso_code+'/S_'+ code+"/"+slug[2]+"/"+slug[3];

        }else{

            url = mainSlug+'/S_'+ code;
        }

        return url;
    }

    getBuyersguideCountrySelected(mainUrl,subUrl,parentId,country){

        var parentName = {};
        var childName = {};
        if(parentId){
            var countryName = country[0];
            parentName = {'tag':countryName.name,'url':mainUrl+subUrl,'type':0};
            country = country[0].child;
        }
        if(child){
            var stateName = country[0];
            childName = {'tag':stateName.name,'url':mainUrl+'/'+parentId+subUrl,'type':1};
            country = {};
        }

        return {'parentName':parentName,childName:childName,country:country};
    }

    getBuyersguideCategorySelected(child,taxonomy,mainUrl,parentId){

        var childName={};
        var parentName={};
        if(child){


            childName = {'tag':taxonomy[0][0].child[0].child[0].tag,'url':mainUrl+'/'+parentId,'type':3};
            parentName = {'tag':taxonomy[0][0].child[0].tag,'url':mainUrl,'type':2};
            taxonomy = [];

        }else{
            
            if(parentId!=""){
                var taxonomyData = taxonomy[0][0].child[0];
                parentName = {'tag':taxonomy[0][0].child[0].tag,'url':mainUrl,'type':2};
              
                taxonomy = [];
               var NewTaxonomy = [];

                if(parentId){
                    NewTaxonomy.push(taxonomyData);
                    taxonomy.push(NewTaxonomy);
                }

            }
        }

        return {'childName':childName,"parentName":parentName,"taxonomy":taxonomy};
    }

    getBuyersguideCategoryWhere(content_type_id,taxonomyId,country,state,child){
                          
        var where = {'content_type_id':content_type_id,'child_of':taxonomyId};
        if(child){
            where['slug'] = child;
        }
        if(country){
           var country_code = country.split("_");
            where['country'] = country_code[1];
        }
        if(state){
            var state_code = state.split("_");
            where['state'] = state_code[1];
        }

        return where;
    }

    getBoxContentWhere(contentType,limit){

        let date =  moment().format("YYYY-MM-DD HH:mm:ss");
        return {

            where : {"content_type_id": contentType ,"contents.magazine_id" :  MAGAZINE_ID,"contents.published" : '1',"contents.publish_date <=" :date},
            orderBy : "publish_date desc, priority ASC",
            cols : "contents.id,contents.primary_image,contents.title,contents.summary,contents.publish_date,contents.updated_at,contents.uploaded_by,users.firstName,users.lastName,contents.viewUrl,contents.body,contents.author_name",
            join : "users ON users.id = contents.uploaded_by",
            limit : limit
        };
    }

    getHomeSliderWhere(contentType,limit){

        let date =  moment().format("YYYY-MM-DD HH:mm:ss");
        return  {

            where : {"content_taxonomy.taxonomy_id": contentType ,"contents.magazine_id" :  MAGAZINE_ID,"contents.published" : '1',"contents.publish_date <=" :date},
            orderBy : "publish_date desc",
            cols : "contents.id,contents.primary_image,contents.title,contents.summary,contents.publish_date,contents.uploaded_by,users.firstName,users.lastName,contents.viewUrl",
            join : "users ON users.id = contents.uploaded_by",
            join1 : 'content_taxonomy ON content_taxonomy.content_id = contents.id',
            limit : limit
        };
    }


    getContentWhere(contentType){

        let date       =  moment().format("YYYY-MM-DD HH:mm:ss");
        return   {

            where : {"content_type_id": [contentType],"contents.magazine_id" :  MAGAZINE_ID,"contents.published" : '1',"contents.publish_date <=" :date},
            orderBy : "publish_date desc",
            join : "content_types on contents.content_type_id = content_types.id",
            cols : "*,content_types.tag as content_type_tag,content_types.short_tag as content_type_short_tag, content_types.class_name as content_type_class_name,content_types.slug as content_type_slug, contents.slider_image_id as slider",
        };
    }

    getContentTypeWhere(){

        return   {

            where : { 

                "magazine_content_types.magazine_id" : MAGAZINE_ID,
                "ignore_flag != " : '1'
            },
            orderBy : "tag asc",
            join : 'magazine_content_types on content_types.id= magazine_content_types.content_type_id ',
            cols : "content_types.id as id, content_types.tag as tag,content_types.short_tag as short_tag,content_types.class_name as class_name,content_types.ignore_flag as ignore_flag"
        };

    }

    spotLightCompaniesBoxWhere(microSitePackageIds){

        return {
            'where':{
                'contents.magazine_id':MAGAZINE_ID,
                "contents.published" : '1',
                "contents.publish_date <=" : moment().format("YYYY-MM-DD HH:mm:ss"),
                "asset_packages.published" : '1'+" and asset_packages.resource = contents.resource_id",
                "asset_packages.expire_at >=" : moment().format("YYYY-MM-DD HH:mm:ss"),
                "asset_packages.package_id " : microSitePackageIds,

            },
            join : "asset_packages on asset_packages.resource_id = contents.id",
            join1 : "packages on asset_packages.package_id = packages.id",
            join2 : "content_locations on content_locations.content_id = contents.id",
            join3 : "locations on locations.id = content_locations.location_id",
            join4 : "address_countries on locations.country = address_countries.iso_code",
            orderBy:'contents.title ASC',
            cols :'contents.id,contents.primary_image,contents.content_type_id,contents.title,contents.publish_date,contents.viewUrl,packages.title as packagesTitle,asset_packages.resource_properties_remaining as resource_properties_remaining,content_locations.location_id,locations.country,locations.state,locations.city,locations.address1,locations.address2,locations.zip,address_countries.name as country',
            group_by : 'contents.id'
        };

    }

    searchContentWhere(search,gdata,searchDateFrom,searchDateTo,content_type_id){

        if(gdata){

            var data = {

                where : { 

                    "contents.magazine_id" : MAGAZINE_ID,
                    "contents.published" : '1'
                },
                orderBy : "contents.publish_date desc,contents.title asc",
                join : 'content_taxonomy ON content_taxonomy.content_id = contents.id',
                join1 : 'users ON users.id = contents.uploaded_by',
                like : {'contents.title':search},
                group_by : 'contents.id',
                cols : "contents.id,contents.primary_image,contents.content_type_id,contents.title,contents.summary,contents.publish_date,contents.uploaded_by,users.firstName,users.lastName,contents.viewUrl,contents.body"
            };

            if(searchDateFrom){

                data['where']['publish_date >= '] = searchDateFrom;
                data['where']['publish_date <= '] = searchDateTo;
            }else{

                data['where']['publish_date <= '] = moment().format("YYYY-MM-DD HH:mm:ss");
            }

        }else{

           var data = {

                where : { 

                    "contents.magazine_id" : MAGAZINE_ID,
                    "contents.published" : '1'
                },
                whereIn : {'key' : 'contents.viewUrl','value' : gdata},
                orderBy : "contents.publish_date desc,contents.title asc",
                join : 'content_taxonomy ON content_taxonomy.content_id = contents.id',
                join1 : 'users ON users.id = contents.uploaded_by',
                like : {'contents.title':search},
                group_by : 'contents.id',
                cols : "contents.id,contents.primary_image,contents.content_type_id,contents.title,contents.summary,contents.publish_date,contents.uploaded_by,users.firstName,users.lastName,contents.viewUrl"
            };
        }

        if(content_type_id){

            data['where']['content_type_id'] = content_type_id;
        
        }else{
            
            data['where']['content_type_id != '] = 2543;

        }

        return data;

    }

    searchBgCompaniesWhere(tag,search){

        var tagWhere = '';
        if(tag){

            tagWhere = ' or contents.id IN (select content_id from content_taxonomy where taxonomy_id in '+tag+')';

        }

        return {
            'where':{
                'contents.magazine_id':MAGAZINE_ID,
                "contents.published" : '1',
                "asset_packages.published" : '1',
                "asset_packages.expire_at >=" : moment().format("YYYY-MM-DD HH:mm:ss"),
                "contents.publish_date <=" : moment().format("YYYY-MM-DD HH:mm:ss") +tagWhere,

            },
            like : {'contents.title' : search},
            join : "asset_packages on asset_packages.resource_id = contents.id",
            join1 : "packages on asset_packages.package_id = packages.id",
            orderBy:'contents.title ASC',
            cols : 'contents.id,contents.primary_image,contents.content_type_id,contents.title,contents.summary,contents.publish_date,contents.uploaded_by,contents.viewUrl,packages.title as packagesTitle,asset_packages.resource_properties_remaining as resource_properties_remaining                          '

        };
    }

    buyersguideCategoryViewFilter(slug){
        var urlSlug = slug.split("/");
        var newSlug = "";
        if(urlSlug[1]=="profile"){
            for(var i=3;i<urlSlug.length;i++){
                if(i!=(urlSlug.length-1)){
                    newSlug += '/'+urlSlug[i];
                }
            }
        }
        slug = (newSlug) ? newSlug.replace("/", "") : slug;
        return slug;
    }
    IsJsonString(str) {
        try {
        return  JSON.parse(str);
        } catch (e) {
            return false;
        }
    }
}

module.exports = Content;