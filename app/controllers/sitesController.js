
const Content         = require('../../core/models/contentModel');//you can include all your lib
let contentModel = new Content();

exports.footerSlider = async function(req, res) {

    let date =  moment().format("YYYY-MM-DD HH:mm:ss");

    let data = {
        where : {"magazines.id != " :  16},
        cols : "id,name,MagazineId,url,layout_id",
    };

   await contentModel.getAll(constant.MAGAZINE,data).then( async function(data) {


        data1 = {
            orderBy : "publish_date desc",
            limit : 3
        };

        for(const item in data){
            
            data1.where = {'content_type_id':2487,magazine_id:data[item].id,published:'1',"publish_date <=" :date};
            test = await dataItem(data1).then( async function(item1){
              return item1;
            });
            data[item].image = 'https://'+data[item].url+'/img/desktop_logo.png';
            data[item].child = test;
        }

        res.json({'status':'success','message':'ok','data':data});
        return;


    }).catch(function(error){


        res.json({'status':'fail','message':'NO record found','data':''});
        return;
    });

}

async function dataItem(data1){
    
    return new Promise((resolve, reject) => {

        contentModel.getAll(constant.CONTENTS,data1).then(function(subItems) {

               if (subItems){
                   resolve(subItems);
                }else{
                    reject('');
                }

        });

    });

}
