import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Route, BrowserRouter as Router} from "react-router-dom";
import About from "./About";
import Rooms from "./Rooms";
import Contacts from "./Contacts";
import SignUp from "./SignUp";
import ApplicationForm from "./ApplicationForm";
import LogIn from "./LogIn";

class ClientMainContent extends Component {

    state = {
        token: '',
        userName: '',
        fullName: ''
    };

    render() {
        return (
            <Router>
                <Route
                    path="/"
                    exact
                    component={About}
                />
                <Route
                    path="/rooms"
                    component={Rooms}
                />
                <Route
                    path="/contacts"
                    component={Contacts}
                />
                <Route
                    path="/signup"
                    component={SignUp}
                />
                {this.props.applicationFormVisible
                    ? <ApplicationForm
                        closeAppWindow={this.props.closeAppWindow}
                        userName={this.state.userName}
                        token={this.state.token}
                        showHint={this.props.showHint}
                        closeHint={this.props.closeHint}
                    />
                    : null
                }
                {this.props.logInFormVisible
                    ? <LogIn closeLogInForm={this.props.closeLogInForm} storeResponse={this.storeResponse}/>
                    : null
                }
            </Router>
        );
    }

    storeResponse = (username, token) => {
        this.setState({
            userName: username,
            token: token
        })
    };
}

ClientMainContent.propTypes = {
    logInFormVisible: PropTypes.bool.isRequired,
    applicationFormVisible: PropTypes.bool.isRequired,
    closeLogInForm: PropTypes.func.isRequired,
    closeAppWindow: PropTypes.func.isRequired,
    showHint: PropTypes.func.isRequired,
    closeHint: PropTypes.func.isRequired
};

export default ClientMainContent;