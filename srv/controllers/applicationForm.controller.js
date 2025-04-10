// const hanaDb = require("../../db/hanadb");

const { v4: uuidv4 } = require("uuid");

exports.getClassList = async (req, res) => {
  let query = `SELECT * FROM DBADMIN_CLASS`;
  await req.db.exec(query, (err, result) => {
    if (err) {
      console.log("getClassList::", err, "query::", query);
      return res.status(500).send(err);
    }
    if (result) {
      res.status(200).send(result);
    }
  });
};

exports.getElectiveList = async (req, res) => {
  let query = `SELECT * FROM DBADMIN_ELECTIVE_OPTIONS`;
  await req.db.exec(query, (err, result) => {
    if (err) {
      console.log("getElectiveList::", err, "query::", query);
      return res.status(500).send(err);
    }
    if (result) {
      res.status(200).send(result);
    }
  });
};

exports.createUser = async (req, res) => {
  try {
    const payload = req.body;
    const userId = uuidv4();

    // Insert user
    const userInsertQuery = `
      INSERT INTO DBADMIN_USER (ID, NAME, ROLLNUMBER, MOBILENUMBER, CLASS, QUESTION) 
      VALUES (?, ?, ?, ?, ?, ?)
    `;

    await new Promise((resolve, reject) => {
      req.db.exec(
        userInsertQuery,
        [
          userId,
          payload.name,
          payload.rollNumber,
          payload.mobileNumber,
          payload.class,
          payload.question,
        ],
        (err, result) => {
          if (err) {
            console.error("USER insert query error:", err);
            return reject(err);
          }
          resolve();
        }
      );
    });

    // Insert electives
    const insertElective = (elective) => {
      return new Promise((resolve, reject) => {
        const electiveId = uuidv4();
        const electiveQuery = `
          INSERT INTO DBADMIN_USER_ELECTIVE (ID, ELECTIVENAME, USERID) 
          VALUES (?, ?, ?)
        `;
        req.db.exec(
          electiveQuery,
          [electiveId, elective, userId],
          (err, result) => {
            if (err) {
              console.error("USER_ELECTIVE insert query error:", err);
              return reject(err);
            }
            resolve();
          }
        );
      });
    };

    await Promise.all(payload.answer.map(insertElective));

    res
      .status(201)
      .send({ userId, message: "User and electives created successfully" });
  } catch (error) {
    console.error("Error::", error);
    res.status(500).send("Server Error");
  }
};
