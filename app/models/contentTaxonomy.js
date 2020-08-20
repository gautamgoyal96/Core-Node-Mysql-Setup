const Content         = require('./contentModel');//you can include all your lib
let contentModel      =  new Content();
const Taxonomy        = require('./taxonomyModel');//you can include all your lib
let taxonomyModel = new Taxonomy();
async           = require("async");

class ContentTaxonomy {


   async getContentTaxonomyTagged(contentId,CONTENT_TAXONOMY='',limit=5) {

      return new Promise((resolve, reject) => {

            let data = {

                where : { 

                    "magazine_id" : MAGAZINE_ID,
                    "content_id" : contentId,
                    "ignore_flag" : '0'
                },

                orderBy : "taxonomy.tag ASC",
                join : 'taxonomy on taxonomy.id = content_taxonomy.taxonomy_id',
                group_by : "content_taxonomy.taxonomy_id",
                cols : "taxonomy.id,taxonomy.tag,taxonomy.slug,taxonomy.child_of",
                orderBy : 'taxonomy.priority desc taxonomy.id asc',
                limit : limit
            };
            if(CONTENT_TAXONOMY){
                data.where['child_of'] = CONTENT_TAXONOMY;

            }

            contentModel.getAll(constant.CONTENTTAXONOMY,data).then(async function(data) {

                for(const item in data){  

                    let rs = await taxonomyModel.getTaxonomy(data[item].child_of).then( async function(item1){

                        return item1;
                    });

                    data[item].url = "/"+rs[0].slug+"/"+data[item].slug+"/";

                };


               if (data){
                   resolve(data);
                }else{
                    reject('');
                }

            });

        });
      
    }

     async getTopTaxonomys(parentId,contentType) {

      return new Promise((resolve, reject) => {

            query.query("SELECT * FROM taxonomy WHERE child_of="+parentId+" and magazine_id="+MAGAZINE_ID+" and id in (select taxonomy_id from content_taxonomy join contents on contents.id=content_taxonomy.content_id and contents.content_type_id='"+contentType+"') ORDER BY tag",(err, data) => {

                if (data){
                   resolve(data);
                }else{
                    reject('');
                }

            });
            
        });
      
    }


}

module.exports = ContentTaxonomy;