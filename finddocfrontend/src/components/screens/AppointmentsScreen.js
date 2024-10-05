import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { listDoctorAppointments, listUserAppointments } from '../../actions/createAppointment';
import { Container, ListGroup, ListGroupItem, Spinner, Alert, Button } from 'react-bootstrap';

const AppointmentsScreen = () => {
  const dispatch = useDispatch();

  const appointmentList = useSelector((state) => state.appointmentList);
  const { loading, error, appointments } = appointmentList;

  const userDetails = useSelector((state) => state.userDetails);
  const { user } = userDetails;

  useEffect(() => {
    if (user) {
      dispatch(listDoctorAppointments());
      dispatch(listUserAppointments());
    }
  }, [dispatch, user]);

  return (
    <Container className="appointments-container mt-4">
      {loading ? (
        <Spinner animation="border" variant="primary" />
      ) : error ? (
        <Alert variant="danger">{error}</Alert>
      ) : (
        <ListGroup>
          {Array.isArray(appointments) && appointments.length > 0 ? (
            appointments.map((item) => (
              <ListGroupItem key={item.id} className="mb-3">
                <h5>Client: {item.user_name}</h5>
                <h6>Doctor: {item.doctor_name}</h6>
                <p>Time: {item.appointment_time}</p>
                <p>
                  Status: 
                  <span className={`ms-2 ${getStatusClass(item.status)}`}>
                    {getStatusIcon(item.status)}
                    {item.status}
                  </span>
                </p>
                {/* Show the video call button if the status is 'Completed' */}
                {item.status === 'Completed' && (
                  <Button variant="primary" onClick={() => handleVideoCall(item)}>
                    Start Video Call
                  </Button>
                )}
              </ListGroupItem>
            ))
          ) : (
            <Alert variant="info">No appointments found.</Alert>
          )}
        </ListGroup>
      )}
    </Container>
  );
};

// Function to determine the CSS class for status based on appointment status
const getStatusClass = (status) => {
  switch (status) {
    case 'Completed':
      return 'text-success'; // Green text for completed appointments
    case 'Pending':
      return 'text-warning'; // Orange text for pending appointments
    case 'Cancelled':
      return 'text-danger'; // Red text for cancelled appointments
    default:
      return ''; // Default class
  }
};

// Function to get the appropriate icon for each status
const getStatusIcon = (status) => {
  switch (status) {
    case 'Completed':
      return <i className="bi bi-check-circle-fill text-success" />;
    case 'Pending':
      return <i className="bi bi-clock-fill text-warning" />;
    case 'Cancelled':
      return <i className="bi bi-x-circle-fill text-danger" />;
    default:
      return <i className="bi bi-question-circle" />; // Default icon
  }
};

// Function to handle video call initiation
const handleVideoCall = (item) => {
  // Implement your logic to start a video call
  console.log('Starting video call for appointment:', item);
};

export default AppointmentsScreen;
