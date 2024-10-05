// reducers/appointmentReducer.js

import {
    APPOINTMENT_CREATE_REQUEST,
    APPOINTMENT_CREATE_SUCCESS,
    APPOINTMENT_CREATE_FAIL,
    APPOINTMENT_LIST_REQUEST,
    APPOINTMENT_LIST_SUCCESS,
    APPOINTMENT_LIST_FAIL,
    USER_APPOINTMENT_RESET,
} from '../constants/appointmentConstants';

const initialState = {
    appointment: [],
    loading: false,
    error: null,
};

export const appointmentCreateReducer = (state = initialState, action) => {
    switch (action.type) {
        case APPOINTMENT_CREATE_REQUEST:
            return { loading: true };
        case APPOINTMENT_CREATE_SUCCESS:
            return { loading: false, appointment: action.payload, error: null };
        case APPOINTMENT_CREATE_FAIL:
            return { loading: false, error: action.payload };
        default:
            return state;
    }
};

export const appointmentListReducer = (state = initialState, action) => {
    switch (action.type) {
        case APPOINTMENT_LIST_REQUEST:
            return { ...state, loading: true };
        case APPOINTMENT_LIST_SUCCESS:
            return { loading: false, appointments: action.payload };
        case APPOINTMENT_LIST_FAIL:
            return { loading: false, error: action.payload };
        case USER_APPOINTMENT_RESET: // Reset the state on logout
            return initialState; // Reset to initial state
        default:
            return state;
    }
};
