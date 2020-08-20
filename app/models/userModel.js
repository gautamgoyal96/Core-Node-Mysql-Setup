const Content         = require('./contentModel');//you can include all your lib
const pw           = require('../../../lib/password');//you can include all your lib
const email           = require('../../../lib/email');//you can include all your lib
let contentModel = new Content();
async           = require("async");
var md5 = require('md5');

class User {


    saveNewsletterUser(options,base_url) {

      return new Promise((resolve, reject) => {


        let data = {

                where : { 

                    "webUserName" : options.webUserName,
                },
                'join' : "user_roles on user_roles.id = users.webUserRole",
                'cols' : "*"
            };


            contentModel.getAll(constant.USERS,data).then(function(user) {


                contentModel.getAll(constant.UNVERIFIED_USERS,{where : {"webUserName" : options.webUserName}}).then(function(unverifiedUsers) {

                    if(user.length!=0){
                       resolve("AE");
                    } else if(unverifiedUsers!=0){

                        resolve("UVU");
                    }else{


                       var dData = (options.webUserName).split("@");

                        let bData = {
                            where : {
                                'title' : dData[0],
                            },
                            orWhere : {
                                'domain' : dData[1],

                            }
                        }

                        contentModel.getAll(constant.Block_Domain,bData).then(function(blockDomin_Email){

                            if(blockDomin_Email.length!=0){

                                resolve("blocked");
                            }else{

                                var newData = {};

                                newData['webUserName'] = options.webUserName,
                                newData['special_promotions'] = options.special_promotions,
                                newData['weekly_enewsletter'] = options.weekly_enewsletter,
                                newData['accept_terms'] = options.accept_terms,
                             //   newData['webUserRole'] = (options['webUserRole']) ? options['webUserRole'] : 3; //3 is default registered user role
                                newData['city'] = (options['city']) ? options['city'] : ""; 
                                newData['country'] = (options['country']) ? options['country'] : ""; 
                                newData['address1'] = (options['address1']) ? options['address1'] : ""; 
                                newData['address2'] = (options['address2']) ? options['address2'] : ""; 
                                newData['state'] = (options['state']) ? options['state'] : ""; 
                                newData['phone'] = (options['phone']) ? options['phone'] : ""; 
                                newData['zip'] = (options['zip']) ? options['zip'] : ""; 
                                newData['refer_from'] = (options['refer_from']) ? options['refer_from'] : ""; 
                                var password = Math.floor(Math.random()*90000) + 10000;
                                newData['webPassword'] = md5(password);
                                var pass_key = Math.floor(Math.random()*80000) + 10000;
                                newData['pass_key'] = md5(pass_key);
                                newData['magazine_id'] = MAGAZINE_ID;
                                
                                contentModel.save(constant.UNVERIFIED_USERS,newData).then(function(save){


                                    var id = save.insertId;
                                    var nOptions = {
                                        user_id : id,
                                        field_id : options.field_id,
                                        group_id : options.group_id,
                                        form_id : options.form_id,
                                        data : options.company_name,
                                    }
                                    contentModel.save(constant.UNVERIFIED_USERS_DATA,nOptions).then(function(magSave){

                                        let customMessage = "Your Password : " +password;

                                        email.sendVerificationLink(magazineDetail,options,base_url,newData).then(function(sendMail){
                                            newData['webPassword'] = password;
                                            resolve(newData);

                                        }).catch(function(error){

                                            reject(error);

                                        });
                                        
                                  });

                                
                                });
                            }


                        });
                    }             

                });

            });
        });
      
    }

    resendEmail(options,base_url) {

      return new Promise((resolve, reject) => {

            contentModel.getAll(constant.UNVERIFIED_USERS,{where : {"webUserName" : options.webUserName}}).then(function(unverifiedUsers) {

                if(unverifiedUsers.length==0){

                    resolve("IE");
                }else{


                   var dData = (options.webUserName).split("@");

                    let bData = {
                        where : {
                            'title' : dData[0],
                        },
                        orWhere : {
                            'domain' : dData[1],

                        }
                    }

                    contentModel.getAll(constant.Block_Domain,bData).then(function(blockDomin_Email){

                        if(blockDomin_Email.length!=0){

                            resolve("blocked");
                        }else{

                            var newData = {};

                            newData['webUserName'] = options.webUserName;
                            var password = Math.floor(Math.random()*90000) + 10000;
                            newData['webPassword'] = md5(password);
                            var pass_key = Math.floor(Math.random()*80000) + 10000;
                            newData['pass_key'] = md5(pass_key);
                            newData['magazine_id'] = MAGAZINE_ID;
                            
                            contentModel.updateData(constant.UNVERIFIED_USERS,newData,{'webUserName' : options.webUserName}).then(function(save){

                                let customMessage = "Your Password : " +password;

                                email.sendVerificationLink(magazineDetail,options,base_url,newData).then(function(sendMail){
                                    newData['webPassword'] = password;
                                    resolve(newData);

                                }).catch(function(error){

                                    reject(error);

                                });      
                            
                            });
                        }


                    });
                }             

            });

            
        });
      
    }

    verification(options) {

        return new Promise((resolve, reject) => {

            contentModel.getAll(constant.UNVERIFIED_USERS,{where : options}).then(function(unverifiedUsers) {

                if(unverifiedUsers.length==0){

                    resolve("IL");
                }else{

                    unverifiedUsers = unverifiedUsers[0];

                    contentModel.getAll(constant.UNVERIFIED_USERS_DATA,{where : {'user_id':unverifiedUsers.id}}).then(function(unverifiedUsersData) {

                        var newData = {};

                        newData['webUserName'] = unverifiedUsers.webUserName;
                        newData['webPassword'] = unverifiedUsers.webPassword;
                        newData['special_promotions'] = unverifiedUsers.special_promotions;
                        newData['weekly_enewsletter'] = unverifiedUsers.weekly_enewsletter;
                        newData['accept_terms']       = unverifiedUsers.accept_terms;

                        var magazine_id               = unverifiedUsers.magazine_id;

                        contentModel.save(constant.USERS,newData).then(function(save){


                            var id = save.insertId;
                            var nOptions = {
                                user_id : id,
                                magazine_id : magazine_id
                            }
                            contentModel.save(constant.USERS_MAGAZINE,nOptions).then(function(magSave){

                                unverifiedUsersData = unverifiedUsersData[0];

                                var uOptions = {
                                        user_id : id,
                                        field_id : unverifiedUsersData.field_id,
                                        group_id : unverifiedUsersData.group_id,
                                        form_id : unverifiedUsersData.form_id,
                                        data    :  unverifiedUsersData.data,
                                    }
                                contentModel.save(constant.USERS_DATA,uOptions).then(function(uDSave){

                                    contentModel.deleteData(constant.UNVERIFIED_USERS,options).then(function(rs){

                                        contentModel.deleteData(constant.UNVERIFIED_USERS_DATA,{'id' : unverifiedUsersData.id}).then(function(rs){
                                            newData['id'] = id;
                                            newData['userData'] = uOptions;

                                            resolve(newData);

                                        });
                                    });
                                });
                                
                            });

                        });
                    
                    });
                    
                }             

            });

            
        });
      
    }

    userRegistration(options) {

        return new Promise((resolve, reject) => {

           var newData = {};
            newData['firstName']    = options.firstName;
            newData['lastName']     = options.lastName;
            newData['webUserRole']   = 3;
            newData['webPassword']  = md5(options.password);
            
            contentModel.updateData(constant.USERS,newData,{'id' : options.id}).then(function(save){

                contentModel.getAll(constant.USERS,{where:{'id' : options.id}}).then(function(user) {

                    (options.maling_list).forEach(maling_lists => {
                        
                        var nOptions = {
                            'user_id' : options.id,
                            'taxonomy_id' : maling_lists
                        }
                        contentModel.save(constant.USERS_TAXONOMY,nOptions).then(function(tSave){

                        });

                    });


                resolve(user);

            });

            });

            
        });
      
    }

}

module.exports = User;