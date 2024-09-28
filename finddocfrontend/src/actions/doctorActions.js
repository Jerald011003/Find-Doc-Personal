import axiosInstance from '../actions/axiosInstance';
import {
    DOCTOR_LIST_REQUEST,
    DOCTOR_LIST_SUCCESS,
    DOCTOR_LIST_FAIL,
    DOCTOR_DETAIL_REQUEST,
    DOCTOR_DETAIL_SUCCESS,
    DOCTOR_DETAIL_FAIL,
    DOCTOR_CREATE_REQUEST,
    DOCTOR_CREATE_SUCCESS,
    DOCTOR_CREATE_FAIL,
    DOCTOR_UPDATE_REQUEST,
    DOCTOR_UPDATE_SUCCESS,
    DOCTOR_UPDATE_FAIL,
    DOCTOR_DELETE_REQUEST,
    DOCTOR_DELETE_SUCCESS,
    DOCTOR_DELETE_FAIL,
} from '../constants/doctorConstants';

export const listDoctors = () => async (dispatch, getState) => {
    try {
        dispatch({ type: DOCTOR_LIST_REQUEST });

        const { data } = await axiosInstance.get('/api/doctors/');

        dispatch({
            type: DOCTOR_LIST_SUCCESS,
            payload: data,
        });
    } catch (error) {
        dispatch({
            type: DOCTOR_LIST_FAIL,
            payload: error.response && error.response.data.detail ? error.response.data.detail : error.message,
        });
    }
};

// Get doctor details
export const getDoctorDetails = (id) => async (dispatch, getState) => {
    try {
        dispatch({ type: DOCTOR_DETAIL_REQUEST });

        const {
            userLogin: { userInfo },
        } = getState();

        const config = {
            headers: {
                Authorization: `Bearer ${userInfo.access}`,
            },
        };

        const { data } = await axiosInstance.get(`/api/doctors/${id}/`, config);

        dispatch({
            type: DOCTOR_DETAIL_SUCCESS,
            payload: data,
        });
    } catch (error) {
        dispatch({
            type: DOCTOR_DETAIL_FAIL,
            payload: error.response && error.response.data.detail ? error.response.data.detail : error.message,
        });
    }
};

// Create a new doctor
export const createDoctor = (doctorData) => async (dispatch, getState) => {
    try {
        dispatch({ type: DOCTOR_CREATE_REQUEST });

        const {
            userLogin: { userInfo },
        } = getState();

        const config = {
            headers: {
                Authorization: `Bearer ${userInfo.access}`,
                'Content-Type': 'application/json',
            },
        };

        const { data } = await axiosInstance.post('/api/doctors/create/', doctorData, config);

        dispatch({
            type: DOCTOR_CREATE_SUCCESS,
            payload: data,
        });
    } catch (error) {
        dispatch({
            type: DOCTOR_CREATE_FAIL,
            payload: error.response && error.response.data.detail ? error.response.data.detail : error.message,
        });
    }
};

// Update a doctor
export const updateDoctor = (id, doctorData) => async (dispatch, getState) => {
    try {
        dispatch({ type: DOCTOR_UPDATE_REQUEST });

        const {
            userLogin: { userInfo },
        } = getState();

        const config = {
            headers: {
                Authorization: `Bearer ${userInfo.access}`,
                'Content-Type': 'application/json',
            },
        };

        const { data } = await axiosInstance.put(`/api/doctors/update/${id}/`, doctorData, config);

        dispatch({
            type: DOCTOR_UPDATE_SUCCESS,
            payload: data,
        });
    } catch (error) {
        dispatch({
            type: DOCTOR_UPDATE_FAIL,
            payload: error.response && error.response.data.detail ? error.response.data.detail : error.message,
        });
    }
};

// Delete a doctor
export const deleteDoctor = (id) => async (dispatch, getState) => {
    try {
        dispatch({ type: DOCTOR_DELETE_REQUEST });

        const {
            userLogin: { userInfo },
        } = getState();

        const config = {
            headers: {
                Authorization: `Bearer ${userInfo.access}`,
            },
        };

        await axiosInstance.delete(`/api/doctors/delete/${id}/`, config);

        dispatch({
            type: DOCTOR_DELETE_SUCCESS,
        });
    } catch (error) {
        dispatch({
            type: DOCTOR_DELETE_FAIL,
            payload: error.response && error.response.data.detail ? error.response.data.detail : error.message,
        });
    }
};
