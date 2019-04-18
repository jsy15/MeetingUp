import React, { Component } from 'react';
import '../App.css';
import withAuth from './withAuth';
import AuthService from './AuthService';
import Navbar from 'react-bootstrap/Navbar';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
const Auth = new AuthService();

class Event extends Component {

    constructor(props, context) {
        super(props, context);
        this.getEvents = this.getEvents.bind(this);
        this.goHome = this.goHome.bind(this);
        this.conditionalRender = this.conditionalRender.bind(this);
        this.inviteUser = this.inviteUser.bind(this);
        this.removeAttendee = this.removeAttendee.bind(this);   
    
        this.state = {
          event_id: 0,
          event_name: "",
          event_description: "",
          event_private: "",
          eventcreator: [],
          event_attendees: [],
          creator_id: 0,
          creator_name: "",
          numattending: 0,
          conditionalrenderran: false,
          ownerofevent: false,
          ownerOfEvent: -1,
          eventaddress: "",
          showMap: false,
          editing: false,
          neweventname: "",
          neweventdesc: "",
          neweventaddress: "",
          newprivate: "",
        };
      }

    componentDidMount () {
        const { eventID } = this.props.params;
        this.setState({eventid: eventID});
        this.getEvents();
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

    showProfile(){
        this.props.history.push(`/profile`);
    }

    getEvents() {
        var event_id = this.props.params.eventID;
        Auth.fetch1(`http://localhost:8080/event/id?event_id=${event_id}`)
        .then(response => response.json())
        .then(response => {
            const new_creator = response.data[0].creator_id;
            this.setState({ creator_id: new_creator, event_id: response.data[0].event_id, event_name: response.data[0].name, event_description: response.data[0].description, eventaddress: response.data[0].address, event_private: response.data[0].isprivate }, () => {
                this.getCreator();
                this.getAttending();
            });
        })
        .catch(err => console.error(err))
        

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

    removeAttendee(user_id, e) {
        Auth.fetch1(`http://localhost:8080/attending/remove?event_id=${this.props.params.eventID}&user_id=${user_id}`)
        .then(response => response.text())
        .then(response => {
            alert(response);
            window.location.reload()
        })
    }

    canRemove(e, user_id) {
        console.log(user_id);
        if(this.props.user.id === this.state.creator_id && this.props.user.id !== user_id){
            return <button onClick={this.removeAttendee.bind(this, user_id)}>X</button>
        }
    }

    renderEvent = ({username, user_id}) => {
        return <div>Username: {username} {this.canRemove(this, user_id)}</div>
    }

    isAddress() {
        console.log("Address: " + this.state.eventaddress);
        var addressling = "https://maps.google.com/?q=" + this.state.eventaddress;
        
        if (this.state.eventaddress !== null && this.state.eventaddress !== "" && this.state.eventaddress !== "undefined"){
            return <span><a href={addressling}>{this.state.eventaddress}</a>
            {this.isMap()}
            <br></br>
            <button onClick={this.toggleMap.bind(this)}>Toggle Map</button>
            </span>
        }
    }

    toggleMap(){
        if(this.state.showMap === true)
            this.setState({ showMap: false})
        else   
            this.setState({ showMap: true})
    }

    isMap() {
        var embedaddress = "https://www.google.com/maps/embed/v1/place?q=" + this.state.eventaddress + "&key=AIzaSyAeUK5utPz2bbXj97LhEa--My4YT9v3W-A"; 
        console.log(embedaddress);
        if(this.state.eventaddress !== null){
            if(this.state.showMap === true){
                return <span><br></br><iframe width="300" height="250" frameborder="0" src={embedaddress} allowfullscreen className="maphidden" title="EventMap"></iframe></span>
            }
        }
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

    toggleEditting(){
        this.setState({ editing: !this.state.editing});
        console.log("Hello there: " + this.state.neweventname);
        if(this.state.neweventname === ""){
            this.state.neweventname = this.state.event_name;
            this.state.neweventdesc = this.state.event_description;
            this.state.neweventaddress = this.state.eventaddress;
            this.state.newprivate = this.state.event_private;
        }
        
    }

    updateEvent(){
        var changeeventprivate = this.state.newprivate;
        console.log("state private old: " + this.state.event_private);
        console.log("New provate: " + this.state.newprivate);
        if(changeeventprivate === 0 || changeeventprivate === false){
            changeeventprivate = 0;
            this.setState({newprivate: 0});
        }
        else{
            changeeventprivate = 1;
            this.setState({newprivate: 1});
        }
        console.log("changeevent: " + changeeventprivate);

        if(this.state.event_name === this.state.neweventname && this.state.event_description === this.state.neweventdesc && this.state.eventaddress === this.state.neweventaddress && this.state.event_private === changeeventprivate){
            alert("You have not changed the event");
        }
        else{
            Auth.fetch1(`http://localhost:8080/eventchange?event_id=${this.props.params.eventID}&name=${this.state.neweventname}&description=${this.state.neweventdesc}&address=${this.state.neweventaddress}&isprivate=${changeeventprivate}`)
            .then(response => response.text())
            .then(response => alert(response))
            .then(this.getEvents())
            this.state.event_name = this.state.neweventname;
            this.state.event_description = this.state.neweventdesc;
            this.state.eventaddress = this.state.neweventaddress;
            this.state.event_private = this.state.newprivate;
            console.log("What: "+ this.state.event_private);
            
        }
        this.getEvents()
        this.toggleEditting();
    }

    conditionalEditing(){
        if(this.state.editing === true){
            return (
                <div className="editModal">
                    <div className="centerEdit">
                        <input></input><br/>
                        <input></input><br/>
                        <input></input><br/>
                        <input></input><br/>
                    </div>
                </div>
            );
        }
        else{
            return;
        }
    }

    conditionalCheckbox(){
        if(this.state.newprivate === 1)
            return <div className="privatetooltip"><input type="checkbox" checked className="eventprivate" id="eventPrivateCheck" onClick={e => this.setState({newprivate: e.target.checked})}></input> Private? </div>
        else
         return <div className="privatetooltip"><input type="checkbox" className="eventprivate" id="eventPrivateCheck" onClick={e => this.setState({newprivate: e.target.checked})}></input> Private? </div>

    }

    conditonalEditButton(){
        if(this.props.user.id === this.state.creator_id)
        return <Button variant="info" onClick={() => {this.toggleEditting()}}>Edit Event</Button>

    }

    checkPrivate(){
        if(this.state.event_private === 1 && this.state.newprivate ==="")
            return <span className="eventisprivatestatus">Private</span>
        else if(this.state.newprivate === 1)
            return <span className="eventisprivatestatus">Private</span>
        else 
            return <span className="eventisnotprivatestatus">Public</span>
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
        const { event_attendees} = this.state;
        
            return (
              <div className="App">
                <div className="AppHeader">
                    <Navbar bg="light" expand="lg" className="navbarcust">
                    <Navbar.Brand onClick={this.goHome} className="homebutton">MeetingUp</Navbar.Brand>
                    <Navbar.Collapse className="justify-content-end">
                        <Navbar.Text className="justify-content-end">
                            <span className="profilebutton" onClick={() => this.showProfile()}>Signed in as: {this.props.user.username}</span>                        </Navbar.Text>
                    </Navbar.Collapse>
                    <div className="pl-4">
                        <Button className="logout" variant="outline-dark" onClick={this.handleLogout.bind(this)}>Logout</Button>
                    </div>
                    </Navbar>

                    <Modal show={this.state.editing} onHide={this.toggleEditting.bind(this)}>
                        <Modal.Header closeButton>
                            <Modal.Title>Creating an event:</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <textarea className="eventname" id="eventNameText" rows="2" cols="50" value={this.state.neweventname} onChange={e => this.setState({ neweventname: e.target.value })} onBlur={e => this.setState({ neweventname: e.target.value })} ></textarea>
                            <textarea className="eventdescription" id="eventDescText" rows="10" cols="50" value={this.state.neweventdesc} onChange={e => this.setState({ neweventdesc: e.target.value})} onBlur={e => this.setState({ neweventdesc: e.target.value})} ></textarea>
                            <input className="eventname" id="eventAddrText" value={this.state.neweventaddress} onChange={e => this.setState({ neweventaddress: e.target.value })} onBlur={e => this.setState({ neweventaddress: e.target.value })} ></input>
                            {this.conditionalCheckbox()}

                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="primary" onClick={() => this.updateEvent()}>
                                Change Event
                            </Button>
                        </Modal.Footer>
                    </Modal>


                </div>
                    <div className="eventparent">
                        <div className="eventinfo">
                        
                            <div className="eventPageName">{this.state.event_name}</div><div className="eventPageCreator">By: <span className="eventPageCreatorName">{this.state.creator_name}</span></div>
                            {this.checkPrivate()} <br/><br />
                            <span>{this.isAddress()}</span>
                            {this.conditonalEditButton()}
                            <hr></hr>
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