import React, { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { Row, Col, Image, ListGroup, Button, Card } from "react-bootstrap";
import Loader from '../Loader';
import Message from '../Message';
import { useDispatch, useSelector } from "react-redux";
import { getDoctorDetails, getReviews } from "../../actions/doctorActions"; 
import { createAppointment } from "../../actions/createAppointment";
import Rating from "../Rating";

function DoctorScreen({ history }) {
  const { id } = useParams();
  const dispatch = useDispatch();
  
  const doctorDetail = useSelector((state) => state.doctorDetail); 
  const { loading, error, doctor } = doctorDetail;

  const doctorReviews = useSelector((state) => state.doctorReviews);
  const { loading: loadingReviews, error: errorReviews, reviews } = doctorReviews;

  const appointmentCreate = useSelector((state) => state.appointmentCreate);
  const { loading: loadingAppointment, error: errorAppointment } = appointmentCreate;

  useEffect(() => {
    dispatch(getDoctorDetails(id));
    dispatch(getReviews(id));
  }, [dispatch, id]);

  const bookHandler = async () => {
    const appointmentData = {
      doctor: doctor.id, 
      appointment_time: new Date().toISOString()
    };

    console.log("Sending appointment data:", JSON.stringify(appointmentData));

    try {
      await dispatch(createAppointment(appointmentData)); 
      history.push(`/appointments`);
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
          <>
            <Row>
              <Col md={6}>
                {doctor.image ? (
                  <Image
                    src={doctor.image}
                    alt={doctor.name}
                    style={{ width: "650px", height: "400px" }}
                    fluid
                  />
                ) : (
                  <div>No image available</div>
                )}
              </Col>

              <Col md={3}>
                <ListGroup variant="flush">
                  <ListGroup.Item>
                    <h3>Dr. {doctor.user.name}</h3>
                  </ListGroup.Item>
                  <ListGroup.Item>
                    Specialization: {doctor.specialization || "N/A"}
                  </ListGroup.Item>
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
                          <strong className="text-success font-weight-bold">${doctor.fee || "N/A"}</strong>
                        </Col>
                      </Row>
                    </ListGroup.Item>
                    <ListGroup.Item>
                      <Row>
                        <Col>Charge Rate:</Col>
                        <Col>
                          <span className="text-success font-weight-bold">${doctor.charge_rates || "N/A"}/hr</span>
                        </Col>
                      </Row>
                    </ListGroup.Item>
                    <ListGroup.Item>
                      <Row>
                        <Col>Status:</Col>
                        <Col>
                          <span className="text-success font-weight-bold">{doctor.available ? "Available" : "Not Available"}</span>
                        </Col>
                      </Row>
                    </ListGroup.Item>

                    <ListGroup.Item>
                      {loadingAppointment && <Loader />}
                      {errorAppointment && (
                        <Message variant="danger">{errorAppointment}</Message>
                      )}
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

            <Row>
              <Col md={6}>
                <h4 className="mt-3">Reviews</h4>

                {(!reviews || reviews.length === 0) && (
                  <Message variant="info">No Reviews</Message>
                )}

                {loadingReviews ? (
                  <Loader />
                ) : errorReviews ? (
                  <Message variant="danger">{errorReviews}</Message>
                ) : (
                  <ListGroup variant="flush">
                    {reviews.map((review) => (
                     <ListGroup.Item key={review._id}>
                     <strong>{review.user_name}</strong>
                     <Rating value={review.rating} color="f8e825" />
                     <p>{review.createdAt ? review.createdAt.substring(0, 10) : "Date not available"}</p>
                     <p>{review.comment}</p>
                   </ListGroup.Item>
                   
                    ))}
                  </ListGroup>
                )}
              </Col>
            </Row>

          </>
        )
      )}
    </div>
  );
}

export default DoctorScreen;
