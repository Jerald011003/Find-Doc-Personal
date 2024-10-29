import React from "react";
import { Container, Row, Col } from "react-bootstrap";

function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-6">
      <Container>
        <Row className="justify-content-center text-center">
          <Col xs={12} className="p-4 flex items-center justify-center space-x-2">
            <p className="text-gray-400">
              Powered by
            </p>
            <a href="https://github.com/Jerald011003" target="_blank" rel="noopener noreferrer">
              <img
                src="/images/Nexure_Logo.png"
                alt="Nexure Logo"
                className="w-10 h-10 mb-2 transform transition duration-300 ease-in-out hover:scale-110 hover:opacity-80"
              />
            </a>
          </Col>
        </Row>
      </Container>
    </footer>
  );
}

export default Footer;
