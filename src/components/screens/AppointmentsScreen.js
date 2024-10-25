import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateAppointmentStatus, reviewAppointment, getAppointmentDetails, listDoctorAppointments, listUserAppointments, updateAppointment } from '../../actions/createAppointment';
import { Container, ListGroup, ListGroupItem, Spinner, Alert, Button, Modal, Form } from 'react-bootstrap';
import VideoCallScreen from './VideoCallScreen';
import { useParams, useHistory } from 'react-router-dom';
import { createDoctorReview } from '../../actions/doctorActions';
import { Link } from "react-router-dom";
import CalendarScreen from '../CalendarScreen';
import AppointmentItem from './AppointmentItem';
const AppointmentsScreen = ({history}) => {
  const [inVideoCall, setInVideoCall] = useState(false);
  const [currentAppointment, setCurrentAppointment] = useState(null);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [googleMeetLink, setGoogleMeetLink] = useState('');
  const dispatch = useDispatch();

  const appointmentList = useSelector((state) => state.appointmentList);
  const { loading, error, appointments} = appointmentList;

  const appointmentDetails = useSelector((state) => state.appointmentDetails);
  const { appointment } = appointmentDetails;

  const userDetails = useSelector((state) => state.userDetails);
  const { user } = userDetails;

  const [showReviewModal, setShowReviewModal] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');

  const [showReviewed, setShowReviewed] = useState(false);
  const toggleReviewed = () => setShowReviewed(!showReviewed);

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

  const handleUpdatetoConsulted = (item) => {
    const statusData = {
      status: 'Consulted',
    };
  
    if (item) {
      dispatch(updateAppointmentStatus(item.id, statusData.status));
    }
  };
  
  const handleSubmitUpdate = () => {
    if (currentAppointment) {
      dispatch(updateAppointment(currentAppointment.id, googleMeetLink));
      setShowUpdateModal(false);
      setGoogleMeetLink('');
      console.log(currentAppointment)
    }
  };
  const handlePayButtonClick = (itemId) => {
    history.push(`/appointments/${itemId}`);
    console.log(itemId);
  
  };
  // const handleCreateReview = (item) => {
  //   console.log(item.doctorId)
  //   const reviewData = {
  //     rating,
  //     comment,
  //   };
  //   dispatch(createDoctorReview(item.doctorId, reviewData))
  // }

  const handleCreateReviewClick = (item) => {
    setCurrentAppointment(item);
    setShowReviewModal(true);
  };

  const handleCreateReview = () => {
    if (currentAppointment) {
      const reviewData = {
        rating,
        comment,
      };

      dispatch(createDoctorReview(currentAppointment.doctorId, reviewData))
        .then(() => {
          dispatch(reviewAppointment(currentAppointment.id, { isReviewed: true, status: 'Reviewed' }));
          setShowReviewModal(false);
        })
        .catch((error) => {
          console.error("Error creating review:", error);
        });
    }
  };

  return (
    <Container className="appointments-container ">
            <div>
    <Link to="/" className="my-3">
    <i className="fas fa-home p-3 text-gray-500 -mb-3 transition-colors duration-300 hover:text-[#0cc0df]"></i>
    </Link>    
    <span className="mr-3">/</span>
    <Link to={`/`} className="mr-3 my-3 font-semibold text-gray-500 truncate transition-colors duration-300 hover:text-[#0cc0df] no-underline">
        Doctor
    </Link>
    <span className="mr-3">/</span>
    <Link to={`/appointments`} className="my-3 font-semibold text-gray-500 truncate transition-colors duration-300 hover:text-[#0cc0df] no-underline">
        Appointments
    </Link>
    </div>
      {inVideoCall && currentAppointment ? (
        <VideoCallScreen appointment={currentAppointment} onEndCall={endVideoCall} />
      ) : (
        <>
          {loading ? (
            <Spinner animation="border" variant="primary" />
          ) : error ? (
            <Alert variant="danger">{error}</Alert>
          ) : (
            // Starts Here
            <div className="container mx-auto mt-6 p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {/* Calendar Section */}
                <div className="bg-white rounded-lg p-3">
                  <CalendarScreen />
                </div>

                {/* Appointments List Section */}
                <div className="bg-white shadow-lg rounded-lg p-6">
                  <h6 className="text-lg font-semibold text-gray-800 mb-4">Your Appointments</h6>

                  {/* All Appointments */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-3">

                    {Array.isArray(appointments) &&
                      appointments
                        .filter(item => item.status !== 'Reviewed')
                        .map(item => (
                          <AppointmentItem 
                            key={item.id} 
                            item={item} 
                            user={user} 
                            handleUpdateAppointment={handleUpdateAppointment} 
                            handlePayButtonClick={handlePayButtonClick} 
                            handleCreateReviewClick={handleCreateReviewClick} 
                            handleJoinGoogleMeet={handleJoinGoogleMeet}
                            handleUpdatetoConsulted={handleUpdatetoConsulted}
                            startVideoCall={startVideoCall}
                          />
                        ))}

                  </div>

                  {/* Collapsible Reviewed Appointments */}
                  <div className="mb-4">
                    <Button className="w-full text-left" variant="dark" onClick={toggleReviewed}>
                      {showReviewed ? 'Hide Reviewed Appointments' : 'Show Reviewed Appointments'}
                    </Button>
                    {showReviewed && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
                        {appointments
                          .filter(item => item.status === 'Reviewed')
                          .map(item => (
                            <AppointmentItem 
                              key={item.id} 
                              item={item} 
                              user={user} 
                              handleCreateReviewClick={handleCreateReviewClick} 
                            />
                          ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {/* Modal for Google Meet Link */}
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

      {/* Review Modal */}
      <Modal show={showReviewModal} onHide={() => setShowReviewModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Leave a Review</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="rating">
              <Form.Label>Rating</Form.Label>
              <Form.Control
                as="select"
                value={rating}
                onChange={(e) => setRating(e.target.value)}
              >
                <option value="0">Select...</option>
                <option value="1">1 - Poor</option>
                <option value="2">2 - Fair</option>
                <option value="3">3 - Good</option>
                <option value="4">4 - Very Good</option>
                <option value="5">5 - Excellent</option>
              </Form.Control>
            </Form.Group>
            <Form.Group controlId="comment">
              <Form.Label>Comment</Form.Label>
              <Form.Control
                as="textarea"
                rows="3"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              ></Form.Control>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowReviewModal(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={handleCreateReview}>
            Submit Review
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

const getStatusClass = (status) => {
  switch (status) {
    case 'Reviewed':
      return 'text-success';
    case 'Consulted':
      return 'text-success';
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
    case 'Reviewed':
      return <i className="bi bi-check-circle-fill text-success" />;
    case 'Consulted':
      return <i className="bi bi-check-circle-fill text-success" />;
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
