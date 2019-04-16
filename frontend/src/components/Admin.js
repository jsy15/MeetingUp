import React, { Component } from 'react';
import '../App.css';
import AuthService from './AuthService';
import withAuth from './withAuth';
import Navbar from 'react-bootstrap/Navbar';
import ButtonToolbar from 'react-bootstrap/ButtonToolbar';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Button from 'react-bootstrap/Button';
import Table from 'react-bootstrap/Table';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
const Auth = new AuthService();

class Admin extends Component {

    constructor(props, context) {
        super(props, context);
        this.getEvents = this.getEvents.bind(this);
        this.getUsers = this.getUsers.bind(this);

        this.state = {
            adminevents: [],
            adminusers: [],
        };
    }
    handleLogout(){
        Auth.logout()
        this.props.history.replace('/login');
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



    renderEvents = ({ event_id, name, description, creator_id, isprivate, address }) => {
        console.log({event_id});
        return(
            <tr key={event_id}>
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
                    {creator_id}
                </th>
                <th>
                    {isprivate}
                </th>
                <th>
                    {address}
                </th>
            </tr>
        )
    }

    renderUsers = ({ user_id, fname, lname, username, privilege }) => {
        console.log({user_id});
        return (
            <tr key={user_id}>
                <th>
                    {user_id}
                </th>
                <th>
                    {fname}
                </th>
                <th>
                    {lname}
                </th>
                <th>
                    {username}
                </th>
                <th>
                    {privilege}
                </th>
            </tr>
        )
    }


    render() {
        const { adminusers, adminevents } = this.state;

        console.log(this.state);
        console.log(adminevents);
        console.log(adminusers);

        return (
        <div className="App">
        
            <Navbar bg="light" expand="lg" className="navbarcust">
            <Navbar.Brand>MeetingUp</Navbar.Brand>
            <Navbar.Collapse className="justify-content-end">
                <Navbar.Text className="justify-content-end">
                    Signed in as: {this.props.user.username}
                </Navbar.Text>
            </Navbar.Collapse>
            <div className="pl-4">
                <Button className="logout" variant="outline-dark" onClick={this.handleLogout.bind(this)}>Logout</Button>
            </div>
            </Navbar>

            <Tabs defaultActiveKey="Users" id="uncontrolled-admin-tab">
                <Tab eventKey="Users" title="Users">
                    <Table striped bordered hover>
                        <thead>
                            <tr>
                                <th>User_ID</th>
                                <th>First Name</th>
                                <th>Last Name</th>
                                <th>Username</th>
                                <th>Privilege</th>
                            </tr>
                        </thead>
                        <tbody>
                            {adminusers.map(this.renderUsers)}
                        </tbody>
                    </Table>
                </Tab>
                <Tab eventKey="Events" title="Events">
                    <Table striped bordered hover>
                        <thead>
                            <tr>
                                <th>Event_ID</th>
                                <th>Name</th>
                                <th>Description</th>
                                <th>Creator_ID</th>
                                <th>Private?</th>
                                <th>Address</th>
                            </tr>
                        </thead>
                        <tbody>
                            {adminevents.map(this.renderEvents)}
                        </tbody>
                    </Table>
                </Tab>
            </Tabs>

        </div>
        );
    }
}

export default withAuth(Admin);
