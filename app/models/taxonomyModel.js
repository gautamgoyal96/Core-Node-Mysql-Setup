const Content         = require('./contentModel');//you can include all your lib
let contentModel = new Content();

let bgCompanyModel      = require('../../core/models/bgCompanyModel');//you can include all your lib


async           = require("async");

class Taxonomy {


   async getTaxonomy(id) {

      return new Promise((resolve, reject) => {

            let data = {

                where : { 

                    "id" : id,
                },
            };

            contentModel.getAll(constant.TAXONOMY,data).then(function(data) {
                   if (data){
                       resolve(data);
                    }else{
                        reject('');
                    }
            });

        });
      
    }

    async getBgDirectoryCategory(data) {

        return new Promise((resolve, reject) => {
            var date = moment().format("YYYY-MM-DD HH:mm:ss");

            where = "contents.content_type_id = "+data['content_type_id']+" AND taxonomy.child_of = '"+data['child_of']+"' and contents.publish_date <= '"+date+"' and contents.published=1 and contents.magazine_id="+MAGAZINE_ID+" and asset_packages.published = 1 and asset_packages.resource = contents.resource_id and asset_packages.expire_at>= '"+date+"'";
            if(data.slug){
              where+= " and taxonomy.slug = '"+data.slug+"'";         
            }
            if(data.country){
              where+= " and locations.country = '"+data.country+"'";         
            }
            if(data.state){
              where+= " and locations.state = '"+data.state+"'";         
            }
           
            query.query("SELECT taxonomy.*, count(DISTINCT contents.id) as count FROM contents JOIN content_taxonomy on content_taxonomy.content_id = contents.id JOIN content_locations on content_locations.content_id=contents.id JOIN locations on content_locations.location_id=locations.id JOIN taxonomy on taxonomy.id=content_taxonomy.taxonomy_id JOIN asset_packages on asset_packages.resource_id = contents.id WHERE "+where+" group by content_taxonomy.taxonomy_id ORDER BY taxonomy.ignore_flag,taxonomy.tag asc", (err, result) => {

                if (err){

                   reject(err);

                }else{

                    resolve(result);
                    
                }

            });
          
        });
    }
    async getBgDirectoryCountry(data) {

        return new Promise((resolve, reject) => {
            var date = moment().format("YYYY-MM-DD HH:mm:ss");

            where = "contents.content_type_id = '"+data['content_type_id']+"' AND address_countries.iso_code!='' and contents.publish_date <= '"+date+"' and contents.published=1 and contents.magazine_id="+MAGAZINE_ID+" and asset_packages.published = 1 and asset_packages.resource = contents.resource_id and asset_packages.expire_at>= '"+date+"' AND content_taxonomy.taxonomy_id IN ("+data['child_of']+")";

            if(data.code){
              where+= " and address_countries.iso_code = '"+data.code+"'";         
            }

            query.query("SELECT address_countries.*, count(DISTINCT contents.id) as count FROM contents JOIN content_taxonomy on content_taxonomy.content_id = contents.id JOIN content_locations on content_locations.content_id=contents.id JOIN locations on content_locations.location_id=locations.id JOIN address_countries on address_countries.iso_code=locations.country JOIN asset_packages on asset_packages.resource_id = contents.id WHERE "+where+" group by address_countries.name ORDER BY address_countries.name asc", (err, result) => {

                if (err){

                   reject(err);

                }else{

                    resolve(result);
                    
                }

            });
          
        });
    }

    async getBgDirectoryState(data) {

        return new Promise((resolve, reject) => {
            var date = moment().format("YYYY-MM-DD HH:mm:ss");

            where = "contents.content_type_id = '"+data['content_type_id']+"' AND locations.country='"+data['country_id']+"' AND address_states.country_id IN(SELECT id FROM address_countries WHERE iso_code='"+data['country_id']+"') AND address_states.code!='' and contents.publish_date <= '"+date+"' and contents.published=1 and contents.magazine_id="+MAGAZINE_ID+" and asset_packages.published = 1 and asset_packages.resource = contents.resource_id and asset_packages.expire_at>= '"+date+"' and locations.country='"+data['country_id']+"' AND content_taxonomy.taxonomy_id = ("+data['child_of']+")";

            if(data.code){
              where+= " and address_states.Code = '"+data.code+"'";         
            }

            if(data.country){
              where+= " and locations.country = '"+data.country+"'";         
            }
            if(data.category){
              where+= " and taxonomy.slug = '"+data.category+"'";         
            }
            if(data.childCategory){
              where+= " and taxonomy.slug = '"+data.childCategory+"'";         
            }


            query.query("SELECT address_states.*,taxonomy.slug , count(DISTINCT contents.id) as count FROM contents JOIN content_taxonomy on content_taxonomy.content_id = contents.id JOIN content_locations on content_locations.content_id=contents.id JOIN locations on content_locations.location_id=locations.id JOIN address_states on address_states.code=locations.state JOIN asset_packages on asset_packages.resource_id = contents.id JOIN taxonomy on content_taxonomy.taxonomy_id = taxonomy.id WHERE "+where+" group by address_states.name ORDER BY address_states.name asc", (err, result) => {

                if (err){

                   reject(err);

                }else{

                    resolve(result);
                    
                }

            });
          
        });
    }

    async getTaxonomyData(slug,contentTypeSlug,pageUrl) {

        return new Promise(async (resolve,reject) => {
            
            var taxonomyData;

            if(slug!="contact-us"){
    
                taxonomyData = await contentModel.getAll(constant.TAXONOMY,{where:{'slug' : slug,'magazine_id':MAGAZINE_ID}}).then(async function(taxonomyData) {

                    return taxonomyData;

                });
            }


            if(MAGAZINE_ID==1 || MAGAZINE_ID==14){
               var taxonomySlug            = (pageUrl).split("/");

               if(taxonomySlug.length==2){

            
                    var taxonomyFirst = await contentModel.getAll(constant.TAXONOMY,{where:{'slug' : taxonomySlug[0],'magazine_id':MAGAZINE_ID}}).then(async function(taxonomyFirst) {

                        return taxonomyFirst[0];

                    });

                    if(contentTypeSlug[0]!="view"){
                       
                        taxonomyData = await contentModel.getAll(constant.TAXONOMY,{where:{'slug' : taxonomySlug[1],'child_of' : taxonomyFirst.id,'magazine_id':MAGAZINE_ID}}).then(async function(taxonomyData) {

                            return taxonomyData;

                        });


                    }
               }
            }

            resolve(taxonomyData);

        });

    }

    async getTaxonomyContentData(data,pageNumber,limit) {

        return new Promise(async (resolve,reject) => {  

            const ContentTaxonomy = require('./contentTaxonomy');//you can include all your lib
            let contenttaxonomy     = new ContentTaxonomy();
            var KNOWLEDGE_CENTER_TAXONOMY;
            var content;

            data.limit       = limit;
            data.offset  = (pageNumber) ? (pageNumber)*limit : 0;

            content = await contentModel.getAll(constant.CONTENTS,data).then(async function(content) {

                for(const item in content){  

                    KNOWLEDGE_CENTER_TAXONOMY = await contenttaxonomy.getContentTaxonomyTagged(content[item].id,CONTENT_TAXONOMY).then( async function(item1){
                        return item1;
                    });

                    content[item].firstName = '';
                    content[item].lastName = '';
                    content[item].taggedTaxonomy = {

                        KNOWLEDGE_CENTER_TAXONOMY:KNOWLEDGE_CENTER_TAXONOMY,
                        NEWS_TAXONOMY:{}
                    };

                };
                return content;

            });
            

            resolve(content);

        });
    }

    async getTaxonomyList(contentTypeSlug,taxonomySlug,slugUrl) {

        return new Promise(async (resolve,reject) => {  


            const Taxonomy         = require('../../core/models/taxonomyModel');//you can include all your lib
            let taxonomyModel = new Taxonomy();

            var parentId = await contentModel.getAll(constant.TAXONOMY,{where:{'slug' : taxonomySlug[0],'magazine_id':MAGAZINE_ID}}).then(async function(item) {
                return item[0].id;
            });

         
            var taxonomy = {};

            if(contentTypeSlug[0]=="view" && taxonomySlug.length>=3){

                taxonomy = await contenttaxonomy.getTopTaxonomys(parentId,contentType).then(async function(taxonomy) {

                    taxonomy.forEach(taxonomys => {

                        taxonomys.url = taxonomyModel.taxonomyUrl(taxonomySlug,taxonomys.slug);
                    });

                    return taxonomy;
                });
                
            }else{


                taxonomy = await contentModel.getAll(constant.TAXONOMY,{where:{'child_of' : parentId,'magazine_id':MAGAZINE_ID},'orderBy':'tag ASc'}).then(async function(taxonomy) {

                    taxonomy.forEach(taxonomys => {

                        taxonomys.url = taxonomyModel.taxonomyUrl(taxonomySlug,taxonomys.slug);
                    });

                    return taxonomy;
                });

            }

            var all =  {
                "id": '',
                "magazine_id": MAGAZINE_ID,
                "tag": "All",
                "short_tag": "all",
                "slug": taxonomyModel.view_Url(slugUrl.split("/")),
                "primary_image": 0,
                "ignore_flag": 0,
                "child_of": 0,
                "priority": 0,
                "tax_keywords": null,
                "url": taxonomyModel.view_Url(slugUrl.split("/"))
            };

            resolve({data:taxonomy,all:all});
        });
    }

    getTaxonomyWhere(contentTypeData,contentType){

        var data = {

            where : { 

                "contents.magazine_id" : MAGAZINE_ID,
                "contents.published" : '1', 
                "contents.publish_date <=" : moment().format("YYYY-MM-DD HH:mm:ss"), 
                "content_taxonomy.taxonomy_id":contentTypeData.id,
            },
            orderBy :"contents.publish_date desc", //contents.content_type_id asc,
            join : 'content_taxonomy ON content_taxonomy.content_id = contents.id',
            //join1 : 'users ON users.id = contents.uploaded_by',
            join2 : 'content_types ON content_types.id = contents.content_type_id',
            cols : "contents.id,contents.primary_image,contents.title,contents.summary,contents.publish_date,contents.uploaded_by,contents.body,contents.viewUrl,contents.author_name,content_types.tag"//,users.firstName,users.lastName
        };

        if(contentTypeData.id=="1810" || contentTypeData.id=="1426" || contentTypeData.id=="48625"){

            var data = {

                where : { 

                    "contents.magazine_id" : MAGAZINE_ID,
                    "contents.published" : '1', 
                    "contents.publish_date <=" : moment().format("YYYY-MM-DD HH:mm:ss"), 
                    "content_taxonomy.taxonomy_id":contentTypeData.id,
                },
                orderBy :"contents.publish_date desc", //contents.content_type_id asc,
                join : 'content_taxonomy ON content_taxonomy.content_id = contents.id',
                join2 : 'content_types ON content_types.id = contents.content_type_id',
                cols : "contents.id,contents.primary_image,contents.title,contents.summary,contents.publish_date,contents.uploaded_by,contents.viewUrl,contents.author_name,content_types.tag"
            };

        }

        if(contentTypeData.id=="6468"){

             var data = {

                where : { 

                    "contents.magazine_id" : MAGAZINE_ID,
                    "contents.published" : '1', 
                    "contents.publish_date <=" : moment().format("YYYY-MM-DD HH:mm:ss"), 
                    "content_taxonomy.taxonomy_id":contentTypeData.id,
                },
                orderBy :"contents.publish_date desc", //contents.content_type_id asc,
                join : 'content_taxonomy ON content_taxonomy.content_id = contents.id',
                join2 : 'content_types ON content_types.id = contents.content_type_id',
                cols : "contents.id,contents.primary_image,contents.title,contents.summary,contents.publish_date,contents.uploaded_by,contents.viewUrl,contents.author_name,content_types.tag"
            };


        }

        if(contentType){
            data.where['contents.content_type_id'] = contentType;
        }

        return data;
    }

    taxonomyUrl(taxonomySlug,slug){

        if(taxonomySlug.length==3 || taxonomySlug.length==2){
            var taxonomy = (taxonomySlug.length==3) ? (taxonomySlug[2]).split("_") : (taxonomySlug[1]).split("_");
            if(taxonomy[0]=="view"){
                var taxonomyUrl = (taxonomySlug.length==3) ? taxonomySlug[2]: taxonomySlug[1];
                return taxonomySlug[0]+'/'+slug+'/'+taxonomyUrl;

            }

        }
        return taxonomySlug[0]+'/'+slug;

    }


    view_Url(slugUrl){

        var url;
        var newSlugUrl;
        if(slugUrl.length==2 || slugUrl.length==1){

            url = slugUrl[0];

        }else if(slugUrl.length==3){

            newSlugUrl = (slugUrl[2]).split("_");
            if(newSlugUrl[0]=="view"){
                url = slugUrl[0]+'/'+slugUrl[2];
            }else{
                url = slugUrl[0]+'/'+slugUrl[1];

            }

        }else if(slugUrl.length==4){

            newSlugUrl = (slugUrl[3]).split("_");
            if(newSlugUrl[0]=="view"){

                url = slugUrl[0]+'/'+slugUrl[1]+'/'+slugUrl[3];

            }else{

                url = slugUrl[0]+'/'+slugUrl[1]+'/'+slugUrl[2];

            }
        }

        return url;
    }

    async getContentTaxonomyList(pageUrl,contentTypeData) {

        
        return new Promise(async (resolve,reject) => {  

            let data = {

                where : { 

                    "magazine_id" : MAGAZINE_ID,
                    "id" : CONTENT_TAXONOMY

                },
                cols : "id,tag,slug,short_tag"
            };

        var all = {};
        if((bgCompanyModel.hasMany()).indexOf(contentTypeData.id)==-1){

            all =  {
                "id": '',
                "tag": "All",
                "short_tag": "all",
                "slug": pageUrl,
                "url": pageUrl
            };
            var taxonomy = await contentModel.getAll(constant.TAXONOMY,data).then(async function(taxonomy) {

                return taxonomy;
            });
        }

            resolve({data:taxonomy,all:all});
        });
    }

    async getBuyersguideTaxonomyList(category,childCategory) {
        
        return new Promise(async (resolve,reject) => { 

            var taxonomyData;
            var CatIds = [];
            var taxonomyId = [];
            var CONTENT_TAXONOMY = contentModel.IsJsonString(magazineDetail.site_options).CONTENT_TAXONOMY;
            CONTENT_TAXONOMY = (CONTENT_TAXONOMY.value).split(",");

            for(const item in CONTENT_TAXONOMY){  

                    taxonomyData = await contentModel.getAll(constant.TAXONOMY,{where:{'magazine_id':MAGAZINE_ID,'slug':CONTENT_TAXONOMY[item]}}).then(async function(items) {

                        return items[0];
                    });
                    if(taxonomyData){
                      
                        CatIds.push(taxonomyData.id);
                        taxonomyId.push(taxonomyData.id);
                       // taxonomy.push(taxonomyData);
                    }

                    if(category){

                        taxonomyData = await contentModel.getAll(constant.TAXONOMY,{where:{'magazine_id':MAGAZINE_ID,'slug':category},whereIn:{'key':'child_of','value':taxonomyId},'orderBy':'tag asc'}).then(async function(taxonomyData) {

                            if(taxonomyData.length){
                                taxonomyId = [];
                                for(const item1 in taxonomyData){  
                                    taxonomyId.push(taxonomyData[item1].id);
                                }
                            }
                        });
                    }

                    if(childCategory){
                        taxonomyData = await contentModel.getAll(constant.TAXONOMY,{where:{'magazine_id':MAGAZINE_ID,'slug':childCategory},whereIn:{'key':'child_of','value':taxonomyId},'orderBy':'tag asc'}).then(async function(taxonomyData) {
                            
                            if(taxonomyData.length){
                                taxonomyId = [];
                                for(const item1 in taxonomyData){  
                                    taxonomyId.push(taxonomyData[item1].id);
                                }
                            }
                        });
                    }

            };

            resolve({taxonomyId:taxonomyId,CatIds:CatIds});
        });
    }


    async getBuyersguideCompanyTaxonomyList(CONTENT_TAXONOMY,id) {

        return new Promise(async (resolve,reject) => { 
            

            const Taxonomy         = require('./taxonomyModel');//you can include all your lib
            let taxonomyModel = new Taxonomy();

            var allTaxonomyData = [];
            for(const item in CONTENT_TAXONOMY){  

                var taxonomyData = await contentModel.getAll(constant.TAXONOMY,{where:{'magazine_id':MAGAZINE_ID,'slug':CONTENT_TAXONOMY[item]}}).then(async function(items) {
                    return (items.length) ? items[0] : '';
                });

                

                if(taxonomyData){ 

                    var data = taxonomyModel.getBuyersguideCompanyTaxonomyWhere(id,taxonomyData.id);
                 
                    var taxonomyData1 = await contentModel.getAll(constant.TAXONOMY,data).then(async function(taxonomyData1) {
                        

                        if(taxonomyData1.length){

                            for(const item1 in taxonomyData1){ 

                                var data = taxonomyModel.getBuyersguideCompanyTaxonomyWhere(id,taxonomyData1[item1].id);

                                taxonomyData1[item].url = taxonomyData.slug+'/'+taxonomyData1[item].slug;

                                var taxonomyDataChild = await contentModel.getAll(constant.TAXONOMY,data).then(async function(taxonomyDataChild) {

                                    if(taxonomyDataChild.length){
                                        for(const item1 in taxonomyDataChild){
                                            taxonomyDataChild[item1].url = taxonomyData.slug+'/'+taxonomyData1[item].slug+'/'+taxonomyDataChild[item1].slug;
                                        }
                                    } 
                                   return taxonomyDataChild;
                         
                                });

                                taxonomyData1[item1].child = taxonomyDataChild;

                            }
                        }

                        return taxonomyData1;
                    });

                    if(MAGAZINE_ID==14){

                        taxonomyData.child = [{'id':taxonomyData.id,'tag':taxonomyData.tag,'slug':taxonomyData.slug,'child':taxonomyData1}];

                    }else{

                        taxonomyData.child = taxonomyData1;
                    }

                    allTaxonomyData.push(taxonomyData);
                }

            };

            resolve(allTaxonomyData);
        });

    }

    getBuyersguideCompanyTaxonomyWhere(id,taxonomyId){

        return {
            where:{'magazine_id':MAGAZINE_ID,'content_taxonomy.content_id':id,'child_of':taxonomyId},
            join : "content_taxonomy on content_taxonomy.taxonomy_id = taxonomy.id",
            cols : "taxonomy.id,tag,slug",
            'orderBy':'tag asc'
        };

    }

}

module.exports = Taxonomy;