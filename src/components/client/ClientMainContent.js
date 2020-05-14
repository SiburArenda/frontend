import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Route} from "react-router-dom";
import About from "./About";
import Rooms from "./Rooms";
import Contacts from "./Contacts";
import SignUp from "./SignUp";
import ApplicationForm from "./ApplicationForm";
import EachRoom from "./EachRoom";
import AccountSettings from "./AccountSettings";
import AllApplications from "./AllApplications";

class ClientMainContent extends Component {

    state = {
        newApplication: true
    };

    render() {
        return (
            <React.Fragment>
                <Route
                    path="/"
                    exact
                    component={About}
                />
                <Route
                    path="/rooms"
                    exact
                    render={
                        (props) => (
                            <Rooms
                                {...props}
                                roomArray={this.props.roomArray}
                                showHint={this.props.showHint}
                                closeHint={this.props.closeHint}
                            />
                        )
                    }
                />
                <Route
                    path="/contacts"
                    component={Contacts}
                />
                <Route
                    path="/signup"
                    component={SignUp}
                />
                <EachRoom
                    roomArray={this.props.roomArray}
                    showHint={this.props.showHint}
                    closeHint={this.props.closeHint}
                />
                <Route
                    path='/accountSettings'
                    component={AccountSettings}
                />
                <Route
                    path='/applications'
                    render={
                        (props) => (
                            <AllApplications
                                {...props}
                                token={this.props.token}
                                userLogin={this.props.userLogin}
                                newApplication={this.newApplication}
                                refresh={this.state.newApplication}
                                openLogInForm={this.props.openLogInForm}
                            />
                        )
                    }
                />
                {
                    this.props.applicationFormVisible
                        ?
                        <ApplicationForm
                            closeAppWindow={this.props.closeAppWindow}
                            userLogin={this.props.userLogin}
                            token={this.props.token}
                            showHint={this.props.showHint}
                            closeHint={this.props.closeHint}
                            roomArray={this.props.roomArray}
                            minAppRef={this.props.minAppRef}
                            newApplication={this.newApplication}
                            ref={this.props.appFormRef}
                            refreshToken={this.props.refreshToken}
                        />
                        : null
                }
            </React.Fragment>
        );
    }

    newApplication = (what) => {
        this.setState({
            newApplication: what
        })
    }
}

ClientMainContent.propTypes = {
    applicationFormVisible: PropTypes.bool.isRequired,
    closeAppWindow: PropTypes.func.isRequired,
    showHint: PropTypes.func.isRequired,
    closeHint: PropTypes.func.isRequired,
    roomArray: PropTypes.array.isRequired,
    appFormRef: PropTypes.object.isRequired,
    userLogin: PropTypes.string.isRequired,
    token: PropTypes.string.isRequired,
    minAppRef: PropTypes.object.isRequired,
    openLogInForm: PropTypes.func.isRequired,
    refreshToken: PropTypes.func.isRequired
};

export default ClientMainContent;