
const Content         = require('../../core/models/contentModel');//you can include all your lib
let contentModel = new Content();

issueModel      = require('../../core/models/issueModel');//you can include all your lib
async                   = require("async");


exports.getIssues = async function(req, res) {

  CONTENT_TAXONOMYS = JSON.parse(magazineDetail.site_options).NEWS_CATEGORY_ID;
  NEWS_CATEGORY_ID = (CONTENT_TAXONOMYS.value).split(",");

    var slug     = (req.body.slug) ? req.body.slug : '';
    var pageNumber     = (req.body.pageNumber) ? req.body.pageNumber : 0;
    var limit     = (req.body.limit) ? req.body.limit : 10;

    let date       =  moment().format("YYYY-MM-DD HH:mm:ss");

    let data = {

        where : {"magazine_id" :  MAGAZINE_ID,"published" : '1',"publish_date <=" :date},
        orderBy : 'id desc'

    };
    issue = {};
    if(pageNumber==0){

        issue = await contentModel.getAll(constant.MAGAZINEISSUES,data).then(async function(issue) {

            return issue;
        });

    }

    slug = (slug) ? slug : issue[0].slug;
    let nData = {

        where : {"magazine_id" :  MAGAZINE_ID,"published" : '1',"publish_date <=" :date,'slug <' : slug},
        orderBy : 'id desc'

    };
    nextIssue = await contentModel.getAll(constant.MAGAZINEISSUES,nData).then(async function(issue) {

        return issue[0];
    });

    let cData = {

        where : { 
            "contents.magazine_id" : MAGAZINE_ID,
            "contents.published" : '1', 
            "contents.publish_date <=" : moment().format("YYYY-MM-DD HH:mm:ss"), 
            "magazine_issues.slug":slug,

        },
        orderBy :"contents.priority ASC,contents.publish_date desc",
        join : 'contents ON issue_contents.content_id = contents.id',
        join2 : 'content_types ON contents.content_type_id = content_types.id',
        join1 : 'magazine_issues ON issue_contents.issue_id = magazine_issues.id',
        cols : "contents.id,contents.content_type_id,contents.primary_image,contents.title,contents.summary,contents.publish_date,contents.viewUrl,magazine_issues.issue_title,content_types.tag"
    };
    total = await contentModel.getAll(constant.ISSUES_CONTENTS,cData).then(async function(total) {
       return total.length;
    });


    content = await contentModel.getAll(constant.ISSUES_CONTENTS,cData).then(async function(content) {

          for(const item in content){  
      
            tData = {

                where : { 
                    "taxonomy.magazine_id" : MAGAZINE_ID,
                    "content_taxonomy.content_id" : content[item].id,
                    "taxonomy.child_of" : NEWS_CATEGORY_ID

                },
                orderBy : 'priority asc',
                join : 'content_taxonomy ON content_taxonomy.taxonomy_id = taxonomy.id',
                cols : "taxonomy.tag"

            }
            result1 = await contentModel.getAll(constant.TAXONOMY,tData).then(async function(result) {
                return result;
            });
            if(result1.length!=0){
                content[item].tag  = result1[0].tag;
            }
            if(content[item].content_type_id==2486){
                content[item].tag = '';
            }

        }

       return content;
    });

  
    res.json({'status':'success','message':'ok','issue':issue,total:total,data:content,nextIssue:nextIssue});
    return;    
}


exports.latestIssueURL = async function(req, res) {


    let date       =  moment().format("YYYY-MM-DD HH:mm:ss");

    let data = {

        where : {"magazine_id" :  MAGAZINE_ID,"published" : '1',"publish_date <=" :date},
        orderBy : 'id desc'

    };

    issue = await contentModel.getAll(constant.MAGAZINEISSUES,data).then(async function(issue) {
        return issue;
    });
  
    res.json({'status':'success','message':'ok','issueUrl':'/issues/'+issue[0].slug+'/'});
    return;    
}