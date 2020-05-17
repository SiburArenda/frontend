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
        const {
            roomArray,
            showHint,
            closeHint,
            token,
            userLogin,
            password,
            applicationFormVisible,
            closeAppWindow,
            refreshToken,
            appFormRef
        } = this.props;
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
                                roomArray={roomArray}
                                showHint={showHint}
                                closeHint={closeHint}
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
                    render={
                        (props) => (
                            <SignUp
                                {...props}
                                sendBird={this.props.sendBird}
                                showHint={this.props.showHint}
                                closeHint={this.props.closeHint}
                            />
                        )
                    }
                />

                {
                    roomArray.length === 11
                        ?
                        <EachRoom
                            roomArray={roomArray}
                            showHint={showHint}
                            closeHint={closeHint}
                        />
                        : null
                }

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
                                token={token}
                                userLogin={userLogin}
                                password={password} //TODO: Security!
                                newApplication={this.newApplication}
                                refresh={this.state.newApplication}
                                refreshToken={refreshToken}
                            />
                        )
                    }
                />
                {
                    applicationFormVisible
                        ?
                        <ApplicationForm
                            closeAppWindow={closeAppWindow}
                            userLogin={userLogin}
                            token={token}
                            password={password} //TODO: Security!
                            showHint={showHint}
                            closeHint={closeHint}
                            roomArray={roomArray}
                            newApplication={this.newApplication}
                            ref={appFormRef}
                            refreshToken={refreshToken}
                            sendBird={this.props.sendBird}
                        />
                        : null
                }
            </React.Fragment>
        );
    }

    newApplication = (what) => {
        console.log('Wow! New application!');
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
    password: PropTypes.string.isRequired, //TODO: Security!
    refreshToken: PropTypes.func.isRequired,
    sendBird: PropTypes.func.isRequired
};

export default ClientMainContent;