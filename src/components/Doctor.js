import React from "react";
import { Card, Button, Col, Badge } from "react-bootstrap";
import { Link } from "react-router-dom";

function Doctor({ doctor }) {
  return (
    <Card className="my-1 p-2 rounded shadow-sm" style={{ width: '18rem' }}>
      <Link to={`/doctor/${doctor.user._id}`}>
        <Card.Img 
          variant="top" 
          src={doctor.image} 
          style={{ width: '100%', height: '150px', objectFit: 'cover' }} 
        />
      </Link>

      <Card.Body>
      <Card.Text as="div" className="text-truncate text-left" style={{ textAlign: 'left' }}>
      <h6 className="font-weight-bold">Dr. {doctor.user.name}</h6>
      </Card.Text>

      <Card.Text className="text-muted text-left" style={{ textAlign: 'left' }}>
          <small>{doctor.description}</small>
      </Card.Text>


        <div className="d-flex justify-content-between align-items-center">
          <div className="d-flex align-items-center">
            <span className="text-warning">&#9733;</span> 
            <span className="ml-1">{doctor.rating} ({doctor.numReviews})</span>
          </div>
          <span className="font-weight-bold">${doctor.charge_rates}/hr</span>
        </div>

      </Card.Body>
    </Card>
  );
}

export default Doctor;
