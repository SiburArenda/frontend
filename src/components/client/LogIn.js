import React, {Component} from 'react';
import PropTypes from 'prop-types';
import '../../resource/styles/LogInForm.css'

class LogIn extends Component {

    state = {
        username: '',
        password: ''
    };

    render() {
        return (
            <div id='log-in-form'>
                <input type='text' name='username' onChange={(e) => {this.handleInput(e)}}/><br/>
                <input type='text' name='password' onChange={(e) => {this.handleInput(e)}}/><br/>
                <button onClick={() => this.submitLogIn()}>OK</button>
            </div>
        );
    }

    submitLogIn = () => {
        const request = new XMLHttpRequest();

        request.onreadystatechange = () =>
        {
            if (request.readyState === 4)
            {
                const response = request.responseText;
                console.log(response);
                const parsedResponse = JSON.parse(response);
                this.props.storeResponse(parsedResponse.username, parsedResponse.token);
                this.props.closeLogInForm();
            }
        };

        request.open('POST', 'http://siburarenda.publicvm.com/api/public/login', true);
        request.setRequestHeader('Content-Type', 'application/json');
        request.send(JSON.stringify(this.state))
    };

    handleInput = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        })
    }
}

LogIn.propTypes = {
    closeLogInForm: PropTypes.func.isRequired,
    storeResponse: PropTypes.func.isRequired
};

export default LogIn;