import React, { Component } from 'react';
import '../App.css';
import './profile.css';
import AuthService from './AuthService';
import withAuth from './withAuth';
import Navbar from 'react-bootstrap/Navbar';
import Button from 'react-bootstrap/Button';
import Table from 'react-bootstrap/Table';
import Modal from 'react-bootstrap/Modal';

const md5 = require('md5');

const Auth = new AuthService();



class Profile extends Component {

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
            toggleFNameEdit: false,
            toggleLNameEdit: false,
            passwordmodal:  false,
            oldcheckpassword: "",
            newpasswordtoggle: false,
            oldpasswordtoggle: true,
        };
    }

    fetchUserInfo() {
        Auth.fetch1(`http://localhost:8080/profile?user_id=${this.props.user.id}`)
        .then(response => response.json())
        .then(response => {
            this.setState({ 
                username: response.data[0].username, 
                fname: response.data[0].fname, 
                newfname: response.data[0].fname,
                lname: response.data[0].lname,
                newlname: response.data[0].lname 
            })
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

    toggleFNameEditRender(){
        this.setState({
            toggleFNameEdit: !this.state.toggleFNameEdit,
            newfname: this.state.fname
        })
    }

    toggleLNameEditRender(){
        this.setState({
            toggleLNameEdit: !this.state.toggleLNameEdit,
            newlname: this.state.lname
        })
    }

    togglePasswordModal(){
        this.setState({
            passwordmodal: !this.state.passwordmodal,
            oldcheckpassword: ""
        });
    }

    conditionalFNameRender(){
        if(this.state.toggleFNameEdit === true){
            return(
                <input value={this.state.newfname} onChange={(e => this.setState({newfname: e.target.value}))}></input>
            );
        }
    }

    conditionalLNameRender(){
        if(this.state.toggleLNameEdit === true){
            return (
                <input value={this.state.newlname} onChange={(e => this.setState({newlname: e.target.value}))}></input>
            );
        }
    }

    conditionalFNameEditButton(){
        if(this.state.toggleFNameEdit === false){
            return <Button onClick={() => this.toggleFNameEditRender()} >Edit First Name</Button>
        }
    }

    conditionalLNameEditButton(){
        if(this.state.toggleLNameEdit === false){
            return <Button onClick={() => this.toggleLNameEditRender()} >Edit Last Name</Button>
        }
    }

    condtionalNameEditButton(){
        if(this.state.toggleFNameEdit === true || this.state.toggleLNameEdit){
            return <Button onClick={() => this.toggleNameEdit()}>Save Changes</Button>
        }
    }

    toggleNameEdit(){
        if(this.state.toggleFNameEdit === true || this.state.toggleLNameEdit === true){
            if(this.state.toggleFNameEdit === true && this.state.toggleLNameEdit === false){
                this.setState({
                    toggleFNameEdit: !this.state.toggleFNameEdit,
                    fname: this.state.newfname
                });
            }
            else if(this.state.toggleFNameEdit === false && this.state.toggleLNameEdit === true){
                    this.setState({
                        toggleLNameEdit: !this.state.toggleLNameEdit,
                        lname: this.state.newlname
                    });
            }
            else {
                this.setState({
                    toggleFNameEdit: !this.state.toggleFNameEdit,
                    toggleLNameEdit: !this.state.toggleLNameEdit,
                    fname: this.state.newfname,
                    lname: this.state.newlname
                })
            }
            Auth.fetch1(`http://localhost:8080/userchange?user_id=${this.props.user.id}&fname=${this.state.newfname}&lname=${this.state.newlname}`)
            .then(response => response.text())
            .then(response => alert(response))
        }
    }
    

    //Handle the logout
    handleLogout(){
        Auth.logout()
        this.props.history.replace('/login');
    }

    changePassword(){
        if(this.state.oldcheckpassword === ""){
            alert("You must insert a pasword");
            return;
        }
        var sendoldpassword = md5(this.state.oldcheckpassword);
        console.log(sendoldpassword);
        Auth.fetch1(`http://localhost:8080/checkpassword?user_id=${this.props.user.id}&password=${sendoldpassword}`)
        .then(response => response.text())
        .then(response => {
            if(response === "true"){
                this.setState({
                    oldpasswordtoggle: false,
                    newpasswordtoggle: true,
                })
            }
            else {
                alert("Your password is incorrect");
            }
        })
    }

    updatePassword(){
        if(this.state.newpassword === ""){
            alert("You must enter a new password");
        }
        else{
            var sendnewpassword = md5(this.state.newpassword);
            Auth.fetch1(`http://localhost:8080/updatepassword?user_id=${this.props.user.id}&password=${sendnewpassword}`)
            .then(response => response.text())
            .then(response => alert(response))
            this.resetModal();
        }
    }

    resetModal(){
        this.setState({
            oldpasswordtoggle: true,
            newpasswordtoggle: false,
            newpassword: "",
        })
    }

    changeModal(){
        this.setState({
            newpasswordtoggle: true,
            oldpasswordtoggle: false,
        })
    }


    componentDidMount(){
        this.fetchUserInfo();
    }

    conditonalOldPassword(){
        if(this.state.oldpasswordtoggle === true){
            return (
                        <span>
                            <br /> <br/>
                            <div>Please enter your old password.</div>
                            <input style={{ marginRight: '20px' }} type="password" onChange={e => this.setState({ oldcheckpassword: e.target.value })}></input>
                            <Button onClick={() => this.changePassword()}>Submit</Button>
                            <br /> <br />
                        </span>
            );
        }
    }

    conditonalNewPassword(){
        if(this.state.newpasswordtoggle === true){
            return (
                <span>
                    <br /> <br/>
                    <div>Please enter your new password.</div>
                    <input style={{ marginRight: '20px' }} type="password" onChange={e => this.setState({ newpassword: e.target.value })}></input>
                    <Button onClick={() => this.updatePassword()}>Change Password</Button>
                    <br /> <br />
                </span>
            );
        }
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


                <Table className="tableprofile">
                    <thead>
                    </thead>
                    <tbody>
                        <tr>
                            <td>
                                {this.state.username}
                            </td>
                        </tr>
                        <tr>
                            <td>
                                {this.state.fname}
                            </td>
                            <td>
                                {this.conditionalFNameEditButton()} {this.conditionalFNameRender()}
                            </td>
                        </tr>
                        <tr>
                            <td>
                                {this.state.lname}
                            </td>
                            <td>
                                {this.conditionalLNameEditButton()} {this.conditionalLNameRender()} 
                            </td>
                        </tr>
                        <tr>
                            <td>
                                Password Reset
                            </td>
                            <td>
                                <Button onClick={() => this.togglePasswordModal()}>Reset Password</Button>
                            </td>
                        </tr>
                    </tbody>
                </Table>
                <Modal show={this.state.passwordmodal} onHide={() => this.setState({ passwordmodal: false})}>
                    <Modal.Body>
                        {this.conditonalOldPassword()}
                        {this.conditonalNewPassword()}
                    </Modal.Body>
                </Modal>

                {this.condtionalNameEditButton()}
            </div>
            );
        
    }
}

export default withAuth(Profile);