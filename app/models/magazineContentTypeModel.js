class MagazineContentType {

  async getBrands(content_type_id,custom_fields) {

      const Content         = require('./contentModel');//you can include all your lib
      let contentModel = new Content();

        return new Promise(async (resolve,reject) => {

            var bgBrand = [];

            if(MAGAZINE_ID==1){

               var getBrands = await contentModel.getAll(constant.MAGAZINE_CONTENTS_TYPE,{'where':{'magazine_id':MAGAZINE_ID,'content_type_id':content_type_id}}).then(async function(contentData) {
                    return JSON.parse(contentData[0].custom_fields);
                });

               var brands = getBrands.brands.fields;
                brands.forEach(results => {
                    if(custom_fields.hasOwnProperty(results.key)){
                        bgBrand.push(custom_fields[results.key].value);
                    }
                });
                
            }
            resolve(bgBrand);

        });

   }
}
module.exports = MagazineContentType;