import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Route} from 'react-router-dom';
import About from './About';
import Contacts from './Contacts';
import SignUp from './SignUp';
import ApplicationForm from './ApplicationForm';
import AllApplications from './AllApplications';
import RoomsSection from './RoomsSection';
import {roomArrayFormation} from '../../functional/RoomInfo';
import {connectServer} from '../../functional/ServerConnect';

class ClientMainContent extends Component {

    constructor(props) {
        super(props);

        this.sentApplicationRef = React.createRef();
    }

    state = {
        roomArray: []
    };

    componentDidMount() {
        if (this.state.roomArray.length < 11) {
            const headers = [
                {name: 'Content-Type', value: 'application/json'}
            ];
            connectServer(
                null,
                this.getRoomsFromServer,
                'get', headers,
                'api/public/rooms',
                this.roomsError,
                this.roomsError
            );
        }
    }

    // get rooms if they are not saved from last session
    getRoomsFromServer = responseText => {
        const pureResponse = JSON.parse(responseText);
        const roomArray = roomArrayFormation(pureResponse);

        this.setState({
            roomArray: roomArray
        })
    };

    roomsError = code => {
        this.setState({
            roomArray: [code]
        })
    };

    render() {

        const {
            showHint,
            closeHint,
            token,
            userLogin,
            password,
            applicationFormVisible,
            closeAppWindow,
            refreshToken,
            appFormRef,
            applicationFormState,
            openApplicationForm,
            sendBird,
            allApplicationsRef,
            userName
        } = this.props;

        const { roomArray } = this.state;

        return (
            <React.Fragment>

                <Route
                    path='/'
                    exact
                    component={About}
                />

                <Route
                    path='/contacts'
                    component={Contacts}
                />

                <Route
                    path='/signup'
                    render={
                        props => (
                            <SignUp
                                {...props}
                                sendBird={sendBird}
                                showHint={showHint}
                                closeHint={closeHint}
                            />
                        )
                    }
                />

                <Route
                    path='/rooms'
                    render={
                        props => (
                            <RoomsSection
                                {...props}
                                showHint={showHint}
                                closeHint={closeHint}
                                roomArray={roomArray}
                            />
                        )
                    }
                />

                <Route
                    path='/accountSettings'
                    render={
                        props => (
                            <SignUp //TODO: pass organization as prop
                                {...props}
                                sendBird={sendBird}
                                showHint={showHint}
                                closeHint={closeHint}
                                edit={true}
                                userLogin={userLogin}
                                userName={userName}
                                //orgName={orgName}
                            />
                        )
                    }
                />

                <Route
                    path='/applications'
                    render={
                        props => (
                            <AllApplications
                                {...props}
                                token={token}
                                userLogin={userLogin}
                                password={password} //TODO: Security!
                                refreshToken={refreshToken}
                                ref={allApplicationsRef}
                                openApplicationForm={openApplicationForm}
                                showHint={showHint}
                                closeHint={closeHint}
                                sentApplicationRef={this.sentApplicationRef}
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
                            ref={appFormRef}
                            refreshToken={refreshToken}
                            sendBird={sendBird}
                            allApplicationsRef={allApplicationsRef}
                            initState={applicationFormState}
                            sentApplicationRef={this.sentApplicationRef}
                        />
                        :
                        null
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
    appFormRef: PropTypes.object.isRequired,
    userLogin: PropTypes.string.isRequired,
    token: PropTypes.string.isRequired,
    password: PropTypes.string.isRequired, //TODO: Security!
    refreshToken: PropTypes.func.isRequired,
    sendBird: PropTypes.func.isRequired,
    applicationFormState: PropTypes.object,
    openApplicationForm: PropTypes.func.isRequired,
    allApplicationsRef: PropTypes.object.isRequired,
    userName: PropTypes.string.isRequired
};

export default ClientMainContent;