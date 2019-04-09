import React, { Component } from 'react';
import '../App.css';
import withAuth from './withAuth';
import AuthService from './AuthService';
import Modal from 'react-bootstrap/Modal';
import Table from 'react-bootstrap/Table';
import Navbar from 'react-bootstrap/Navbar';
import Button from 'react-bootstrap/Button';
import bellicon from '../images/bell-alarm-symbol.svg';
import { showInvites } from './notifcation.js';
const Auth = new AuthService();

class Event extends Component {

    constructor(props, context) {
        super(props, context);
        this.getEvents = this.getEvents.bind(this);
        this.goHome = this.goHome.bind(this);
        this.conditionalRender = this.conditionalRender.bind(this);
        this.inviteUser = this.inviteUser.bind(this);
        this.handleShow2 = this.handleShow2.bind(this);
        this.handleClose2 = this.handleClose2.bind(this);
    
        this.state = {
          event_id: 0,
          event_name: "",
          event_description: "",
          eventcreator: [],
          event_attendees: [],
          creator_id: 0,
          creator_name: "",
          numattending: 0,
          conditionalrenderran: false,
          ownerofevent: false,
          ownerOfEvent: -1,
          show2: false,
          invites: [],
        };
      }

    componentDidMount () {
        const { eventID } = this.props.params;
        this.setState({eventid: eventID});
        this.getEvents();
        this.getInvites();
        console.log("DidMount", this.state.ownerOfEvent);
    }

    getOwnerOfEvent() {
        Auth.fetch1(`http://localhost:8080/event/checkattending?event_id=${this.props.params.eventID}`)
        .then(response => response.json())
        .then(response => this.setState({ ownerOfEvent: response.data[0].creator_id}))
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

    getInvites () {
        Auth.fetch1(`http://localhost:8080/invite/show?user_id=${this.props.user.id}`)
        .then(response => response.json())
        .then(response => {
            this.setState({ invites: response.data}, () => {
              console.log(this.state.invites);
            });
        })
    }

    renderInvites = ({username, name, invite_id, event_id, invited_user_id}) => {
        this.getInvites();
        return <tr><th key={invite_id}>You were invited by: {username} to the event: {name}</th><th onClick={this.acceptInvite.bind(this, invite_id, event_id, invited_user_id)}>Accept</th><th onClick={this.acceptInvite.bind(this, invite_id)}>Deny</th></tr>
      }
      
      acceptInvite(param1, param2, param3, e){
        Auth.fetch1(`http://localhost:8080/invite/accept?invite_id=${param1}&event_id=${param2}&user_id=${param3}`)
        .then(response => response.text())
        .then(response => alert(response))
        .then(this.getInvites())
        .then(this.handleClose2())
      }

      denyInvite(param1, e) {
          Auth.fetch1(`http://localhost:8080/invite/deny?invite_id=${param1}`)
          .then(response=> response.text())
          .then(response => alert(response))
          .then(this.getInvites())
          .then(this.handleClose2())
      }

      handleClose2() {
        this.setState({ show2: false });
      }
      
      handleShow2() {
        this.setState({ show2: true });
      }

    getCreator() {
        Auth.fetch1(`http://localhost:8080/event/id?creator_id=${this.state.creator_id}`)
        .then(response => response.json())
        .then(response => {
            this.setState({ creator_name: response.data[0].username }, () =>{
                console.log("From inside of getCreator");
            });
        })
    }

    getAttending() {
        Auth.fetch1(`http://localhost:8080/event/attending?event_id=${this.props.params.eventID}`)
        .then(response => response.json())
        .then(response => {
            if(response.data.length <= 0){
                console.log("This event has no attenders and needs to be fixed in the database");
            }
            else{
                console.log("This event has " , response.data.length , " attendees");
                this.setState({event_attendees: response.data});
            }
        })
    }

    goHome() {
        this.props.history.replace('/')
    }

    renderEvent = ({username}) => {
        return <div>Username: {username} </div>
    }

    inviteUser(){
        var user = prompt("Please enter the username of the user you wish to invite.");
        var alreadyattending = false;
        for(var i = 0; i < this.state.event_attendees.length; i++){
            if(user === this.state.event_attendees[i].username){
                alreadyattending = true;
            }
        }
        if(this.props.user.username === user)
            alert("You cannot invite yourself to the event");
        else if (alreadyattending){
            alert("You cannout invite a user that is already attending");
        }
        else{
            Auth.fetch1(`http://localhost:8080/invite?username=${user}&sender=${this.props.user.id}&event_id=${this.props.params.eventID}`)
            .then(response => response.text())
            .then(response => {
                alert(response);
            })
        }
    }

    conditionalRender () {
        if(this.state.creator_id !== 0){
            console.log(this.state.event_attendees);
            console.log(this.state.creator_id);
            if(this.props.user.id === this.state.creator_id)
                return <button className="invitepeoplebutton" onClick={this.inviteUser}>Invite People</button>
            else
                return;
        }
        return;
    }
    
    render() {
        const { event_attendees, invites } = this.state;
        
            return (
              <div className="App">
                <div className="AppHeader">
                    <Navbar bg="light" expand="lg" className="navbarcust">
                    <Navbar.Brand onClick={this.goHome} className="homebutton">MeetUp</Navbar.Brand>
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


                </div>
                    <div className="eventparent">
                        <div className="eventinfo">
                            <div className="eventPageName">Name: {this.state.event_name}</div><div className="eventPageCreator">By: {this.state.creator_name}</div>
                            <div className="eventPageDescription">{this.state.event_description}</div>
                        </div>
                        <div className="attendingbarparent">
                            {this.conditionalRender()}
                            <div className="attendingBar">{event_attendees.map(this.renderEvent)}
                            </div>
                        </div>
                    </div>
              </div>
            );
          }
}

export default withAuth(Event);