namespace dbadmin;

entity CLASS {
    key ID        : String(45);
        CLASSNAME : String(255);
}

entity ELECTIVE_OPTIONS {
    key ID           : String(45);
        ELECTIVENAME : String(255);
}

entity USER {
    key ID           : String(45);
        NAME         : String(255);
        ROLLNUMBER   : String(45);
        MOBILENUMBER : String(13);
        CLASS        : String(255);
        QUESTION     : String(1000);
}

entity USER_ELECTIVE {
    key ID           : String(45);
        ELECTIVENAME : String(255);
        userID       : String(45);


        USERREF      : Association to USER
                           on USERREF.ID = userID;
}
