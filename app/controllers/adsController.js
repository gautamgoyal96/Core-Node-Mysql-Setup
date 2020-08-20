const Content           = require('../../core/models/contentModel');//you can include all your lib
let contentModel = new Content();

exports.getAds = function(req, res) {

    var pageUrl     = (req.body.pageUrl) ? req.body.pageUrl : 'home';

    page   = pageUrl.split("/");

    let date =  moment().format("YYYY-MM-DD");


    sqlQuery = "SELECT distinct web_ads.id,location,code,type FROM web_ads JOIN web_ad_pages as p on p.ad_id=web_ads.id join web_ad_dates as d on d.ad_id=web_ads.id and d.start_date <= '"+date+"' and d.end_date >= '"+date+"' WHERE web_ads.magazine_id='"+MAGAZINE_ID+"' and ((url = '"+pageUrl+"') or (url = '"+pageUrl+"') or (url = 'whole-site')) and code like '%googletag%' ORDER BY priority desc";
    
    contentModel.getAllAds(sqlQuery).then(function(result) {

        if(result.length){


            result.forEach(results => {

                results.code = (results.code).replace("SETTARGETTINGHERE",page);

            });

            res.json({'status':'success','message':'ok','data':result});
            return;

        }else{

            res.json({'status':'fail','message':'NO record found','data':''});
            return;
            
        }
      

    }).catch(function(error){

        res.json({'status':'fail','message':'NO record found','data':''});
        return;
    });


}