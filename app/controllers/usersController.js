
const Content           = require('../../core/models/contentModel');//you can include all your lib
let contentModel = new Content();

const User           = require('../../core/models/userModel');//you can include all your lib
let userModel = new User();

//const pw           = require('../../../lib/password');//you can include all your lib
var md5 = require('md5');

exports.signUpNewsletter = function(req, res) {

	let email = req.body.email;
	let company_name = req.body.company_name;
	let special_promotions = req.body.special_promotions;
	let weekly_enewsletter = req.body.weekly_enewsletter;
	let field_id = req.body.field_id_company_name;
	let group_id = req.body.group_id_company_name;
	let form_id = req.body.form_id_company_name;
	let accept_terms = req.body.accept_terms ? req.body.accept_terms : 1;
	let url = req.body.url;

	let option = {

		'webUserName' : email,
		'company_name' : company_name,
		'special_promotions' : special_promotions,
		'weekly_enewsletter' : weekly_enewsletter,
		'field_id' : field_id,
		'group_id' : group_id,
		'form_id' : form_id,
		'accept_terms' : 1

	}
	base_url = (url) ? url : req.protocol + '://'+req.headers['host']+'/users/verifyuser/';

	userModel.saveNewsletterUser(option,base_url).then(function(user) {

		if(user){

			switch(user) {

		        case 'AE':

			        res.json({'status':'success','message':'This email address is already being used','registerStatus':user});
	                return;
		           break;
		        case 'UVU':
			        res.json({'status':'success','message':'Verify Email! We have sent an email to '+email+', please verify the email address before you can login','registerStatus':user});
	                return;
		           break;   

		        case 'blocked':

		           res.json({'status':'success','message':'You Are Not Allowed To Register!!','registerStatus':user});
                   return;

		        case 'success':

			        res.json({'status':'success','message':'You are almost registered','registerStatus':"success",'data':user});
	                return;

		           break;

		        default: 
			        res.json({'status':'success','message':'You are almost registered','registerStatus':"success",'data':user});
	                return;    
			}
		}
	}).catch(function(error){

        res.json({'status':'fail','message':'Something went wrong','data':error});
        return;
    });

}

exports.resendEmail = function(req, res) {

	let email = req.body.email;
	let url = req.body.url;

	let option = {

		'webUserName' : email,

	}
	base_url = (url) ? url : req.protocol + '://'+req.headers['host']+'/users/verifyuser/';

	userModel.resendEmail(option,base_url).then(function(user) {

		if(user){

			switch(user) {

		        case 'IE':

			        res.json({'status':'success','message':'Invalid Email','registerStatus':user});
	                return;
		           break;

		        case 'success':

			        res.json({'status':'success','message':'Email send successfully','registerStatus':"success",'data':user});
	                return;

		           break;

		        default: 
			        res.json({'status':'success','message':'Email send successfully','registerStatus':"success",'data':user});
	                return;    
			}
		}
	}).catch(function(error){

        res.json({'status':'fail','message':'Something went wrong','data':error});
        return;
    });

}

exports.verification = async function(req, res) {

	magazineDetail = JSON.parse(magazineDetail.site_options);
	SUBSCRIBE_MAILING_LIST = magazineDetail.SUBSCRIBE_MAILING_LIST;
	child_of = SUBSCRIBE_MAILING_LIST.value;
	let tData = {

		where : {'child_of' : child_of},
		cols : 'id,short_tag,child_of,slug',
	}

    texonomyData = await contentModel.getAll(constant.TAXONOMY,tData).then(async function(texonomyData) {

    	return texonomyData;
	});

	let webUserName = req.body.webUserName;
	let passKey 	= req.body.passKey;

	var option = {

		'webUserName' : webUserName,
		'pass_key' : passKey

	}

	userModel.verification(option).then(function(user) {

		let data ={

			where : { 'dashboard_forms.title' : "Professional Overview", 'dashboard_forms.magazine_id': MAGAZINE_ID},
			join : "dashboard_forms on dashboard_forms.id = dashboard_form_groups.form_id",
			join1 : "dashboard_group_fields on dashboard_group_fields.group_id = dashboard_form_groups.id",
			cols : "dashboard_forms.id as forms_id,dashboard_forms.title,dashboard_forms.magazine_id,dashboard_forms.priority as forms_priority,dashboard_form_groups.form_id as group_forms_id,dashboard_form_groups.title as form_groups_title,dashboard_form_groups.description as form_groups_description,dashboard_form_groups.id as form_groups_id,dashboard_group_fields.title as group_fields_title,dashboard_group_fields.type,dashboard_group_fields.option_data",
		}
		contentModel.getAll(constant.DASHBOARD_FORM_GROUPS,data).then(function(userFrmData) {


			if(user){

				switch(user) {

			        case 'IL':

				        res.json({'status':'success','message':'Invalid Link','registerStatus':user,'formData':''});
		                return;
			           break;

			        case 'success':

				        res.json({'status':'success','message':'Verification successfully','registerStatus':"success",'data':user,'formData':userFrmData,'SUBSCRIBE_MAILING_LIST' :texonomyData});
		                return;

			           break;

			        default: 
				        res.json({'status':'success','message':'Verification successfully','registerStatus':"success",'data':user,'formData':userFrmData,'SUBSCRIBE_MAILING_LIST' :texonomyData });
		                return;    
				}
			}
		});
	}).catch(function(error){

        res.json({'status':'fail','message':'Something went wrong','data':error});
        return;
    });

}

exports.usersRegistration = async function(req, res) {

	let id = req.body.id;
	let password 	= req.body.password;
	let firstName 	= req.body.firstName;
	let lastName 	= req.body.lastName;
	let maling_list = req.body.maling_list; //SUBSCRIBE_MAILING_LIST
	let formData 	= req.body.formData;  //formData

	var option = {

		'id' : id,
		'password' : password,
		'firstName' : firstName,
		'lastName' : lastName,
		'maling_list' : maling_list.split(","),
		'formData' : formData ? JSON.parse(formData) : ''
	}

	userModel.userRegistration(option).then(function(user) {

		res.json({'status':'success','message':'Data updated successfully','data':user});
		return;  

	}).catch(function(error){

        res.json({'status':'fail','message':'Something went wrong','data':error});
        return;
    });

}


exports.userLogin = function(req, res) {

	let email = req.body.email;
	let password = req.body.password;

	base_url = req.protocol + '://'+req.headers['host'];

	contentModel.getAll(constant.USERS,{where : {"webUserName" : email}}).then(function(rs) {
		
		if(rs.length){

			rs = rs[0];
			if(md5(password)==rs.webPassword){

				res.json({'status':'success','message':'login successfully',data:rs});
	        	return

			}else{

				res.json({'status':'fail','message':'invalid login credentials'});
	        	return
			}

		}else{

		    res.json({'status':'fail','message':'Email not exist please signup.'});
		    return;

		}

	}).catch(function(error){

        res.json({'status':'fail','message':'Something went wrong','data':error});
        return;
    });
}

exports.loginUserInfo = function(req, res) {

	let webUserName = req.body.webUserName;

	contentModel.getAll(constant.USERS,{where : {"webUserName" : webUserName}}).then(function(rs) {
		
		if(rs.length){

			res.json({'status':'success','message':'ok',data:rs[0]});
	        return

		}else{

		    res.json({'status':'fail','message':'No record found'});
		    return;

		}

	}).catch(function(error){

        res.json({'status':'fail','message':'Something went wrong','data':error});
        return;
    });
}