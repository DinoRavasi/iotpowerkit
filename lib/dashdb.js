var ibmdb = require('ibm_db');


var credentials_iotpowerkit={
  "port": 50000,
  "db": "BLUDB",
  "username": "dash14214",
  "ssljdbcurl": "jdbc:db2://dashdb-entry-yp-dal09-10.services.dal.bluemix.net:50001/BLUDB:sslConnection=true;",
  "host": "dashdb-entry-yp-dal09-10.services.dal.bluemix.net",
  "https_url": "https://dashdb-entry-yp-dal09-10.services.dal.bluemix.net:8443",
  "dsn": "DATABASE=BLUDB;HOSTNAME=dashdb-entry-yp-dal09-10.services.dal.bluemix.net;PORT=50000;PROTOCOL=TCPIP;UID=dash14214;PWD=)v5SmLI9_Ktg;",
  "hostname": "dashdb-entry-yp-dal09-10.services.dal.bluemix.net",
  "jdbcurl": "jdbc:db2://dashdb-entry-yp-dal09-10.services.dal.bluemix.net:50000/BLUDB",
  "ssldsn": "DATABASE=BLUDB;HOSTNAME=dashdb-entry-yp-dal09-10.services.dal.bluemix.net;PORT=50001;PROTOCOL=TCPIP;UID=dash14214;PWD=)v5SmLI9_Ktg;Security=SSL;",
  "uri": "db2://dash14214:)v5SmLI9_Ktg@dashdb-entry-yp-dal09-10.services.dal.bluemix.net:50000/BLUDB",
  "password": ")v5SmLI9_Ktg"
};

var credentials_cassonetti={
  "port": 50000,
  "db": "BLUDB",
  "username": "dash5078",
  "ssljdbcurl": "jdbc:db2://dashdb-entry-yp-lon02-01.services.eu-gb.bluemix.net:50001/BLUDB:sslConnection=true;",
  "host": "dashdb-entry-yp-lon02-01.services.eu-gb.bluemix.net",
  "https_url": "https://dashdb-entry-yp-lon02-01.services.eu-gb.bluemix.net:8443",
  "dsn": "DATABASE=BLUDB;HOSTNAME=dashdb-entry-yp-lon02-01.services.eu-gb.bluemix.net;PORT=50000;PROTOCOL=TCPIP;UID=dash5078;PWD=H2~(OpsGcTm4;",
  "hostname": "dashdb-entry-yp-lon02-01.services.eu-gb.bluemix.net",
  "jdbcurl": "jdbc:db2://dashdb-entry-yp-lon02-01.services.eu-gb.bluemix.net:50000/BLUDB",
  "ssldsn": "DATABASE=BLUDB;HOSTNAME=dashdb-entry-yp-lon02-01.services.eu-gb.bluemix.net;PORT=50001;PROTOCOL=TCPIP;UID=dash5078;PWD=H2~(OpsGcTm4;Security=SSL;",
  "uri": "db2://dash5078:H2~(OpsGcTm4@dashdb-entry-yp-lon02-01.services.eu-gb.bluemix.net:50000/BLUDB",
  "password": "H2~(OpsGcTm4"
}   

var credentials=credentials_iotpowerkit;


var connstring="DATABASE="+credentials.db+";"
    + "HOSTNAME="+credentials.host+";PORT=50000;PROTOCOL=TCPIP;"
    + "UID="+credentials.username+";PWD="+credentials.password;

var conn;    

/*
open(function(data){
    console.log("DASHDB OPENED !");
});
*/



function open(callback){
    var result={
        success: false,
    }
    ibmdb.open(connstring, function(err, connection) {
        if (err) {
            result.error=err;
            result.success=false;
            console.log("Error", err);
        } else {
            result.success=true;
            conn=connection;
        }
        if (callback) callback(result);
    });
}



function query(qstring,callback){
    var result={
        success: false,
    }

    conn.query(qstring, function(err, rows) {
                if (err) {
                    console.log("Error", err);
                    result.success=false;
                    result.error=err;
                    if (callback) callback(result);
                    return;
                } else {
                    console.log("db2 rows:",rows.length);
                    result.success=true;
                    result.rows=rows;
                    if (callback) callback(result);
                    return;
                   
                }
            });


}


function close(){
     conn.close(function() {
                        console.log("Connection closed successfully");
                    });
}



exports.connstring=connstring;    
exports.open=open;
exports.query=query;
exports.close=close;
