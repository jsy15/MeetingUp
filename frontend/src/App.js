import React, { Component } from 'react';
import './App.css';
import AuthService from './components/AuthService';
import withAuth from './components/withAuth';
import ReactDOM from 'react-dom';
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

  renderEvent = ({ event_id, name, description }) => <div key={event_id}>{name} || {description}</div>


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
          <h2>Welcome {this.props.user.username}</h2>
          <button type="button" className="form-submit" onClick={this.handleLogout.bind(this)}>Logout</button>
          <button type="button" onClick={this.testFunc}>Click this to test</button>
          <br></br>
          <textarea className="eventname" rows="10" cols="50" placeholder={event.name} onChange={e => this.setState({ event: { ...event, name: e.target.value}})}></textarea>
          <textarea className="eventdescription" rows="10" cols="50" placeholder={event.description} onChange={e => this.setState({event: { ...event, description: e.target.value}})}></textarea>
          <button onClick={this.addEvents}>Add Event</button>
          <div id="hailmarry2">This will be replaced</div>
          <div>{events.map(this.renderEvent)}</div>
      </div>
    );
  }
}

export default withAuth(App);
