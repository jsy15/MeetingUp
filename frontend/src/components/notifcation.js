import AuthService from "./AuthService";
import Modal from 'react-bootstrap/Modal';
import React from 'react';
const Auth = new AuthService();


export const showInvites=(user_id)=> {
    alert("Hello " + user_id);
    Auth.fetch1(`http://localhost:8080/invite/show?user_id=${user_id}`)
    .then(response => response.json())
    .then(response => {
        var output1 = `<div>Begin</div>\n`
        for(var i = 0; i < response.data.length; i++){
            output1 += `<tr>${response.data[i].username} has invited you to: ${response.data[i].name}</tr>\n`
        }
        output1 += `<div>end</div>\n`;
        console.log(output1);
        return <div>Shit</div>
    })
}

