import React from 'react';
import { Button } from 'react-bootstrap';

const AppointmentItem = ({ item, user, handleJoinGoogleMeet, startVideoCall, handleUpdatetoConsulted, handleUpdateAppointment, handlePayButtonClick, handleCreateReviewClick }) => {
  return (
    <div className="p-4 border border-gray-300 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200">
      <h6 className="font-semibold text-gray-700">Client: <span className="font-normal">{item.user_name}</span></h6>
      <h6 className="font-semibold text-gray-700">Doctor: <span className="font-normal">{item.doctor_name}</span></h6>
      <p className="text-gray-600">Time: <span className="font-normal">{item.appointment_time}</span></p>
      <p className="text-gray-600">Booking Fee: <span className="font-normal">${item.fee}</span></p>
      <p className="text-gray-600">
        Status:
        <span className={`ms-2 ${getStatusClass(item.status)}`}>
          {getStatusIcon(item.status)}
          {item.status}
        </span>
      </p>
      <div className="mt-3">
        {item.status === 'Consulted' && user.name === item.user_name && item.user_name !== item.doctor_name && (
          <Button className="bg-blue-500 text-white hover:bg-blue-600" onClick={() => handleCreateReviewClick(item)}>
            Review
          </Button>
        )}
        {item.status === 'Approved' && (
          <>
            <Button className="bg-blue-500 text-white hover:bg-blue-600" onClick={() => startVideoCall(item)} style={{ marginRight: '10px' }}>
              Start Video Call
            </Button>
            <Button className="bg-blue-500 text-white hover:bg-blue-600 mt-2" onClick={() => handleJoinGoogleMeet(item.google_meet_link)} style={{ marginRight: '10px' }}>
              Join Google Meet
            </Button>
            {user.name === item.doctor_name && (
              <>
                <Button className="bg-yellow-500 text-white hover:bg-yellow-600 mt-2" onClick={() => handleUpdateAppointment(item)} style={{ marginRight: '10px' }}>
                  Update Google Meet Link
                </Button>
                <Button className="bg-yellow-500 text-white hover:bg-yellow-600 mt-2" onClick={() => handleUpdatetoConsulted(item)}>
                  Mark as Consulted
                </Button>
              </>
            )}
          </>
        )}
        {/* {item.status === 'Pending' && user.name === item.doctor_name && (
          <Button className="bg-yellow-500 text-white hover:bg-yellow-600" onClick={() => handleUpdateAppointment(item)}>
            Create Google Meet Link
          </Button>
        )} */}
        {item.status === 'Pending' && user.name === item.user_name && item.user_name !== item.doctor_name && (
          <Button variant="warning" onClick={() => handlePayButtonClick(item.id)}>
            Pay
          </Button>
        )}
      </div>
    </div>
  );
};

const getStatusClass = (status) => {
  switch (status) {
    case 'Reviewed':
      return 'text-success';
    case 'Consulted':
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
    case 'Consulted':
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

export default AppointmentItem;
