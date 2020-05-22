import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Route} from 'react-router-dom';
import ApplicationsList from './ApplicationsList';
import {checkToken, connectServer} from '../../functional/ServerConnect';
import SentApplicationView from './SentApplicationView';

class AllApplications extends Component {

    state = {
        applications: [],
        oops: '',
        applicationsGot: false
    };

    componentDidMount() {
        sessionStorage.removeItem('SignUp');
        if (!this.state.applicationsGot && this.props.userLogin !== '') {
            this.getApplications();
        }
    }

    render() {
        const { userLogin, openApplicationForm, showHint, closeHint, sentApplicationRef } = this.props;
        const { oops, applications } = this.state;

        return (
            userLogin === ''
                ?
                <div
                    className='info-container'
                >
                    <p
                        className='info-paragraph'
                    >
                        Эта страница доступна к просмотру только авторизованным пользователям!
                    </p>
                </div>
                :
                <React.Fragment>

                    <Route
                        path='/applications'
                        exact
                        render={
                            props => (
                                <ApplicationsList
                                    {...props}
                                    oops={oops}
                                    applications={applications}
                                    openApplicationForm={openApplicationForm}
                                />
                            )
                        }
                    />

                    <Route
                        path='/applications/:id'
                        render={
                            props => (
                                <SentApplicationView
                                    {...props}
                                    applications={applications}
                                    openApplicationForm={openApplicationForm}
                                    showHint={showHint}
                                    closeHint={closeHint}
                                    ref={sentApplicationRef}
                                />
                            )
                        }
                    />

                </React.Fragment>
        );
    }

    getApplications = () => {
        const { userLogin, token, password } = this.props;
        checkToken(
            this.onTokenChecked,
            token,
            userLogin,
            password,
            () => this.onError('response'),
            () => this.onError('send')
        )
    };

    onTokenChecked = responseText => {
        const { token, userLogin, refreshToken } = this.props;
        let newToken = token;
        if (responseText !== 'true') {
            refreshToken(responseText);
            newToken = JSON.parse(responseText).token;
        }
        const headers = [
            { name: 'Authorization', value: 'Bearer_' + newToken },
            { name: 'Content-Type', value: 'application/json' }
        ];
        connectServer(
            null,
            this.onConnect,
            'get',
            headers,
            'api/user/events?username=' + userLogin,
            () => this.onError('response'),
            () => this.onError('send')
        )
    };

    onConnect = response => {
        const appArr = JSON.parse(response);
        this.setState({
            applications: appArr,
            applicationsGot: true
        });
    };

    onError = err => {
        this.setState({
            oops: err
        })
    };
}

AllApplications.propTypes = {
    token: PropTypes.string.isRequired,
    userLogin: PropTypes.string.isRequired,
    refreshToken: PropTypes.func.isRequired,
    password: PropTypes.string.isRequired, //TODO: Security!
    openApplicationForm: PropTypes.func.isRequired,
    showHint: PropTypes.func.isRequired,
    closeHint: PropTypes.func.isRequired,
    sentApplicationRef: PropTypes.object.isRequired
};

export default AllApplications;