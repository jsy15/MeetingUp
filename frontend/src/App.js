import React, { Component } from 'react';
import './App.css';
import AuthService from './components/AuthService';
import withAuth from './components/withAuth';
import ReactDOM from 'react-dom';
import Table from 'react-bootstrap/Table';
import Navbar from 'react-bootstrap/Navbar';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Tooltip from 'react-bootstrap/Tooltip';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
const Auth = new AuthService();

var texthold = "Ha Ha Ha Ha I got it baby";
var texthold2 = "";

class App extends Component {

  constructor(props, context) {
    super(props, context);

    this.handleShow = this.handleShow.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.showEvent = this.showEvent.bind(this);
    this.checkPrivate = this.checkPrivate.bind(this);

    this.state = {
      changed: false,
      eventnametexthere: "",
      eventdesctexthere: "",
      show: false,
      events: [],
      event: {
        name: '',
        description: '',
      },
      is_private_state: false,
    };
  }

  componentDidMount() {
    this.getEvents();
  }
    
  showEvent(param, e) {
    this.props.history.push(`/event/${param}`);    
  }

  getEvents = _ => {
    Auth.fetch1('http://localhost:8080/events')
      .then(response => response.json())
      .then(response => this.setState({ events: response.data }))
      .catch(err => console.error(err))
  }

  addEvents = _ => {
    var { event, is_private_state } = this.state;
    if(is_private_state == false)
      var is_private = 0;
    else
      var is_private = 1;

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
    Auth.fetch1(`http://localhost:8080/events/add?name=${event.name}&description=${event.description}&private=${is_private}&creator_id=${this.props.user.id}`)
      .then(this.getEvents)
      .catch(err => console.error(err))
    this.handleClose();
    this.setState({ event: { ...event, name: "", description: ""}});
    this.setState({ is_private_state: false});
  }

  verifyUser = _ => {
    
  }

  renderEvent = ({ event_id, name, description, isprivate, creator_id }) => {
    if(this.props.user.id == creator_id && isprivate == 1)
      return <tr onClick={this.showEvent.bind(this, event_id)}> <th key={event_id}>{name} </th><th> {description}</th> </tr>
    else if(isprivate == null || isprivate == 0)
      return <tr onClick={this.showEvent.bind(this, event_id)}> <th key={event_id}>{name} </th><th> {description}</th> </tr>
}


getTest = _ => {
  //var messagetest = "";
  console.log('tripped');
  Auth.fetch1('http://localhost:8080/testroute')
  .then(response => {
    console.log(response["test1"]);
    var messagetest = response["test1"];
    console.log("fucking work: ", messagetest);
    this.setState({test1: response});
    const element = (
      <div>
        {messagetest}
      </div>
    );
    ReactDOM.render(element, document.getElementById('hailmarry'));
  })
  //.then(reponse => console.log(messagetest.test1))
  //.then(response => this.setState({ test1: `${response.test1 }`))
  .catch(err => console.error(err))
}

renderTest = () => <div>{test.string}</div>

  handleLogout(){
    Auth.logout()
    this.props.history.replace('/login');
  }

testFunc(){
  texthold2 = document.getElementById('hailmarry2').textContent;
  const element = (
    <div id="hailmarry2">{texthold}</div>
  );
  texthold = texthold2;
  ReactDOM.render(element, document.getElementById('hailmarry2'));
}

handleClose() {
  this.setState({ show: false });
}

handleShow() {
  this.setState({ show: true });
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

checkPrivate(){
  console.log(this.state.is_private_state);
}


  render() {
    const { events, event} = this.state;

    return (
      <div className="App">
        <Navbar bg="light" expand="lg" className="navbarcust">
          <Navbar.Brand>MeetUp</Navbar.Brand>
          <Navbar.Collapse className="justify-content-end">
            <Navbar.Text className="justify-content-end">
                Signed in as: {this.props.user.username}
            </Navbar.Text>
          </Navbar.Collapse>
          <div className="pl-4">
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


          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Event Name</th>
                <th>Event Description</th>
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
