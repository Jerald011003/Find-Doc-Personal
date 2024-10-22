import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAppointmentDetails, payAppointment } from '../../actions/createAppointment';
import { Spinner, Alert, Button } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import { PayPalButton } from 'react-paypal-button-v2';
import Loader from '../Loader';

const PayAppointmentScreen = () => {
    const { id } = useParams();
    const dispatch = useDispatch();

    const appointmentDetails = useSelector((state) => state.appointmentDetails);
    const { loading, error, appointment } = appointmentDetails;

    const [sdkReady, setSdkReady] = useState(false);

    useEffect(() => {
        if (id) {
            dispatch(getAppointmentDetails(id));
        }
    }, [dispatch, id]);

    const addPayPalScript = () => {
        if (!document.querySelector(`script[src*="paypal.com/sdk/js"]`)) {
            const script = document.createElement('script');
            script.type = 'text/javascript';
            script.src = 'https://www.paypal.com/sdk/js?client-id=AfWCkVHsxTIHY7IU9rVzqHLAFUcZjU6Lnrqf8h81x7cIdpIJHvomiPo4Vr_RqlayO56tCESJ9D0r6ldo';
            script.async = true;
            script.onload = () => setSdkReady(true);
            document.body.appendChild(script);
        } else {
            setSdkReady(true);
        }
    };

    useEffect(() => {
        if (appointment) {
            if (appointment.status === 'Pending' && !appointment.isPaid) {
                if (!window.paypal) {
                    addPayPalScript();
                } else {
                    setSdkReady(true);
                }
            } else {
                setSdkReady(true); 
            }
        }
    }, [appointment]);

    const successPaymentHandler = (paymentResult) => {
        console.log('Payment Result:', paymentResult);
        dispatch(payAppointment(id, paymentResult));
    };

    console.log(appointment)
    // Continue, it should reload automatically and go back to appointments
    return (
        <div className="payment-screen-container">
            {loading ? (
                <Spinner animation="border" variant="primary" />
            ) : error ? (
                <Alert variant="danger">{error}</Alert>
            ) : (
                <div>
                    <h1>Pay for Appointment</h1>
                    {appointment && (
                        <div>
                            <h5>Client: {appointment.user_name}</h5>
                            <h6>Doctor: {appointment.doctor_name}</h6>
                            <p>Time: {appointment.appointment_time}</p>
                            <p>Status: {appointment.status}</p>
                            <p>Price: {appointment.price}</p>

                            {!sdkReady ? (
                                <Loader />
                            ) : (
                                <PayPalButton
                                    amount={appointment.price}
                                    onSuccess={successPaymentHandler}
                                    onError={(err) => console.error(err)}
                                    options={{
                                        clientId: "AfWCkVHsxTIHY7IU9rVzqHLAFUcZjU6Lnrqf8h81x7cIdpIJHvomiPo4Vr_RqlayO56tCESJ9D0r6ldo",
                                        currency: "USD",
                                    }}
                                />
                            )}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default PayAppointmentScreen;
