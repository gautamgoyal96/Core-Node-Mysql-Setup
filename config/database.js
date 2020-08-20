if(process.env.NODE_ENV=="test"){

	module.exports = {
	      host     : 'localhost',
		  user     : 'root',
		  password : 'mysql',
		  database : 'tcpb'
	};

}else if(process.env.NODE_ENV=="production"){

	
	module.exports = {
	      host     : 'localhost',
		  user     : 'root',
		  password : 'mysql',
		  database : 'tcpb'
	};

}else{

	module.exports = {
	      host     : 'localhost',
		  user     : 'root',
		  password : 'mysql',
		  database : 'tcpb'
	};

}