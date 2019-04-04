import React, { Component } from 'react';
import '../App.css';
import withAuth from './withAuth';
import AuthService from './AuthService';
import Navbar from 'react-bootstrap/Navbar';
import Button from 'react-bootstrap/Button';
const Auth = new AuthService();

class Event extends Component {

    constructor(props, context) {
        super(props, context);
        this.getEvents = this.getEvents.bind(this);
        this.goHome = this.goHome.bind(this);
    
        this.state = {
          event_id: 0,
          event_name: "",
          event_description: "",
          eventcreator: [],
          event_attendees: [],
          creator_id: 0,
          creator_name: "",
          numattending: 0,
        };
      }

    componentDidMount () {
        console.log(this.props);
        const { eventID } = this.props.params;
        this.setState({eventid: eventID});
        this.getEvents();
    }

    handleLogout(){
        Auth.logout()
        this.props.history.replace('/login');
      }

      testEvent(){
          console.log(this.state.creator_id);
      }

    getEvents() {
        var event_id = this.props.params.eventID;
        console.log(event_id + "<-event"); 
        Auth.fetch1(`http://localhost:8080/event/id?event_id=${event_id}`)
        .then(response => response.json())
        .then(response => {
            const new_creator = response.data[0].creator_id;
            this.setState({ creator_id: new_creator, event_id: response.data[0].event_id, event_name: response.data[0].name, event_description: response.data[0].description }, () => {
                this.getCreator();
                this.getAttending();
            });
        })
        .catch(err => console.error(err))
        

    }

    getCreator() {
        Auth.fetch1(`http://localhost:8080/event/id?creator_id=${this.state.creator_id}`)
        .then(response => response.json())
        .then(response => {
            this.setState({ creator_name: response.data[0].username }, () =>{
                console.log("Callback for username: " + this.state.creator_name);
            });
        })
    }

    getAttending() {
        Auth.fetch1(`http://localhost:8080/event/attending?event_id=${this.props.params.eventID}`)
        .then(response => response.json())
        .then(response => {
            console.log(response.data.length);
            if(response.data.length <= 0){
                console.log("This event has no attenders and needs to be fixed in the database");
            }
            else{
                console.log("This event has " + response.data.length + " attendees");
                this.setState({event_attendees: response.data});
            }
        })
    }

    goHome() {
        this.props.history.replace('/')
    }

    renderEvent = ({username}) => <div>Username: {username} </div>
    
    render() {
        const { event_attendees } = this.state;
        
            return (
              <div className="App">
                <div className="AppHeader">
                    <Navbar bg="light" expand="lg" className="navbarcust">
                    <Navbar.Brand onClick={this.goHome} className="homebutton">MeetUp</Navbar.Brand>
                    <Navbar.Collapse className="justify-content-end">
                        <Navbar.Text className="justify-content-end">
                            Signed in as: {this.props.user.username}
                        </Navbar.Text>
                    </Navbar.Collapse>
                    <div className="pl-4">
                        <Button className="logout" variant="outline-dark" onClick={this.handleLogout.bind(this)}>Logout</Button>
                    </div>
                    </Navbar>
                </div>
                    <div className="eventparent">
                        <div className="eventinfo">
                            <div className="eventPageName">Name: {this.state.event_name}</div><div className="eventPageCreator">By: {this.state.creator_name}</div>
                            <div className="eventPageDescription">{this.state.event_description}</div>
                        </div>
                        <div className="attendingbarparent">
                            <div className="attendingBar">{event_attendees.map(this.renderEvent)}
                            This is some text
                            </div>
                        </div>
                    </div>
              </div>
            );
          }
}

export default withAuth(Event);