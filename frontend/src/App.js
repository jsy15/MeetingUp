import React, { Component } from 'react';
import './App.css';
import AuthService from './components/AuthService';
import withAuth from './components/withAuth';
import ReactDOM from 'react-dom';
import Table from 'react-bootstrap/Table';
import Navbar from 'react-bootstrap/Navbar';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import bellicon from './images/bell-alarm-symbol.svg';
const Auth = new AuthService();

var texthold = "Ha Ha Ha Ha I got it baby";
var texthold2 = "";

class App extends Component {

  constructor(props, context) {
    super(props, context);

    this.handleShow = this.handleShow.bind(this);
    this.handleShow2 = this.handleShow2.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleClose2 = this.handleClose2.bind(this);
    this.showEvent = this.showEvent.bind(this);
    this.checkPrivate = this.checkPrivate.bind(this);
    this.getEvents = this.getEvents.bind(this);

    this.state = {
      changed: false,
      eventnametexthere: "",
      eventdesctexthere: "",
      show: false,
      show2: false,
      events: [],
      invites: [],
      event: {
        name: '',
        description: '',
      },
      is_private_state: false,
    };
  }

  componentDidMount() {
    this.getEvents();
    this.getInvites();
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
    Auth.fetch1(`http://localhost:8080/events/add?name=${event.name}&description=${event.description}&private=${is_private}&creator_id=${this.props.user.id}`)
      .then(this.getEvents)
      .catch(err => console.error(err))
    this.handleClose();
    this.setState({ event: { ...event, name: "", description: ""}});
    this.setState({ is_private_state: false});
  }

  verifyUser = _ => {
    
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

  renderEvent = ({ event_id, name, description, isprivate, creator_id }) => {
    if(this.props.user.id === creator_id && isprivate === 1)
      return <tr onClick={this.showEvent.bind(this, event_id)}><th key={event_id}>{name}</th><th>{description}</th></tr>
    else if(isprivate === null || isprivate === 0)
      return <tr onClick={this.showEvent.bind(this, event_id)}><th key={event_id}>{name}</th><th>{description}</th></tr>
}

renderInvites = ({username, name, invite_id, event_id, invited_user_id}) => {
  this.getInvites();
  return <tr onClick={this.acceptInvite.bind(this, invite_id, event_id, invited_user_id)}><th key={invite_id}>You were invited by: {username} to the event: {name}</th></tr>
}

acceptInvite(param1, param2, param3, e){
  Auth.fetch1(`http://localhost:8080/invite/accept?invite_id=${param1}&event_id=${param2}&user_id=${param3}`)
  .then(response => response.text())
  .then(response => alert(response))
  .then(this.getInvites())
  .then(this.handleClose2())
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

handleClose2() {
  this.setState({ show2: false });
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

checkPrivate(){
  console.log(this.state.is_private_state);
}




  render() {
    const { events, event, invites} = this.state;

    return (
      <div className="App">
      
        <Navbar bg="light" expand="lg" className="navbarcust">
          <Navbar.Brand>MeetUp</Navbar.Brand>
          <Navbar.Collapse className="justify-content-end">
            <Navbar.Text className="justify-content-end">
              <img src={bellicon} className="notificationicon" alt="logo" onClick={this.handleShow2}></img>
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

          <Modal show={this.state.show2} onHide={this.handleClose2}>
            <Modal.Body className="modal-body-invite">
              <Table striped borderd hover>
                <thead>
                  <tr>
                    <th>
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
              </tr>
            </thead>
            <tbody>
              {events.map(this.renderEvent)}
            </tbody>
          </Table>
          <div>Icons made by <a href="https://www.flaticon.com/authors/rami-mcmin" title="Rami McMin">Rami McMin</a> from <a href="https://www.flaticon.com/" 			    title="Flaticon">www.flaticon.com</a> is licensed by <a href="http://creativecommons.org/licenses/by/3.0/" 			    title="Creative Commons BY 3.0">CC 3.0 BY</a></div>
      </div>
    );
  }
}

export default withAuth(App);
