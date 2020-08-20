
const Content         = require('../../core/models/contentModel');//you can include all your lib
let contentModel = new Content();

var lodash              =   require('lodash');
async               = require("async");
var ksort           = require('ksort');



exports.displayMenu = async function(req, res) {

    var id     = req.body.id;
    var err = ""; 
    var variables = {}; 

    if (id == '') {

        err =  'id is required';
 
    }   
    if (err) {

        res.json({'status':'fail','message':err});
        return;

    } 
    


    let date       =  moment().format("YYYY-MM-DD HH:mm:ss");

    var data = {

        where : {"magazine_id" :  MAGAZINE_ID,"published" : '1',"publish_date <=" :date},
        orderBy : 'id desc',
        'limit' :1,
        'offset' : 0,
    };

    issue = await contentModel.getAll(constant.MAGAZINEISSUES,data).then(async function(issue) {
        return issue;
    });



    var data = {
        where : {"id" :  id},
        cols : 'id,div_name',

    };

    contentModel.getAll(constant.MENUS,data).then(function(menu) {

        data.cols = '';
        data.where = {'menu_id': menu[0].id,'published':1,'child_of':0};
        data.cols = "id,title,url,child_of,link_options"
        data.orderBy = "priority asc";
        contentModel.getAll(constant.MENUITEMS,data).then(function(menuItems) {


            data.where = {'menu_id': menu[0].id,'published':1,'child_of != ':0,'link_options != ' : "rel='popup'"};

            contentModel.getAll(constant.MENUITEMS,data).then(function(subMenuItems) {



                subMenuItems.forEach(subMenuItem => {
                    if(subMenuItem.url=="echo Magazine::latestIssueURL()"){
                        subMenuItem.url = '/issues/'+issue[0].slug+'/'

                    }
                    if(subMenuItem.url=="/news/people-/"){
                        subMenuItem.url = '/news/people/';

                    }
                    if(subMenuItem.url=="/news/products-/"){
                        subMenuItem.url = '/news/products/';
                    }
                });

                mainMenu = menuItem(menuItems,subMenuItems,issue);


                res.json({'status':'success','message':'ok','data':mainMenu});
                return;
            });
        });

  

    }).catch(function(error){

        res.json({'status':'fail','message':'NO record found','data':''});
        return;
    });


}

 function menuItem(menuItems,subMenuItems,issue){


    menuItems.forEach(menuItem => {

        if(menuItem.url=="echo Magazine::latestIssueURL()"){
            menuItem.url = '/issues/'+issue[0].slug+'/'

        }

        var child_of = lodash.filter(subMenuItems, { 'child_of': menuItem.id} );
        if(child_of.length){
            menuItem.child = child_of;
        }else{
            menuItem.child = '';
        }
    });

    return menuItems;

}