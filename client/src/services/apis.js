
// const BASE_URL = process.env.REACT_APP_BASE_URL;

export const BASE_URL = "https://meetix.mahitechnocrafts.in/api/v1"






export const subscription = {
  CREATE_PAYMENT: BASE_URL + "/subscription/create",
  VERIFY_PAYMENT: BASE_URL + "/subscription/payment-success",
  GET_ALL_SUB: BASE_URL + "/subscription/getAll",
}

export const userEndpoints = {
  ADD_UPCOMING_MEETING_API : BASE_URL + "/user/create",
  GET_SCHEDULE_MEETING: BASE_URL + "/user/getAll",
  DELETE_SCHEDULE_MEETING: BASE_URL + "/user/delete",
  UPDATE_SCHEDULE_MEETING: BASE_URL + "/user/upcoming-meetings",
  GET_MEETINGS_ACTIVITY: BASE_URL + "/user/room-activity",
  
  
  
  GET_MEETINGS_DETAILS: BASE_URL + "/user/room-details",
  GET_USER_MEETINGS: BASE_URL + "/user/user-meetings",
  
}
