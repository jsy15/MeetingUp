import React, { Component } from 'react';
import './Login.css';
import withAuth from './withAuth';

class Event extends Component {

    state = {
        eventid: null
    }

    componentDidMount () {
        console.log(this.props);
        const { eventID } = this.props.params;
        this.setState({eventid: eventID});
    }
    
    render() {
        return (
            <div>
                <div>Hello there</div>
                {this.state.eventid}
            </div>
            
        );
    }
}

export default withAuth(Event);