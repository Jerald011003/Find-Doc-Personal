import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Row, Col, Image, ListGroup, Button, Card } from "react-bootstrap";
import Loader from '../Loader';
import Message from '../Message';
import { useDispatch, useSelector } from "react-redux";
import { getDoctorDetails } from "../../actions/doctorActions"; 

function DoctorScreen({ match, history }) {
  const [slt, setSlt] = useState(1);
  const dispatch = useDispatch();
  const doctorDetail = useSelector((state) => state.doctorDetail); 
  const { loading, error, doctor } = doctorDetail;

  useEffect(() => {
    dispatch(getDoctorDetails(match.params.id));
  }, [dispatch, match]);

  const bookHandler = () => {
    history.push(`/book/${match.params.id}?slt=${slt}`);
  };

  return (
    <div>
      <Link to="/" className="btn btn-dark my-3">
        Go Back
      </Link>

      {loading ? (
        <Loader />
      ) : error ? (  // Handle case where an error occurred
        <Message variant='danger'>An error occurred. Please try again later.</Message>
      ) : (
        <Row>
          <Col md={6}>
            <Image src={doctor.image} alt={doctor.name} style={{ width: '650px', height: '400px' }} fluid />
          </Col>

          <Col md={3}>
            <ListGroup variant="flush">
              <ListGroup.Item>
                <h3>Dr. {doctor.name}</h3>
              </ListGroup.Item>
              <ListGroup.Item>Specialization: {doctor.specialization || "N/A"}</ListGroup.Item>
              <ListGroup.Item>
                Description: {doctor.description}
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
                      <strong>${doctor.fee}</strong>
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
                  <Button
                    className="btn-block"
                    disabled={!doctor.available}
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
      )}
    </div>
  );
}

export default DoctorScreen;
