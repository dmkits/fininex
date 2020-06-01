var mysql= require('mysql'), child_process= require('child_process');
var server= require('./server'), log= server.log;

/**
 * connections= { uuid:{ login:<login>, connection: <connection> } }
 */
var connections={};
/**
 * return connection = { login:<login>, connection: <connection> }
 */
module.exports.getUserConnectionData= function(uuid){
    return connections[uuid];
};
module.exports.cleanConnectionPool= function(){
    for(var i in connections)
        if(connections[i].connection) connections[i].connection=null;
    connections={};
};
/**
 * @param userData = { uuid, login, password }
 * @param callback (err,result), result = { dbUC:<database user connection> }, err = { error,errorMessage }
 */
function createNewUserDBConnection(userData, callback){
    var uuid= userData.uuid;
    if(uuid===undefined||uuid===null){                                                                          log.error(uuid,userData.login,"database createNewUserDBConnection: Failed create new user database connection! Reason:No UUID.");
        callback({error:"Failed create new user database connection! Reason:No UUID."});
        return;
    }
    var dbConfig= server.getSysConfig();
    if(!dbConfig){
        callback({error:"Failed create database system connection! Reason: no server configuration!",
            errorMessage:"Не удалось подключиться к базе данных!<br> Нет параметров подключения к базе данных!<br> Обратитесь к системному администратору."});
        return;
    }
    var connectionData= connections[uuid];
    var con = mysql.createConnection({
        host: dbConfig.dbHost,
        port: dbConfig.dbPort,
        user: userData.login,
        password: userData.password,
        database: dbConfig.dbName
    });
    if(!con){
        if(connectionData){ connectionData.connection=null; connectionData.user=userData.login; }
        callback({error:"FAILED create database connection!"});
        return;
    }
    con.connect(function(err) {
        if(err){
            if(connectionData){ connectionData.connection=null; connectionData.user=userData.login; }
            callback({error:"FAILED database connection connect! Reason: "+err.message});
            return;
        }
        con.query('SELECT 1', function (error, results, fields) {
            if(error) throw error;
            if(error){
                if(connectionData){ connectionData.connection=null; connectionData.user=userData.login; }
                callback({error:"FAILED database connection started! Reason: "+error.message});
                return;
            }
            con.userUUID= uuid;
            if(!connectionData)
                connections[uuid]={ connection:con, login:userData.login };
            else{
                connectionData.connection= con;
                connectionData.login= userData.login;
            }
            callback(null,{dbUC:con});// connected! console.log('connected as id ' + con.threadId);
        });
    });
}
module.exports.createNewUserDBConnection= createNewUserDBConnection;

var getConUUID= function(connection){
    return (connection&&connection.config)
        ?((connection.config.userUUID!==undefined)?connection.config.userUUID:connection.config.user)
        :"FAILED DB CONN";
};
module.exports.getConUUID= getConUUID;
var getConU= function(connection){
    return (connection&&connection.config)?connection.config.user:"FAILED DB CONN CONFIG";
};
module.exports.getConU= getConU;

var systemConnectionErr=null;
module.exports.getDBSystemConnection=function(){
    var systemConnectionData=connections["_$SYSDBCONNECTION$_"];
    return (systemConnectionData)?systemConnectionData.connection:null;
};
/**
 * callback= function(err,result)
 *  result = { dbUC:<database user connection> }, err = { error,errorMessage }
 */
function setDBSystemConnection(sysConfig,callback){
    var systemConnectionUUID="_$SYSDBCONNECTION$_";                                                             log.debug(systemConnectionUUID,(sysConfig)?sysConfig.dbUser:"NO SYS CONFIG!","database setDBSystemConnection sysConfig:",sysConfig);
    if(!sysConfig){
        callback({error:"Failed create database system connection! Reason: no database system configuration!"});
        return;
    }
    var systemConnUser= {
        login: sysConfig.dbUser,
        password: sysConfig.dbUserPass,
        uuid: systemConnectionUUID
    };
    createNewUserDBConnection(systemConnUser,function(err,result){
        if(err){                                                                                                log.error(systemConnectionUUID,(sysConfig)?sysConfig.dbUser:"NO SYS CONFIG!","database setDBSystemConnection err:",err);
            systemConnectionErr = err.error;
            callback(err);
            return;
        }
        systemConnectionErr = null;
        callback(null,result);
    });
}
module.exports.setDBSystemConnection= setDBSystemConnection;

function getSystemConnectionErr(){ return systemConnectionErr; }
module.exports.getSystemConnectionErr= getSystemConnectionErr;

/**
 * for MS SQL database select query
 * query= <MS SQL select query string>
 * callback = function(err, recordset, rowsCount, fieldsTypes)
 */
function selectQuery(connection,query, callback){                                                               log.debug(getConUUID(connection),getConU(connection),"database selectQuery query:",query);
    if(!connection){
        if(callback)callback({message:"No user database connection is specified."});
        return;
    }
    connection.query(query,function(err,recordset,fields){
        if(err){                                                                                                log.error(getConUUID(connection),getConU(connection),'database: selectQuery error:',err.message, {});
            callback(err); return;
        }
        callback(null, recordset, recordset.affectedRows, fields);
    });
}
module.exports.selectQuery= selectQuery;
/**
 * for MS SQL database query insert/update/delete
 * query= <MS SQL insert/update/delete query string>
 * callback = function(err, updateCount)
 */
module.exports.executeQuery= function(connection,query,callback){                                                log.debug(getConUUID(connection),getConU(connection),"database executeQuery:",query);
    if(!connection){
        callback({message:"No user database connection is specified."});
        return;
    }
    connection.query(query,function(err,execResult){
        if(err){                                                                                                log.error(getConUUID(connection),getConU(connection),'database: executeQuery error:',err.message,{});
            callback(err); return;
        }                                                                                                       log.debug(getConUUID(connection),getConU(connection),'database: executeQuery result:',execResult,execResult.affectedRows,{});//test
        callback(null, execResult.affectedRows);
    });
};
/**
 * for MS SQL database select query
 * query= <MS SQL select query string>
 * callback = function(err, recordset, rowsCount, fieldsTypes)
 */
function selectParamsQuery(connection,query, parameters, callback) {                                            log.debug(getConUUID(connection),getConU(connection),"database selectParamsQuery query:",query," parameters:",parameters,{});
    if(!connection){
        callback({message:"No user database connection is specified."});
        return;
    }
    connection.query(query,parameters,function(err,recordset,fields){
        if(err){                                                                                                log.error(getConUUID(connection),getConU(connection),'database: selectParamsQuery error:',err.message,{});
            callback(err); return;
        }
        callback(null, recordset, recordset.affectedRows, fields);
    });
}
module.exports.selectParamsQuery= selectParamsQuery;
/**
 * for MS SQL database query insert/update/delete
 * query= <MS SQL insert/update/delete query string>
 * paramsValueObj = {<paramName>:<paramValue>,...}
 * callback = function(err, updateCount)
 */
module.exports.executeParamsQuery= function(connection, query, parameters, callback){                           log.debug(getConUUID(connection),getConU(connection),"database executeParamsQuery:",query,parameters);
    if(!connection){
        callback({message:"No user database connection is specified."});
        return;
    }
    connection.query(query,parameters,function(err,execResult){
        if(err){                                                                                                //log.error(getConUUID(connection),getConU(connection),'database: executeParamsQuery error:',err.message,err.precedingErrors,{});//test
            var precedingErrors= err.precedingErrors, sMsg=null, sErr="";
            for(var prErrNum in precedingErrors){
                var prErrItem= precedingErrors[prErrNum], sReqErrMsg= prErrItem.message,
                    sReqErrProcName= prErrItem.procName,sReqErrLineNumber= prErrItem.lineNumber;                //log.error(getConUUID(connection),getConU(connection),'database: executeParamsQuery error info:',sReqErrMsg,sReqErrProcName,sReqErrLineNumber,prErrItem,{});//test
                sMsg=((!sMsg)?"":sMsg+"\n")+sReqErrMsg;
                sErr=((!sErr)?"":sErr+"\n")+sReqErrMsg+((sReqErrProcName)?" Error in "+sReqErrProcName:"")+((sReqErrLineNumber)?", in line "+sReqErrLineNumber:"");
            }
            var qErr= {message:sMsg||err.message, error:sErr||err.message};                                     log.error(getConUUID(connection),getConU(connection),'database: executeParamsQuery error:',qErr,{});//test
            callback(qErr);
            return;
        }                                                                                                       log.debug(getConUUID(connection),getConU(connection),'database: executeParamsQuery result:',execResult,execResult.affectedRows,{});//test
        callback(null, execResult.affectedRows);
    });
};
/**
 * params = { dbHost, dpPort, dbUser, dbUserPswrd }
 */
module.exports.getDatabasesForUser= function(connection,params,callback){
    var dbListForUserConfig= {
        host: params.dbHost,
        port: params.dbPort,
        user: params.dbUser,
        password:params.dbUserPswrd
    };
    var dbListForUserConn= mysql.createConnection(dbListForUserConfig);
    dbListForUserConn.connect(function(err){
        if(err){                                                                                                log.error(getConUUID(connection),getConU(connection),"database.getDatabasesForUser connect error:",err.message);
            callback(err.message);
            return;
        }
        dbListForUserConn.query("SHOW DATABASES",function(err,dbList){
            if(err){ callback(err); return; }
            callback(null,dbList,params.dbUser);
            dbListForUserConn.destroy();
        });
    });
};

module.exports.createNewDB= function(connection,DBName,callback){
    connection.query('CREATE SCHEMA '+DBName,
        function(err){
            if(err){ callback(err); return; }
            callback(null, DBName+" Database created!");
        });
};

module.exports.checkIfUserExists= function(connection,newUserName,callback){
    connection.query("select * from mysql.user where user='"+newUserName+"'",
        function(err,recordset){
            if(err){ callback(err); return; }
            callback(null,recordset);
        });
};

module.exports.createNewUser= function(connection,newUserName,host,newUserPassword,callback){
    connection.query("CREATE USER '"+newUserName+"'@'"+host+"' IDENTIFIED BY '"+newUserPassword+"'",
        function(err){
            if(err){ callback(err); return; }
            callback(null,"User "+ newUserName+" created!");
        });
};

module.exports.grantUserAccess= function(connection,userName,host,newDBName,callback){
    connection.query("GRANT ALL PRIVILEGES ON "+newDBName+".* TO '"+userName+"'@'"+host+"' WITH GRANT OPTION",
        function(err){
            if(err){ callback(err); return; }
            callback(null,userName+" granted privileges!");
        });
};

module.exports.dropDB= function(connection,DBName,callback){
    connection.query("DROP DATABASE "+DBName,
        function(err){
            if(err){ callback(err); return; }
            callback(null,DBName+" dropped!");
        });
};

module.exports.isDBEmpty= function(connection,DBName,callback){
    connection.query("SELECT table_name FROM information_schema.tables where table_schema='"+DBName+"'",
        function(err,recordset){
            if(err){ callback(err); return; }
            callback(null,recordset[0]);
        });
};

/**
 * backupParam = {host, database, fileName, user, password,  onlyData:true/false}
 * default onlyData=false
 */
module.exports.backupDB= function(backupParam,callback){
    var onlyDataCommand=
        (backupParam.onlyData==='true') ? " --no-create-info   --ignore-table="+backupParam.database+".change_log" : " ";
    var backupDir=__dirname+'/../backups/';
    if(!fs.existsSync(backupDir)){ fs.mkdirSync(backupDir); }
    var filePath=path.join(backupDir+backupParam.fileName);
    var command ='mysqldump'+onlyDataCommand + ' -u '+ backupParam.user + ' --password="'+backupParam.password+
        '" --host='+backupParam.host +' '+backupParam.database+' --result-file='+filePath;                      log.debug("database.backupDB command=",command);
    child_process.exec(command, function(err,stdout,stderr){
        if(err){                                                                                                log.error("err backupDB=", err);
            callback(err);
            return;
        }
        if(stdout){
            log.info("stdout backupDB=",stdout);
        }
        if(stderr && stderr.indexOf("Warning")<0){                                                              log.error("stderr backupDB=",stderr);
            callback(stderr);
            return;
        }
        callback(null,"Database "+backupParam.database+" backup saved to "+backupParam.fileName);
    });
};
/**
 * restoreParams = {host, database, fileName, user, password}
 * default onlyData=false
 */
module.exports.restoreDB= function(restoreParams,callback){
    var filePath=path.join(__dirname+'/../backups/'+restoreParams.fileName);
    var command ='mysql -u '+restoreParams.user+' --password="'+restoreParams.password+
        '" -h '+restoreParams.host+' '+restoreParams.database+' < '+ filePath;                                  log.debug("database.restoreDB command=",command);
    child_process.exec(command, function(err,stdout,stderr){
        if(err){                                                                                                log.error("database.restoreDB error=", err);
            callback(err);
            return;
        }
        if(stdout){
            log.info("stdout restoreDB=",stdout);
        }
        if(stderr && stderr.indexOf("Warning")<0){                                                              log.error("database.restoreDB stderr=",stderr);
            callback(stderr);
            return;
        }
        callback(null,"Database "+restoreParams.database+" restored successfully!");
    });
};
