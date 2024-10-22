import React, { useEffect, useRef, useState } from 'react';
import { Container, Button, Row, Col } from 'react-bootstrap';
import io from 'socket.io-client';
import { useDispatch, useSelector } from 'react-redux';

const VideoCallScreen = ({ appointment, onEndCall }) => {
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [room] = useState(`room-${Math.random().toString(36).substr(2, 9)}`);
  
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const socketRef = useRef(null);
  const peerConnectionRef = useRef(null);
  const userDetails = useSelector(state => state.userDetails);
  const { user } = userDetails;
  useEffect(() => {
    // Initialize WebRTC and signaling server
    socketRef.current = io.connect('http://localhost:5000');

    // Join the room
    socketRef.current.emit('join', room);

    const getUserMedia = async () => {
      try {
        const localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = localStream;
        }
        
        // Create peer connection
        peerConnectionRef.current = new RTCPeerConnection();
        localStream.getTracks().forEach(track => {
          peerConnectionRef.current.addTrack(track, localStream);
        });

        // Handle incoming offers
        socketRef.current.on('offer', async (offer) => {
          await peerConnectionRef.current.setRemoteDescription(new RTCSessionDescription(offer));
          const answer = await peerConnectionRef.current.createAnswer();
          await peerConnectionRef.current.setLocalDescription(answer);
          socketRef.current.emit('answer', answer);
        });

        // Handle incoming answers
        socketRef.current.on('answer', (answer) => {
          peerConnectionRef.current.setRemoteDescription(new RTCSessionDescription(answer));
        });

        // Handle incoming ICE candidates
        socketRef.current.on('iceCandidate', (candidate) => {
          peerConnectionRef.current.addIceCandidate(new RTCIceCandidate(candidate));
        });

        // Handle ICE candidates to send to the server
        peerConnectionRef.current.onicecandidate = (event) => {
          if (event.candidate) {
            socketRef.current.emit('iceCandidate', event.candidate);
          }
        };

        // Handle remote tracks
        peerConnectionRef.current.ontrack = (event) => {
          if (remoteVideoRef.current) {
            remoteVideoRef.current.srcObject = event.streams[0];
          }
        };

      } catch (error) {
        console.error("Error accessing media devices.", error);
      }
    };

    getUserMedia();

    return () => {
      // Clean up streams on component unmount
      if (localVideoRef.current && localVideoRef.current.srcObject) {
        const stream = localVideoRef.current.srcObject;
        stream.getTracks().forEach(track => track.stop());
      }
      if (remoteVideoRef.current && remoteVideoRef.current.srcObject) {
        const stream = remoteVideoRef.current.srcObject;
        stream.getTracks().forEach(track => track.stop());
      }
      socketRef.current.disconnect();
    };
  }, [room]);

  const handleToggleMute = () => {
    setIsMuted(!isMuted);
  };

  const handleToggleVideo = () => {
    setIsVideoOn((prev) => {
      const newVideoState = !prev;

      const localStream = localVideoRef.current.srcObject;
      if (localStream) {
        const videoTracks = localStream.getVideoTracks();
        videoTracks.forEach(track => {
          track.enabled = newVideoState;
        });
      }
      return newVideoState;
    });
  };

  const handleEndCall = () => {
    onEndCall(); 
  };

  const handleJoinGoogleMeet = (meetUrl) => {
    if (meetUrl) {
      window.open(meetUrl, '_blank'); 
    } else {
      alert("No Google Meet link provided.");
    }
  };

  return (
    <Container className="video-call-screen d-flex flex-column justify-content-center align-items-center">
      <Row className="mb-4">
        <Col className="text-center">
          {/* <h2>Video Call with Dr. {appointment.doctor_name}</h2> */}
        </Col>
      </Row>
      
      <Row className="video-container mb-4">
        <Col className="text-center">
          <video
            ref={localVideoRef}
            autoPlay
            muted={isMuted}
            className="w-100" 
            style={{ borderRadius: '8px', border: '1px solid #ccc' }} 
          />
    <h5>{user.name === appointment.user_name ? "You" : appointment.user_name}</h5>

        </Col>
        <Col className="text-center">
          <video
            ref={remoteVideoRef}
            autoPlay
            className="w-100" 
            style={{ borderRadius: '8px', border: '1px solid #ccc' }} 
          />
          <h5>Dr. {appointment.doctor_name}'s Video</h5>
        </Col>
      </Row>
      
      <Row className="controls d-flex justify-content-center mb-4">
      <Col xs="auto">
        <Button
            variant={isMuted ? 'danger' : 'success'} // Use 'success' for the green shade when not muted
            onClick={handleToggleMute}
            style={{
            backgroundColor: isMuted ? '#dc3545' : '#28a745', // Red for muted, green for unmuted
            color: 'white', // Keep the text/icon color white for visibility
            }}
        >
            {isMuted ? (
            <i className="bi bi-mic-mute-fill"></i>
            ) : (
            <i className="bi bi-mic-fill"></i>
            )}
        </Button>
        </Col>
        <Col xs="auto">
        <Button
            variant={isVideoOn ? 'success' : 'danger'} // Use 'success' for green when video is on, 'danger' for red when off
            onClick={handleToggleVideo}
            style={{
            backgroundColor: isVideoOn ? '#28a745' : '#dc3545', // Green for video on, red for video off
            color: 'white', // Keep the text/icon color white for visibility
            }}
        >
            {isVideoOn ? (
            <i className="bi bi-camera-video-fill"></i>
            ) : (
            <i className="bi bi-camera-video-off-fill" style={{ color: 'white' }}></i>
            )}
        </Button>
        </Col>

        <Col xs="auto">
          <Button variant="danger" onClick={handleEndCall}>
            End Call
          </Button>
        </Col>
        <Col xs="auto">
          <Button variant="primary" onClick={() => handleJoinGoogleMeet(appointment.google_meet_link)}>
            Join Google Meet
          </Button>
        </Col>
      </Row>
    </Container>
  );
};

export default VideoCallScreen;
