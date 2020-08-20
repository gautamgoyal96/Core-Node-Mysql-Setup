var bcrypt   = require('bcrypt-nodejs');

//generating a hash
exports.generateHash = function(password) {

	return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);

};

exports.validPassword = function(password,cPassword) {
 return bcrypt.compareSync(password, cPassword);
};

//checking if password is valid
