import React, { Component } from 'react';
import logo from './logo.svg';
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
    Auth.fetch1(`http://localhost:4000/events/add?name=${event.name}&description=${event.description}&creator_id=1`)
      .then(this.getEvents)
      .catch(err => console.error(err))
  }

  verifyUser = _ => {
    
  }

  renderEvent = ({ event_id, name, description }) => <div key={event_id}>{name} || {description}</div>


getTest = _ => {
  //var messagetest = "";
  console.log('tripped');
  Auth.fetch('http://localhost:8080/testroute')
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
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>Welcome {this.props.user.username}</h2>
        </div>
        <p className="App-intro">
          <button type="button" className="form-submit" onClick={this.handleLogout.bind(this)}>Logout</button>
          <button type="button" onClick={this.testFunc}>Click this to test</button>
          <div id="hailmarry2">This will be replaced</div>
          <div>{events.map(this.renderEvent)}</div>

        </p>
      </div>
    );
  }
}

export default withAuth(App);
