var mysql = require('mysql');

function getConnection(){
	var connection = mysql.createConnection({
		host     : 'http://library.c6ayadrbxmzl.us-west-1.rds.amazonaws.com',
		user     : 'master',
		password : 'master123',
		database : 'library',
		port  : 3306 
		});
	return connection;
	
}

 function fetchData(callback,sqlQuery){
	 console.log("\nSQL Query::"+sqlQuery);
	 var connection=getConnection();
	 console.log('Connection established');
	 connection.query(sqlQuery, function(err, rows, fields) {
		 if(err){ 
			 console.log("ERROR: " + err.message);
			 callback(err, err.message);
			 }
		 else   {
			 console.log("DB Results:"+rows);
			 callback(err, rows);
			 }
		 }); 
	 	console.log("\nConnection closed.."); 
	 	connection.end();
 	} 
 exports.fetchData=fetchData;