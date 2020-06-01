module.exports.id=module.id;
module.exports.changeLog = [
    { changeID:"chl__1", changeDatetime:"2020-05-26 14:00:00", changeObj:"change_log",
        changeVal:"CREATE TABLE change_log(" +
            "ID VARCHAR(64) NOT NULL PRIMARY KEY, CHANGE_DATETIME DATETIME NOT NULL," +
            "CHANGE_OBJ VARCHAR(255) NOT NULL, CHANGE_VAL VARCHAR(20000) NOT NULL," +
            "APPLIED_DATETIME DATETIME NOT NULL) CHARACTER SET utf8",
        tableName:"change_log",
        fields:["ID","CHANGE_DATETIME","CHANGE_OBJ","CHANGE_VAL","APPLIED_DATETIME"] , idField:"ID"}
];
