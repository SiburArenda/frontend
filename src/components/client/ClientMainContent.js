import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Route} from "react-router-dom";
import About from "./About";
import Rooms from "./Rooms";
import Contacts from "./Contacts";
import SignUp from "./SignUp";
import ApplicationForm from "./ApplicationForm";
import EachRoom from "./EachRoom";

class ClientMainContent extends Component {

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
                            ref={this.props.appFormRef}
                        />
                        : null
                }
            </React.Fragment>
        );
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
    token: PropTypes.string.isRequired
};

export default ClientMainContent;