import React, { Component } from 'react';
import './Login.css';
import AuthService from './AuthService';
import ReactDOM from 'react-dom';
const md5 = require('md5');

class CreateAcc extends Component {

    state = {
        user: [],
        userinfo:{
            username: 'Username goes here',
            password: 'Password goes here',
        }        
    }

    constructor(){
        super();
        this.handleChange = this.handleChange.bind(this);
        this.handleFormSubmit = this.handleFormSubmit.bind(this);
        this.checkAccount = this.checkAccount.bind(this);
        this.Auth = new AuthService();
        this.backtologin = this.backtologin.bind(this);
    }
    componentWillMount(){
        if(this.Auth.loggedIn())
            this.props.history.replace('/');
    }
    render() {
        return (
            <div className="center">
            <div id="alertgoeshere" className="createalert">
            </div>
                <div className="card">
                    <h1>Create Account</h1>
                    <form onSubmit={this.checkAccount}>
                        <input
                            className="form-item"
                            placeholder="Username goes here..."
                            name="username"
                            type="text"
                            onChange={this.handleChange}
                        />
                        <input
                            className="form-item"
                            placeholder="Firstname goes here..."
                            name="fname"
                            type="text"
                            onChange={this.handleChange}
                        />
                        <input
                            className="form-item"
                            placeholder="Lastname goes here..."
                            name="lname"
                            type="text"
                            onChange={this.handleChange}
                        />
                        <input
                            className="form-item"
                            placeholder="Password goes here..."
                            name="password"
                            type="password"
                            onChange={this.handleChange}
                        />
                        <input
                            className="form-submit"
                            value="SUBMIT"
                            type="submit"
                        />
                    </form>
                    <br></br>
                    <div className="createaccountwrapper">
                        <button className="createaccount" onClick={this.backtologin}>
                            Go back to login screen
                        </button>
                    </div>
                </div>
            </div>
            
        );
    }
    checkAccount(e) {
        const usernameadd = this.state.username;
        const fnameadd = this.state.fname;
        const lnameadd = this.state.lname;
        const passwordadd = md5(this.state.password);
        console.log(`username: ${usernameadd}, fname: ${fnameadd}, lname: ${lnameadd}, password: ${passwordadd}`);
        e.preventDefault();
        console.log(this.state.username);
        fetch(`http://localhost:8080/userscheck?password=${passwordadd}&fname=${fnameadd}&lname=${lnameadd}&username=${usernameadd}`)
        .then(response=> {
            return response.text();
        })
        .then(response =>{
            const elementSuccess = (
                <div className="createalertsuccess">
                    Successfully added user!
                </div>
            );
            const elementFailure = (
                <div>
                    Sorry that username is taken!
                </div>
            );// eslint-disable-next-line
            if (response == "User already exists"){
                ReactDOM.render(elementFailure, document.getElementById('alertgoeshere'));
            }
            else{
                ReactDOM.render(elementSuccess, document.getElementById('alertgoeshere'));
                setTimeout(() => {
                    this.backtologin();
                }, 3000);
            }
        })

    }

    backtologin(){
        this.props.history.replace('login');
    }

    handleFormSubmit(e){
        e.preventDefault();
        if(this.state){
        this.Auth.login(this.state.username,this.state.password)
            .then(res =>{
               this.props.history.replace('/');
            })
            .catch(err =>{
                alert(err);
            })


        }
    }

    handleChange(e){
        this.setState(
            {
                [e.target.name]: e.target.value
            }
        )
    }

    handleCreateAccount(){
        this.props.history.replace('/createAccount');
    }
    
}

export default CreateAcc;