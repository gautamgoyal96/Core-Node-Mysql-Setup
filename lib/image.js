var fs = require('fs');

exports.fileUploads = function(image,dir) {

    return new Promise((resolve, reject) => {
       var imageName = Date.now() + ".jpg";
        fs.mkdir('./public/uploads/'+dir, { recursive: true }, err => {
            var newpath = './public/uploads/'+dir+"/"+ imageName;
            if(image){
                image.mv(newpath, function(err) {
                    if (err){
                       reject(err);
                    }else{
                        resolve(imageName);
                    }
                });
            }else{
                resolve('');
            }

        });
    });

    
}


exports.displayImageUrl = function(imageId) {

    return (imageId!='0') ? constantt.IMAGE_DOMAIN+imageId.substr(0, 3)+"/"+imageId.substr(3)+'_main.jpg' : constantt.DEFAULT_IMAGE;   
}
exports.displayImageThumbURL = function(imageId) {

    return (imageId!='0') ? constantt.IMAGE_DOMAIN+imageId.substr(0, 3)+"/"+imageId.substr(3)+'_thumb.jpg' : constantt.DEFAULT_IMAGE;   

}
