import React, {Component} from 'react';
import PropTypes from 'prop-types';
import '../../resource/styles/LogInForm.css'
import '../../resource/styles/Main.css'
import {Link} from "react-router-dom";
import {connectServer} from "../../functional/ServerConnect";
import {waiting} from "../../functional/Design";

class LogIn extends Component {

    constructor(props) {
        super(props);

        const sessionState = sessionStorage.getItem('LogIn');
        if (sessionState != null) {
            this.state.userLogin = sessionState;
        }
    }

    state = {
        userLogin: '',
        password: '',
        invalid: false,
        waiting: false
    };

    componentDidMount() {
        document.addEventListener('click', this.close, false);
        window.addEventListener('beforeunload', this.saveState, false);
    }

    saveState = () => sessionStorage.setItem('LogIn', this.state.userLogin);

    close = e => {
        if (e.target.className.indexOf('log-in-inside') === -1) {
            this.saveState();
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

                                {
                                    waiting
                                        ?
                                        <div
                                            id='waiting-for-log-in'
                                            className='waiting log-in-inside'
                                        >
                                            {''}
                                        </div>
                                        :
                                        <React.Fragment>
                                            {
                                                invalid
                                                    ?
                                                    <div
                                                        id='w'
                                                        className='warning log-in-inside'
                                                        onMouseEnter={e => this.props.showHint(e, 'invalidLogIn')}
                                                        onMouseLeave={() => this.props.closeHint()}
                                                    >
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
                                        </React.Fragment>
                                }


                            </div>

                            <Link
                                to='/signUp'
                                className='turquoise-hover log-in-inside'
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
        this.props.storePassword(this.state.password);
        this.setState({
            waiting: true
        });
        setTimeout(() => waiting('waiting-for-log-in'), 1);
        connectServer(
            toSend,
            this.onResponse,
            'post',
            headers,
            url,
            this.error,
            this.error
        );
    };

    error = () => {
        if (document.getElementById('log-in-form') != null) {
            this.setState({
                invalid: true,
                waiting: false
            });
            document.getElementById('w').style.transform = 'rotate(0deg)';
        }
    };

    onResponse = response => {
        const parsedResponse = JSON.parse(response);

        const {firstName, lastName, roles, username, token, id} = parsedResponse;

        const fullName = lastName + ' ' + firstName;

        const stillVisible = document.getElementById('log-in-form') != null;

        this.props.storeResponse(fullName, username, token, roles, id);
        //TODO: Security!

        if (stillVisible) {
            this.setState({
                password: '',
                userLogin: '',
                waiting: false,
                invalid: false
            });
        }
    };

    handleInput = (e) => {
        this.setState({
            [e.target.name]: e.target.value,
            invalid: false
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
    closeHint: PropTypes.func.isRequired,
    storePassword: PropTypes.func.isRequired //TODO: Security!
};

export default LogIn;