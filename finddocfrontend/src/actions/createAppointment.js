import axiosInstance from '../actions/axiosInstance';
import {
  APPOINTMENT_CREATE_REQUEST,
  APPOINTMENT_CREATE_SUCCESS,
  APPOINTMENT_CREATE_FAIL,
  APPOINTMENT_LIST_REQUEST,
  APPOINTMENT_LIST_SUCCESS,
  APPOINTMENT_LIST_FAIL,
  APPOINTMENT_UPDATE_REQUEST, 
  APPOINTMENT_UPDATE_SUCCESS, 
  APPOINTMENT_UPDATE_FAIL 
} from '../constants/appointmentConstants';

export const createAppointment = (appointmentData) => async (dispatch, getState) => {
  try {
    dispatch({ type: APPOINTMENT_CREATE_REQUEST });

    const { userLogin: { userInfo } } = getState();

    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.access}`,
        'Content-Type': 'application/json', // Ensure JSON format
      },
    };

    // Ensure that appointmentData is correctly sent as a JSON string
    const { data } = await axiosInstance.post(
      '/api/appointments/create/', 
      JSON.stringify(appointmentData),  // Convert JS object to JSON string
      config
    );

    dispatch({
      type: APPOINTMENT_CREATE_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: APPOINTMENT_CREATE_FAIL,
      payload: error.response && error.response.data.detail ? error.response.data.detail : error.message,
    });
  }
};

export const listUserAppointments = () => async (dispatch, getState) => {
  try {
    dispatch({ type: APPOINTMENT_LIST_REQUEST });

    const { userLogin: { userInfo } } = getState();

    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.access}`,
        'Content-Type': 'application/json',
      },
    };

    const { data } = await axiosInstance.get('/api/appointments/', config);

    dispatch({
      type: APPOINTMENT_LIST_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: APPOINTMENT_LIST_FAIL,
      payload: error.response && error.response.data.detail ? error.response.data.detail : error.message,
    });
  }
};

export const listDoctorAppointments = () => async (dispatch, getState) => {
  try {
    dispatch({ type: APPOINTMENT_LIST_REQUEST });

    const { userLogin: { userInfo } } = getState();

    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.access}`,
        'Content-Type': 'application/json',
      },
    };

    const { data } = await axiosInstance.get('/api/appointments/doctor/', config); // New endpoint for doctor's appointments

    dispatch({
      type: APPOINTMENT_LIST_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: APPOINTMENT_LIST_FAIL,
      payload: error.response && error.response.data.detail ? error.response.data.detail : error.message,
    });
  }
};

export const updateAppointment = (appointmentId, googleMeetLink) => async (dispatch, getState) => {
  try {
    dispatch({ type: APPOINTMENT_UPDATE_REQUEST });

    const { userLogin: { userInfo } } = getState(); // Assuming you have user login info in state

    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userInfo.token}`, // Use the token from the user info
      },
    };

    // Use the Axios instance here
    const { data } = await axiosInstance.post(
      `/api/appointments/doctor/update/`,
      { appointment_id: appointmentId, google_meet_link: googleMeetLink },
      config
    );

    dispatch({ type: APPOINTMENT_UPDATE_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: APPOINTMENT_UPDATE_FAIL,
      payload: error.response && error.response.data.detail
        ? error.response.data.detail
        : error.message,
    });
  }
};
