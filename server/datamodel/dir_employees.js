module.exports.id=module.id;
var changeLog = [
    { changeID: "dir_employees__1", changeDatetime: "2020-05-26 16:31:00", changeObj: "dir_employees",
        changeVal: "CREATE TABLE dir_employees(ID BIGINT UNSIGNED PRIMARY KEY NOT NULL) CHARACTER SET utf8",
        tableName:"dir_employees", field:"ID", idField:"ID" },
    { changeID: "dir_employees__2", changeDatetime: "2020-05-26 16:32:00", changeObj: "dir_employees",
        changeVal: "ALTER TABLE dir_employees ADD COLUMN NAME VARCHAR(200) NOT NULL",
        field:"NAME" },
    { changeID: "dir_employees__3", changeDatetime: "2020-05-26 16:33:00", changeObj: "dir_employees",
        changeVal: "ALTER TABLE dir_employees ADD CONSTRAINT dir_employees_NAME_UNIQUE UNIQUE(NAME)" },
    { changeID: "dir_employees__4", changeDatetime: "2020-05-26 16:34:00", changeObj: "dir_employees",
        changeVal: "ALTER TABLE dir_employees ADD COLUMN FULL_NAME VARCHAR(500) NOT NULL",
        field:"FULL_NAME" },
    { changeID: "dir_employees__5", changeDatetime: "2020-05-26 16:35:00", changeObj: "dir_employees",
        changeVal: "ALTER TABLE dir_employees ADD COLUMN NOTE VARCHAR(500)",
        field:"NOTE" },
    { changeID: "dir_employees__6", changeDatetime: "2020-05-26 16:36:00", changeObj: "dir_employees",
        changeVal: "ALTER TABLE dir_employees ADD COLUMN POST VARCHAR(255) NOT NULL",
        field:"POST" },
    { changeID: "dir_employees__7", changeDatetime: "2020-05-26 16:37:00", changeObj: "dir_employees",
        changeVal: "ALTER TABLE dir_employees ADD COLUMN ROLENAME VARCHAR(100) NOT NULL",
        field:"ROLENAME" },
    { changeID: "dir_employees__8", changeDatetime: "2020-05-26 16:38:00", changeObj: "dir_employees",
        changeVal: "ALTER TABLE dir_employees ADD COLUMN LOGIN VARCHAR(100) NOT NULL",
        field:"LOGIN" },
    { changeID: "dir_employees__9", changeDatetime: "2020-05-26 16:39:00", changeObj: "dir_products_articles",
        changeVal: "ALTER TABLE dir_employees ADD CONSTRAINT DIR_EMPLOYEES_LOGIN_UNIQUE UNIQUE(LOGIN)" },
    { changeID: "dir_employees_10", changeDatetime: "2020-05-26 16:40:00", changeObj: "dir_employees",
        changeVal: "ALTER TABLE dir_employees ADD COLUMN LOGINPSWRD VARCHAR(100) NOT NULL",
        field:"LOGINPSWRD" },
    { changeID: "dir_employees_11", changeDatetime: "2020-05-26 16:41:00", changeObj: "dir_employees",
        changeVal:
            "INSERT INTO dir_employees (ID,NAME,FULL_NAME,NOTE,POST,ROLENAME,LOGIN) " +
                "values (0,'Сисадмин','Системный администратор','Системный администратор','Сисадмин','sysadmin','root')" },
    { changeID: "dir_employees_12", changeDatetime: "2020-05-26 16:42:00", changeObj: "dir_employees",
        changeVal:
            "INSERT INTO dir_employees (ID,NAME,FULL_NAME,NOTE,POST,ROLENAME,LOGIN) " +
                "values (1,'Директор','Директор','Директор','Директор','director','director')" },
    { changeID: "dir_employees_13", changeDatetime: "2020-05-26 16:43:00", changeObj: "dir_employees",
        changeVal:
            "INSERT INTO dir_employees (ID,NAME,FULL_NAME,NOTE,POST,ROLENAME,LOGIN) " +
                "values (2,'Фин. директор 1','Финансовый директор 1','Фин.директор 1','Фин.директор','findirector','findir1')" },
    { changeID: "dir_employees_14", changeDatetime: "2020-05-26 16:44:00", changeObj: "dir_employees",
        changeVal:
            "INSERT INTO dir_employees (ID,NAME,FULL_NAME,NOTE,POST,ROLENAME,LOGIN) " +
                "values (3,'Бухгалтер 1','Бухгалтер 1','Бухгалтер 1','Бухгалтер','buhgalter','buhg1')" }
];
module.exports.changeLog=changeLog;
