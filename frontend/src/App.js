import React, { Component } from 'react';
import './App.css';
import AuthService from './components/AuthService';
import withAuth from './components/withAuth';
import Table from 'react-bootstrap/Table';
import Navbar from 'react-bootstrap/Navbar';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import bellicon from './images/bell-alarm-symbol.svg';
const Auth = new AuthService();

class App extends Component {

  constructor(props, context) {
    super(props, context);

    this.handleShow = this.handleShow.bind(this);
    this.handleShow2 = this.handleShow2.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleClose2 = this.handleClose2.bind(this);
    this.showEvent = this.showEvent.bind(this);
    this.getEvents = this.getEvents.bind(this);
    this.showAdmin = this.showAdmin.bind(this);

    this.state = {
      changed: false,
      eventnametexthere: "",
      eventdesctexthere: "",
      show: false,
      show2: false,
      events: [],
      invites: [],
      attending: [],
      event: {
        name: '',
        description: '',
        address: '',
      },
      is_private_state: false,
      my_events: false,
    };
  }

  componentDidMount() {
    if(this.state.my_events === false)
      this.getEvents();
    this.getInvites();
    console.log("Priv from App.js: " + this.props.user.priv);
  }

  //Change the page
    
  showEvent(param, e) {
    this.props.history.push(`/event/${param}`);    
  }

  showAdmin() {
    this.props.history.push(`/admin`);
  }

  showProfile(){
    this.props.history.push(`/profile`);
  }

  //Handle the logout
  handleLogout(){
    Auth.logout()
    this.props.history.replace('/login');
  }

  //Fetch from database

  getEvents = _ => {
    Auth.fetch1('http://localhost:8080/events')
      .then(response => response.json())
      .then(response => this.setState({ events: response.data }))
      .catch(err => console.error(err))

    Auth.fetch1(`http://localhost:8080/attending?user_id=${this.props.user.id}`)
      .then(response => response.json())
      .then(response => this.setState({ attending: response.data }))
      .catch(err => console.log(err))
  }

  getUserEvents() {
    this.setState({ my_events: true});
    Auth.fetch1(`http://localhost:8080/myevents?user_id=${this.props.user.id}`)
    .then(response => response.json())
    .then(response => this.setState({events: response.data}))
  }

  getInvites () {
    Auth.fetch1(`http://localhost:8080/invite/show?user_id=${this.props.user.id}`)
    .then(response => response.json())
    .then(response => {
        this.setState({ invites: response.data}, () => {
          console.log(this.state.invites);
        });
    })
  }


  //Push to database

  addEvents = _ => {
    var { event, is_private_state } = this.state;
    var is_private = -1;
    if(is_private_state === false)
      is_private = 0;
    else
      is_private = 1;

    // eslint-disable-next-line
    if(event.name == ""){
      this.handleClose();
      this.setState({ event: { ...event, name: "", description: ""}});
      alert("Unable to create event without name");
      return;
    }
    // eslint-disable-next-line
    if(event.description == ""){
      event.description = "no description given";
    }
    Auth.fetch1(`http://localhost:8080/events/add?name=${event.name}&description=${event.description}&private=${is_private}&creator_id=${this.props.user.id}&address=${event.address}`)
      .then(this.getEvents)
      .catch(err => console.error(err))
    this.handleClose();
    this.setState({ event: { ...event, name: "", description: ""}});
    this.setState({ is_private_state: false});
  }

  acceptInvite(param1, param2, param3, e){
    console.log(param1);
    console.log(param2);
    console.log(param3);
    Auth.fetch1(`http://localhost:8080/invite/accept?invite_id=${param1}&event_id=${param2}&user_id=${param3}`)
    .then(response => response.text())
    .then(response => alert(response))
    this.getInvites();
    this.getInvites();
    this.getInvites();
    this.handleClose2();
  }
  
  denyInvite(param1, param2, param3, e){
    console.log(param1);
    console.log(param2);
    console.log(param3);
    Auth.fetch1(`http://localhost:8080/invite/deny?invite_id=${param1}`)
    .then(response => response.text())
    .then(response => alert(response))
    this.getInvites();
    this.getInvites();
    this.getInvites();
    this.handleClose2();
  }  

  //Render functions

  renderEvent = ({ event_id, name, description, isprivate, creator_id }) => {
    var isattending = false;
    for(var i = 0; i < this.state.attending.length; i++){
      if(this.state.attending[i].event_id === event_id){
        isattending = true;
      }
    }
    
    if(this.props.user.id === creator_id && isprivate === 1)
      return <tr onClick={this.showEvent.bind(this, event_id)}><th key={event_id}>{name}</th><th>{description}</th><th>Owner</th></tr>
    else if(this.props.user.id === creator_id && isprivate === 0)
      return <tr onClick={this.showEvent.bind(this, event_id)}><th key={event_id}>{name}</th><th>{description}</th><th>Owner</th></tr>
    else if(this.props.user.id !== creator_id && isprivate === 1 && isattending === true)
      return <tr onClick={this.showEvent.bind(this, event_id)}><th key={event_id}>{name}</th><th>{description}</th><th>Attending</th></tr>
    else if(isprivate === null || isprivate === 0)
      return <tr onClick={this.showEvent.bind(this, event_id)}><th key={event_id}>{name}</th><th>{description}</th><th>Not Attending</th></tr>
  }

  renderInvites = ({username, name, invite_id, event_id, invited_user_id}) => {
    return <tr><td key={invite_id}>You were invited by: {username} to the event: {name}</td><td className="invitebuttonaccept" onClick={this.acceptInvite.bind(this, invite_id, event_id, invited_user_id)}>Accept</td><td className="invitebuttondeny" onClick={this.denyInvite.bind(this, invite_id, event_id, invited_user_id)}>Deny</td></tr>
  }

  adminPage(){
    if(this.props.user.priv === 2){
      return <Button className="adminpage" variant="outline-danger" onClick={this.showAdmin}>Admin</Button>
    }
  }

  //Modal functions

  handleClose() {
    this.setState({ show: false });
  }

  handleShow() {
    this.setState({ show: true });
  }

  handleClose2() {
    this.getInvites();
    this.setState({ show2: false});
  }

  handleShow2() {
    this.setState({ show2: true });
  }
  

  renderTooltip = props => (
    <div
      {...props}
      style={{
        backgroundColor: 'rgba(0, 0, 0, 0.85)',
        padding: '2px 10px',
        color: 'white',
        zIndex: 50000,
        borderRadius: 3,
        ...props.style,
      }}
    >
      Click this if the event should be private.
    </div>
  );

  render() {
    const { events, event, invites} = this.state;

    return (
      <div className="App">
      
        <Navbar bg="light" expand="lg" className="navbarcust">
          <Navbar.Brand>MeetingUp</Navbar.Brand>
          <Navbar.Collapse className="justify-content-end">
            <Navbar.Text className="justify-content-end">
              <img src={bellicon} className="notificationicon" alt="logo" onClick={this.handleShow2}></img>
                <span className="profilebutton" onClick={() => this.showProfile()}>Signed in as: {this.props.user.username}</span>
            </Navbar.Text>
          </Navbar.Collapse>
          <div className="pl-4">
            {this.adminPage()}  
            <Button className="logout" variant="outline-dark" onClick={this.handleLogout.bind(this)}>Logout</Button>
          </div>
        </Navbar>

          <Modal show={this.state.show} onHide={this.handleClose}>
            <Modal.Header closeButton>
              <Modal.Title>Creating an event:</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <textarea className="eventname" id="eventNameText" rows="2" cols="50" placeholder="Put Event Name Here" onChange={e => this.setState({ event: { ...event, name: e.target.value}})}></textarea>
              <textarea className="eventdescription" id="eventDescText" rows="10" cols="50" placeholder="Put Event Description Here" onChange={e => this.setState({event: { ...event, description: e.target.value}})}></textarea>
              <input className="eventname" id="eventAddrText" placeholder="Put Address Here" onChange={e => this.setState({event: {...event, address: e.target.value}})}></input>
              <OverlayTrigger
                placement="bottom-right"
                delay={{ show: 0, hide: 0 }}
                overlay={this.renderTooltip}
              >
                <div className="privatetooltip"><input type="checkbox" className="eventprivate" id="eventPrivateCheck" onClick={e => this.setState({is_private_state: e.target.checked})}></input> Private? </div>
              </OverlayTrigger>

            </Modal.Body>
            <Modal.Footer>
              <Button variant="primary" onClick={this.addEvents}>
                Create Event
              </Button>
            </Modal.Footer>
          </Modal>

          <br/>
          <Button variant="primary" onClick={this.handleShow}>
            Create Event
          </Button>

          <Button variant="info" onClick={() => this.getUserEvents()}>
            My Events
          </Button>
          <Button variant="success" onClick={() => this.getEvents()}>
            Get All Events
          </Button>
          
          <Modal show={this.state.show2} onHide={this.handleClose2}>
            <Modal.Body className="modal-body-invite">
              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th colSpan="3">
                      Invites
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {invites.map(this.renderInvites)}
                </tbody>
              </Table>
            </Modal.Body>
            <Modal.Footer className="modal-footer-invite">
              <Button variant="success" onClick={this.handleClose2}>Close Invites</Button>
            </Modal.Footer>
          </Modal>
          

          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Event Name</th>
                <th>Event Description</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {events.map(this.renderEvent)}
            </tbody>
          </Table>
      </div>
    );
  }
}

export default withAuth(App);
