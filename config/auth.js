
var credentials = {
    userName: "admin",
    password: "admin@123"
};

var realm = 'Basic Authentication';
function authenticationStatus(resp) {

    resp.json({'status':'fail',"message":'Authorization invalid'});
    return;
 
};
 

exports.authentication = function(req , res, next){


	res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    
 	var authentication, loginInfo;
    request = req;
    response = res;
   
    if (!request.headers.authorization) {
        authenticationStatus (response);
    }else{

	    authentication = request.headers.authorization.replace(/^Basic/, '');
	 
	    authentication = (Buffer.from(authentication, 'base64')).toString('utf8');
	 
	    loginInfo = authentication.split(':');

	    if (loginInfo[0] === credentials.userName && loginInfo[1] === credentials.password) {
	        
			next();

	    }else{
	     	
			authenticationStatus (response);
		
		}
	}
 
 }