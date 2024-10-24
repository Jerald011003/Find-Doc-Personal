import React from "react";
import { Card, Button, Col, Badge } from "react-bootstrap";
import { Link } from "react-router-dom";

function Doctor({ doctor }) {
  return (
    <Card className="my-3 p-3 rounded shadow-sm" style={{ width: '18rem' }}>
      <Link to={`/doctor/${doctor.user._id}`}>
        <Card.Img 
          variant="top" 
          src={doctor.image} 
          style={{ width: '100%', height: '150px', objectFit: 'cover' }} 
        />
      </Link>

      <Card.Body>
        <Card.Title as="div" className="text-truncate">
          <h5 className="font-weight-bold ">Dr. {doctor.user.name}</h5>
        </Card.Title>

        <Card.Text className="text-muted">
          <small>{doctor.specialization || "General Practitioner"}</small>
        </Card.Text>

        <div className="d-flex justify-content-between align-items-center">
          <div className="d-flex align-items-center">
            <span className="text-warning">&#9733;</span> 
            <span className="ml-1">{doctor.rating} ({doctor.numReviews} Reviews)</span>
          </div>

          <span className="text-success font-weight-bold">${doctor.charge_rates}/hr</span>
        </div>

        <Button 
          variant="outline-primary" 
          className="mt-3 w-100"
          as={Link} 
          to={`/doctor/${doctor.user._id}`}>
          View Profile
        </Button>
      </Card.Body>
    </Card>
  );
}

export default Doctor;
