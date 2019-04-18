import React, { Component } from 'react';
import '../App.css';
import AuthService from './AuthService';
import withAuth from './withAuth';
import Navbar from 'react-bootstrap/Navbar';
import Button from 'react-bootstrap/Button';

const Auth = new AuthService();



class Admin extends Component {

    constructor(props, context) {
        super(props, context);

        this.showAdmin = this.showAdmin.bind(this);
        this.goHome = this.goHome.bind(this);

        this.state = {
            username: "",
            fname: "",
            lname: "",
            newfname: "",
            newlname: "",
            newpassword: "",
        };
    }

    fetchUserInfo() {
        Auth.fetch1(`http://localhost:8080/profile?user_id=${this.props.user.id}`)
        .then(response => response.json())
        .then(response => {
            this.setState({ username: response.data[0].username, fname: response.data[0].fname, lname: response.data[0].lname })
        })
    }

    adminPage(){
        if(this.props.user.priv === 2){
            return <Button className="adminpage" variant="outline-danger" onClick={this.showAdmin}>Admin</Button>
        }
    }

    showAdmin() {
        this.props.history.push(`/admin`);
    }

    goHome() {
        this.props.history.replace('/')
    }
    

    //Handle the logout
    handleLogout(){
        Auth.logout()
        this.props.history.replace('/login');
    }


    componentDidMount(){
        this.fetchUserInfo();
    }


    render() {
            return (
            <div className="App">

                <Navbar bg="light" expand="lg" className="navbarcust">
                    <Navbar.Brand onClick={this.goHome} className="homebutton">MeetingUp</Navbar.Brand>
                    <Navbar.Collapse className="justify-content-end">
                        <Navbar.Text className="justify-content-end">
                            <span className="profilebutton" >Signed in as: {this.props.user.username}</span>
                        </Navbar.Text>
                    </Navbar.Collapse>
                    <div className="pl-4">
                        {this.adminPage()}  
                        <Button className="logout" variant="outline-dark" onClick={this.handleLogout.bind(this)}>Logout</Button>
                    </div>
                </Navbar>

                {this.props.user.id} <br />
                {this.state.username} <br />
                {this.state.fname} <br />
                {this.state.lname} <br />

            </div>
            );
        
    }
}

export default withAuth(Admin);