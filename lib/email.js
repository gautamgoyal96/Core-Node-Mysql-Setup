var nodemailer = require('nodemailer');
var ejs   = require('ejs');
//generating a hash
exports.sendVerificationLink = function(magazineDetail,options,base_url,newData) {

	return new Promise((resolve, reject) => {


      

		var template = process.cwd() + '/app/core/templates/newregistration.ejs';
        var templateData = {
            logo : 'http://c21638.r38.cf1.rackcdn.com/footer_'+magazineDetail.MagazineId+'.png',
            magazine_name : magazineDetail.name,
            year : moment().format("YYYY"),
            webUserName : options.webUserName,
            user_full_name : '',
            magazine_url : magazineDetail.url,
            'verify_link': base_url+newData['pass_key']+'/' +options.webUserName+ '/'
        };

        if(process.env.NODE_ENV!="production"){

            options.webUserName = constantt.SMTP_USERNAME;
        }

        ejs.renderFile(template, templateData, 'utf8', function(err, file) {

           var smtpTransport = nodemailer.createTransport({
                host: 'smtp.gmail.com',
                port: 465,
                secure: true,
                service: "Gmail",
                secureConnection: true,
                auth: {
                    user: constantt.SMTP_USERNAME,
                    pass: constantt.SMTP_PASSWORD 
                }
            });
           var mailOptions = {
            	from: 'webmaster@rodpub.com',
                to: options.webUserName,
                subject: 'Welcome to ' + magazineDetail.name,
                html: file
            }

            smtpTransport.sendMail(mailOptions, function(error, response) {
                if(error){
                    reject(error);
                }
                resolve("success");

            });


        });


	});

};