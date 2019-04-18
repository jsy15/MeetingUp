import React, { Component } from 'react';
import '../App.css';
import AuthService from './AuthService';
import withAuth from './withAuth';
import Navbar from 'react-bootstrap/Navbar';
import Button from 'react-bootstrap/Button';
import Table from 'react-bootstrap/Table';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';
import { MDBDataTable } from 'mdbreact';

const Auth = new AuthService();



class Admin extends Component {

    constructor(props, context) {
        super(props, context);
        this.getEvents = this.getEvents.bind(this);
        this.getUsers = this.getUsers.bind(this);
        this.goHome = this.goHome.bind(this);

        this.state = {
            adminevents: [],
            adminusers: [],
            key: 'Users',
            changed: false,
            searchuserval: "",
            searcheventval: "",
        };
    }
    handleLogout(){
        Auth.logout()
        this.props.history.replace('/login');
    }

    showProfile(){
        this.props.history.push(`/profile`);
    }

    getEvents () {
        Auth.fetch1('http://localhost:8080/eventsadmin')
        .then(response => response.json())
        .then(response => this.setState({adminevents: response.data}))
        .catch(err => console.error(err))
    }
    
    getUsers () {
        Auth.fetch1('http://localhost:8080/usersadmin')
        .then(response => response.json())
        .then(response => this.setState({adminusers: response.data}))
        .catch(err => console.error(err))
    }

    componentDidMount() {
        this.getEvents();
        this.getUsers();
    }

    stateCheck() {
        console.log(this.state.adminusers);
        console.log(this.state.adminevents);
    }

    goHome() {
        this.props.history.replace('/')
    }

    //Delete Users
    deleteUser(param1, e) {
        Auth.fetch1(`http://localhost:8080/userdeleteadmin?user_id=${param1}`)
        .then(response => response.text())
        .then(response => alert(response))
        .catch(err => console.log(err))
        this.getUsers();
        this.getUsers();
        this.setState({ changed: !this.state.changed });
    }

    deleteEvent(param1, e) {
        Auth.fetch1(`http://localhost:8080/eventdeleteadmin?event_id=${param1}`)
        .then(response => response.text())
        .then(response => alert(response))
        this.getEvents();
        this.getEvents();
        this.setState({ changed: !this.state.changed });
    }



    renderEvents = ({ event_id, name, description, username, isprivate, address }) => {
        if (isprivate === 1){
            return(
                <tr key={event_id} onClick={() => this.clickOnEvent(event_id)}>
                    <th>
                        {event_id}
                    </th>
                    <th>
                        {name}
                    </th>
                    <th>
                        {description}
                    </th>
                    <th>
                        {username}
                    </th>
                    <th>
                        Yes
                    </th>
                    <th>
                        {address}
                    </th>
                    <th>
                        <Button variant="danger" onClick={this.deleteEvent.bind(this, event_id)}>X</Button>
                    </th>
                </tr>
            )
        }
        else {
            return(
                <tr key={event_id} onClick={() => this.clickOnEvent(event_id)}>
                    <th>
                        {event_id}
                    </th>
                    <th>
                        {name}
                    </th>
                    <th>
                        {description}
                    </th>
                    <th>
                        {username}
                    </th>
                    <th>
                        No
                    </th>
                    <th>
                        {address}
                    </th>
                    <th>
                        <Button variant="danger" onClick={this.deleteEvent.bind(this, event_id)}>X</Button>
                    </th>
                </tr>
            )
        }
    }

    renderUsers = ({ user_id, fname, lname, username, privilege }) => {
        if(this.props.user.id !== user_id  && privilege !== 2){
            return <tr key={user_id} onClick={() => this.clickOnUser(username)}><th>{user_id}</th><th>{fname}</th><th>{lname}</th><th>{username}</th><th>User</th><th><Button variant="danger" onClick={this.deleteUser.bind(this, user_id)}>X</Button></th></tr>
        }
        else {
            if(privilege === 2)
                return <tr key={user_id} onClick={() => this.clickOnUser(username)}><th>{user_id}</th><th>{fname}</th><th>{lname}</th><th>{username}</th><th>Admin</th><th>
                            <OverlayTrigger
                            placement="left-start"
                            delay={{ show: 0, hide: 0 }}
                            overlay={this.renderTooltip}
                            >
                                <span className="privatetooltip"><Button variant="danger" className="disabledbuttoncustom">X</Button></span>
                            </OverlayTrigger>
                        </th></tr>
        }
    }

    clickOnUser(param1) {
        this.setState({searcheventval: param1});
        this.setState({key: "Events"});
        this.searchEventDatabase(param1);
    }

    clickOnEvent(param1) {
        this.props.history.push(`/event/${param1}`);
    }

    renderTooltip = props => (
        <div
          {...props}
          style={{
            backgroundColor: 'rgba(0, 0, 0, 0.85)',
            padding: '2px 10px',
            color: 'white',
            zIndex: 500000,
            borderRadius: 3,
            ...props.style,
          }}
        >
          You can't delete yourself or another admin.
        </div>
      );

      searchUserDatabase(){
          console.log("Searching the database for: " + this.state.searchuserval);
          Auth.fetch1(`http://localhost:8080/searchuser?term=${this.state.searchuserval}`)
          .then(response => response.json())
          .then(response => this.setState({adminusers: response.data }))

      }

      searchEventDatabase(param1){
          if(param1 == null){
            console.log("Searching the databse for: " + this.state.searcheventval);
            Auth.fetch1(`http://localhost:8080/searchevent?term=${this.state.searcheventval}`)
            .then(response => response.json())
            .then(response => this.setState({adminevents: response.data}))
          }
          else{
            console.log("Searching the databse for: " + param1);
            Auth.fetch1(`http://localhost:8080/searchevent?term=${param1}`)
            .then(response => response.json())
            .then(response => this.setState({adminevents: response.data}))
          }
          
      }

      resetUserSearch() {
        this.setState({searchuserval: ""});
        this.getUsers();
      }

      resetEventSearch() {
        this.setState({searcheventval: ""});
        this.getEvents();
      }

    render() {
        const { adminusers, adminevents } = this.state;
        let eventtable = (<Table striped bordered hover variant size="md">
        <thead>
            <tr>
                <th>Event_ID</th>
                <th>Name</th>
                <th>Description</th>
                <th>Creator Username</th>
                <th>Private?</th>
                <th>Address</th>
                <th></th>
            </tr>
        </thead>
        <tbody>
            {adminevents.map(this.renderEvents)}
        </tbody>
    </Table>);

        let searchText = "Init";

        return (
        <div className="App">
        
            <Navbar bg="light" expand="lg" className="navbarcust">
            <Navbar.Brand onClick={this.goHome} className="homebutton">MeetingUp</Navbar.Brand>
            <Navbar.Collapse className="justify-content-end">
                <Navbar.Text className="justify-content-end">
                    <span className="profilebutton" onClick={() => this.showProfile()}>Signed in as: {this.props.user.username}</span>
                </Navbar.Text>
            </Navbar.Collapse>
            <div className="pl-4">
                <Button className="logout" variant="outline-dark" onClick={this.handleLogout.bind(this)}>Logout</Button>
            </div>
            </Navbar>

            <Tabs defaultActiveKey="Users" id="controlled-admin-tab" activeKey={this.state.key} onSelect={key => {this.setState({key}); this.getEvents(); this.getUsers();}}>
                <Tab eventKey="Users" title="Users">
                <input value={this.state.searchuserval} onChange={e => {this.setState({ searchuserval: e.target.value})}}></input>
                <Button id="searchinput" onClick={() => this.searchUserDatabase()}>Search</Button>
                <Button onClick={() => this.resetUserSearch()}>Reset</Button>
                    <Table striped bordered hover>
                        <thead>
                            <tr>
                                <th>User_ID</th>
                                <th>First Name</th>
                                <th>Last Name</th>
                                <th>Username</th>
                                <th>Privilege Level</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {adminusers.map(this.renderUsers)}
                        </tbody>
                    </Table>
                </Tab>
                <Tab eventKey="Events" title="Events">
                    <input value={this.state.searcheventval} onChange={e => {this.setState({ searcheventval: e.target.value})}}></input>
                    <Button id="searchinput" onClick={() => this.searchEventDatabase()}>Search</Button>
                    <Button onClick={() => this.resetEventSearch()}>Reset</Button>
                    {eventtable}
                </Tab>
            </Tabs>

        </div>
        );
    }
}

export default withAuth(Admin);
