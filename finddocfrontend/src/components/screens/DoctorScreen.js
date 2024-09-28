import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Row, Col, Image, ListGroup, Button, Card } from "react-bootstrap";
import Loader from '../Loader';
import Message from '../Message';
import { useDispatch, useSelector } from "react-redux";
import { getDoctorDetails } from "../../actions/doctorActions"; 
import { createAppointment } from "../../actions/createAppointment";

function DoctorScreen({ match, history }) {
  const [slt, setSlt] = useState(1);
  const dispatch = useDispatch();
  const doctorDetail = useSelector((state) => state.doctorDetail); 
  const { loading, error, doctor } = doctorDetail;

  const appointmentCreate = useSelector((state) => state.appointmentCreate);
  const { loading: loadingAppointment, error: errorAppointment } = appointmentCreate;

  useEffect(() => {
    dispatch(getDoctorDetails(match.params.id));
  }, [dispatch, match]);

  const bookHandler = async () => {
    try {
        console.log("Creating appointment for doctor ID:", match.params.id);  // Log the ID
        await dispatch(createAppointment({ 
            doctorId: match.params.id, 
            appointmentTime: new Date() 
        }));
        history.push(`/confirmation`); 
    } catch (error) {
        console.error("Failed to create appointment", error);
    }
};


  return (
    <div>
      <Link to="/" className="btn btn-dark my-3">
        Go Back
      </Link>

      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant='danger'>An error occurred. Please try again later.</Message>
      ) : (
        doctor && (
          <Row>
            <Col md={6}>
              {doctor.image ? (
                <Image src={doctor.image} alt={doctor.name} style={{ width: '650px', height: '400px' }} fluid />
              ) : (
                <div>No image available</div>
              )}
            </Col>

            <Col md={3}>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <h3>Dr. {doctor.name}</h3>
                </ListGroup.Item>
                <ListGroup.Item>Specialization: {doctor.specialization || "N/A"}</ListGroup.Item>
                <ListGroup.Item>
                  Description: {doctor.description || "No description available."}
                </ListGroup.Item>
              </ListGroup>
            </Col>
            
            <Col md={3}>
              <Card>
                <ListGroup variant="flush">
                  <ListGroup.Item>
                    <Row>
                      <Col>Booking Fee:</Col>
                      <Col>
                        <strong>${doctor.fee || 'N/A'}</strong>
                      </Col>
                    </Row>
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <Row>
                      <Col>Status:</Col>
                      <Col>
                        {doctor.available ? "Available" : "Not Available"}
                      </Col>
                    </Row>
                  </ListGroup.Item>

                  <ListGroup.Item>
                    {loadingAppointment && <Loader />}  {/* Show loader for appointment creation */}
                    {errorAppointment && <Message variant='danger'>{errorAppointment}</Message>} {/* Show error for appointment creation */}
                    <Button
                      className="btn-block"
                      disabled={!doctor.available || loadingAppointment}
                      type="button"
                      onClick={bookHandler}
                    >
                      Consult
                    </Button>
                  </ListGroup.Item>
                </ListGroup>
              </Card>
            </Col>
          </Row>
        )
      )}
    </div>
  );
}

export default DoctorScreen;
