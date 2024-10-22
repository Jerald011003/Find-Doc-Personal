import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAppointmentDetails, listDoctorAppointments, listUserAppointments, updateAppointment } from '../../actions/createAppointment';
import { Container, ListGroup, ListGroupItem, Spinner, Alert, Button, Modal, Form } from 'react-bootstrap';
import VideoCallScreen from './VideoCallScreen';
import { useParams, useHistory } from 'react-router-dom';

const AppointmentsScreen = ({history}) => {
  const [inVideoCall, setInVideoCall] = useState(false);
  const [currentAppointment, setCurrentAppointment] = useState(null);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [googleMeetLink, setGoogleMeetLink] = useState('');

  const dispatch = useDispatch();

  const appointmentList = useSelector((state) => state.appointmentList);
  const { loading, error, appointments} = appointmentList;

  const appointmentDetails = useSelector((state) => state.appointmentDetails);
  const { appointment} = appointmentDetails;

  const userDetails = useSelector((state) => state.userDetails);
  const { user } = userDetails;

  useEffect(() => {
    if (user) {
      dispatch(listDoctorAppointments());
      dispatch(listUserAppointments());
  }}, [dispatch, user]);

  const startVideoCall = (appointment) => {
    setCurrentAppointment(appointment);
    setInVideoCall(true);
  };

  const endVideoCall = () => {
    setInVideoCall(false);
    setCurrentAppointment(null);
  };

  const handleJoinGoogleMeet = (meetUrl) => {
    if (meetUrl) {
      window.open(meetUrl, '_blank'); 
    } else {
      alert("No Google Meet link provided.");
    }
  };

  const handleUpdateAppointment = (appointment) => {
    setCurrentAppointment(appointment);
    setGoogleMeetLink(appointment.google_meet_link || '');
    setShowUpdateModal(true);
  };

  const handleSubmitUpdate = () => {
    if (currentAppointment) {
      dispatch(updateAppointment(currentAppointment.id, googleMeetLink));
      setShowUpdateModal(false);
      setGoogleMeetLink('');
    }
  };
  const handlePayButtonClick = (itemId) => {
    history.push(`/appointments/${itemId}`);
  };

 
  return (
    <Container className="appointments-container mt-4">
      {inVideoCall && currentAppointment ? (
        <VideoCallScreen appointment={currentAppointment} onEndCall={endVideoCall} />
      ) : (
        <>
          {loading ? (
            <Spinner animation="border" variant="primary" />
          ) : error ? (
            <Alert variant="danger">{error}</Alert>
          ) : (
            <ListGroup>
              {Array.isArray(appointments) && appointments.length > 0 ? (
                appointments.map((item) => (
                  <ListGroupItem key={item.id} className="mb-3">
                    {/* <h1>ID {item.id}</h1> */}
                    <h6>Client: {item.user_name}</h6>
                    <h6>Doctor: {item.doctor_name}</h6>
                    <p></p>
                    <p>Time: {item.appointment_time}</p>
                    <p>Doctor's Fee: {item.fee} </p>
                    <p >
                      Status:
                      <span className={`ms-2 ${getStatusClass(item.status)}`}>
                        {getStatusIcon(item.status)}
                        {item.status}
                      </span>
                    </p>

                    {item.status === 'Approved' && (
                      <>
                        <Button variant="primary" onClick={() => startVideoCall(item)} style={{ marginRight: '10px' }}>
                          Start Video Call
                        </Button>
                        <Button variant="success" onClick={() => handleJoinGoogleMeet(item.google_meet_link)} style={{ marginRight: '10px' }}>
                          Join Google Meet
                        </Button>
                        {item.status === 'Approved' && user.name === item.doctor_name && (
                        <Button variant="warning" onClick={() => handleUpdateAppointment(item)} >
                          Update Google Meet Link
                        </Button>
                         )}
                      </>
                    )}
                    {item.status === 'Pending' && user.name === item.doctor_name && ( 
                      <>
                        <Button variant="warning" onClick={() => handleUpdateAppointment(item)}>
                          Create Google Meet Link
                        </Button>
                      </>
                    )}
                    {item.status === 'Pending' && user.name === item.user_name && ( 
                      <>
                        <Button
                        variant="warning"
                        onClick={() => handlePayButtonClick(item.id)} 
                      >
                        Pay
                      </Button>
                      </>
                    )}
                  </ListGroupItem>
                ))
              ) : (
                <Alert variant="info">No appointments found.</Alert>
              )}
            </ListGroup>
          )}
        </>
      )}

      {/* Custom Modal for Google Meet Link */}
      <Modal show={showUpdateModal} onHide={() => setShowUpdateModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Create Google Meet Link</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="googleMeetLink">
              <Form.Label>Google Meet Link</Form.Label>
              <Form.Control 
                type="url" 
                placeholder="Enter Google Meet link" 
                value={googleMeetLink}
                onChange={(e) => setGoogleMeetLink(e.target.value)} 
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowUpdateModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSubmitUpdate}>
            Create Link
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

const getStatusClass = (status) => {
  switch (status) {
    case 'Approved':
      return 'text-success';
    case 'Pending':
      return 'text-warning';
    case 'Cancelled':
      return 'text-danger';
    default:
      return '';
  }
};

const getStatusIcon = (status) => {
  switch (status) {
    case 'Approved':
      return <i className="bi bi-check-circle-fill text-success" />;
    case 'Pending':
      return <i className="bi bi-clock-fill text-warning" />;
    case 'Cancelled':
      return <i className="bi bi-x-circle-fill text-danger" />;
    default:
      return <i className="bi bi-question-circle" />;
  }
};

export default AppointmentsScreen;
