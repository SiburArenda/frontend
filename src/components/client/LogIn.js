import React, {Component} from 'react';
import PropTypes from 'prop-types';
import '../../resource/styles/LogInForm.css'
import '../../resource/styles/Main.css'
import {Link} from "react-router-dom";
import {connectDatabase} from "../../functional/Database";
import {connectServer} from "../../functional/ServerConnect";

class LogIn extends Component {

    constructor(props) {
        super(props);

        connectDatabase(['LogInForm'], 'get', this.setInitState)
    }

    setInitState = dbData => {
        if (dbData !== undefined) {
            const {userLogin, invalid} = dbData;
            // eslint-disable-next-line react/no-direct-mutation-state
            this.state.userLogin = userLogin;
            // eslint-disable-next-line react/no-direct-mutation-state
            this.state.invalid = invalid;
        }
    };

    state = {
        userLogin: '',
        password: '',
        invalid: false,
        waiting: false,
        waitingRotation: 0
    };

    componentDidMount() {
        document.addEventListener('click', this.close, false);
        window.addEventListener('beforeunload', this.saveState, false)
    }

    saveState = () =>
        connectDatabase(
            [
                {
                    componentName: 'LogInForm',
                    userLogin: this.state.userLogin,
                    invalid: this.state.invalid
                }
                ],
            'put'
        );

    close = (e) => {
        if (e.target.className.indexOf('log-in-inside') === -1) {
            this.props.closeLogInForm();
        }
    };

    componentWillUnmount() {
        document.removeEventListener('click', this.close, false);
        window.removeEventListener('beforeunload', this.saveState, false)
    }

    render() {

        const {userName} = this.props;
        const {userLogin, password, invalid, waiting} = this.state;

        return (
            <div
                id='log-in-form'
                className='log-in-inside'
            >

                {
                    userName === ''

                        ?

                        <React.Fragment>

                            <div
                                className='log-in-inside flex-100'
                            >

                                <div
                                    id='left'
                                    className='log-in-inside'
                                >
                                    <p
                                        className='what-to-enter log-in-inside'
                                    >
                                        E-mail
                                    </p>
                                    <p
                                        className='what-to-enter log-in-inside'
                                    >
                                        Пароль
                                    </p>
                                </div>

                                <div
                                    id='right'
                                    className='log-in-inside'
                                >

                                    <input
                                        id='userLogin'
                                        type='text'
                                        name='userLogin'
                                        className='log-in-input log-in-inside'
                                        onChange={e => this.handleInput(e)}
                                        onKeyUp={e => this.handleKeyUp(e)}
                                        defaultValue={userLogin}
                                    />

                                    <input
                                        id='password'
                                        type='password'
                                        name='password'
                                        className='log-in-input log-in-inside'
                                        onKeyUp={e => this.handleKeyUp(e)}
                                        onChange={e => this.handleInput(e)}
                                    />

                                </div>

                            </div>

                            <div className='log-in-inside flex-100 btn-center'>

                                <div
                                    style={{display: 'flex'}}
                                >

                                    {
                                        invalid
                                            ?
                                            <div
                                                className='warning'
                                                onMouseEnter={e => this.props.showHint(e, 'invalidLogIn')}
                                                onMouseLeave={() => this.props.closeHint()}
                                            >
                                            </div>
                                            :
                                            <div
                                                className='empty-warning'
                                            >
                                                {''}
                                            </div>
                                    }

                                    {
                                        waiting
                                            ?
                                            <div
                                                id='waiting-for-log-in'
                                                className='waiting'
                                            >
                                                {''}
                                            </div>
                                            :
                                            null
                                    }

                                    <button
                                        onClick={() => this.submitLogIn()}
                                        className='log-in-inside no-border-element transparent-element hover-text'
                                        id='submit-log-in'
                                        disabled={userLogin === '' || password === ''}
                                    >
                                        Войти
                                    </button>

                                </div>

                            </div>

                            <Link
                                to='/signUp'
                                className='turquoise-hover'
                            >
                                У меня ещё нет аккаунта
                            </Link>

                        </React.Fragment>

                        :

                        <React.Fragment>

                            <p style={{marginBottom: '10px'}}>Вы вошли как {this.props.userName}</p>

                            <Link
                                to='/applications'
                                className='hover-text log-in-inside'
                            >
                                Мои заявки
                            </Link>

                            <Link
                                to='/accountSettings'
                                className='hover-text log-in-inside'
                            >
                                Редактировать профиль
                            </Link>

                            <div className='log-in-inside flex-100 btn-center'>
                                <Link
                                    className='hover-text log-in-inside'
                                    onClick={() => this.props.logOut()}
                                    to={this.getLinkForLogOut()}
                                >
                                    Выйти
                                </Link>
                            </div>

                        </React.Fragment>
                }
            </div>
        );
    }

    submitLogIn = () => {

        const toSend = JSON.stringify({ username: this.state.userLogin, password: this.state.password });
        const headers = [{name: 'Content-Type', value: 'application/json'}];
        const url = 'api/public/login';
        document.getElementById('submit-log-in').disabled = true;
        this.setState({
            waiting: true
        });

        connectServer(toSend, this.onResponse, 'post', headers, url, this.waiting);
    };

    onResponse = response => {
        if (response === '') {
            this.setState({
                invalid: true
            })
        } else {
            const parsedResponse = JSON.parse(response);

            const {firstName, lastName, roles, username, token, id} = parsedResponse;

            const fullName = lastName + ' ' + firstName;

            this.props.storeResponse(fullName, username, token, roles, id);

            this.setState({
                password: '',
                userLogin: '',
                waiting: false
            })
        }
    };

    waiting = () => {
        const waitIcon = document.getElementById('waiting-for-log-in');
        console.log(waitIcon);
    };

    handleInput = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        })
    };

    handleKeyUp = (e) => {
        const code = e.which;
        const target = e.target.name;
        const {password, userLogin} = this.state;
        if (code === 13) {
            if (password !== '' && userLogin !== '') {
                this.submitLogIn();
            } else {

                const toFocus = target === 'password' ? 'userLogin' : 'password';
                document.getElementById(toFocus).focus();

            }
        }
    };

    getLinkForLogOut = () => {
        const currentURL = window.location.pathname;
        return (['/applications', '/accountSetting'].includes(currentURL)) ? '' : currentURL;
    }
}

LogIn.propTypes = {
    closeLogInForm: PropTypes.func.isRequired,
    storeResponse: PropTypes.func.isRequired,
    userName: PropTypes.string.isRequired,
    logOut: PropTypes.func.isRequired,
    showHint: PropTypes.func.isRequired,
    closeHint: PropTypes.func.isRequired
};

export default LogIn;