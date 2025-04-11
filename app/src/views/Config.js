/* eslint-disable import/no-anonymous-default-export */
export default {
  SAP_SSO_ENABLED: process.env.REACT_APP_MODE === "prod" ? true : false,
  LOCAL_DEV_NODE_URL: "http://localhost:4000", //For Local DEV

  GET_CLASS_LIST: "/api/applicationForm/getClassList",
  GET_ELECTIVE_LIST: "/api/applicationForm/getElectiveList",
  CREATE_USER: "/api/applicationForm/createUser",
};
