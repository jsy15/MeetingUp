import React, { Component } from 'react';
import './App.css';
import AuthService from './components/AuthService';
import withAuth from './components/withAuth';
import ReactDOM from 'react-dom';
import Table from 'react-bootstrap/Table';
import Navbar from 'react-bootstrap/Navbar';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
const Auth = new AuthService();

var texthold = "Ha Ha Ha Ha I got it baby";
var texthold2 = "";

class App extends Component {
  state = {
    events: [],
    event: {
      name: 'Put your event name here',
      description: 'Put some information about your event here',
    }
  }

  componentDidMount() {
    this.getEvents();
  }
    
  getEvents = _ => {
    Auth.fetch1('http://localhost:8080/events')
      .then(response => response.json())
      .then(response => this.setState({ events: response.data }))
      .catch(err => console.error(err))
  }

  addEvents = _ => {
    const { event } = this.state;
    Auth.fetch1(`http://localhost:8080/events/add?name=${event.name}&description=${event.description}&creator_id=${this.props.user.id}`)
      .then(this.getEvents)
      .catch(err => console.error(err))
  }

  verifyUser = _ => {
    
  }

  renderEvent = ({ event_id, name, description }) => <tr> <th key={event_id}>{name} </th><th> {description}</th> </tr>


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

  render() {
    const { events, event} = this.state;

    return (
      <div className="App">
        <Navbar bg="light" expand="lg">
          <Navbar.Brand>MeetUp</Navbar.Brand>
          <Navbar.Collapse className="justify-content-end">
            <Navbar.Text className="justify-content-end">
                Signed in as: {this.props.user.username}
            </Navbar.Text>
          </Navbar.Collapse>
          <div className="pl-4">
            <Button variant="outline-primary" onClick={this.handleLogout.bind(this)}>Logout</Button>
          </div>
        </Navbar>
          <button type="button" className="form-submit" onClick={this.handleLogout.bind(this)}>Logout</button>
          <button type="button" onClick={this.testFunc}>Click this to test</button>
          <br></br>
          <textarea className="eventname" rows="10" cols="50" placeholder={event.name} onChange={e => this.setState({ event: { ...event, name: e.target.value}})}></textarea>
          <textarea className="eventdescription" rows="10" cols="50" placeholder={event.description} onChange={e => this.setState({event: { ...event, description: e.target.value}})}></textarea>
          <button onClick={this.addEvents}>Add Event</button>
          <div id="hailmarry2">This will be replaced</div>
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
