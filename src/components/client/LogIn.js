import React, {Component} from 'react';
import PropTypes from 'prop-types';
import '../../resource/styles/LogInForm.css'
import '../../resource/styles/Main.css'
import {Link} from "react-router-dom";

class LogIn extends Component {

    state = {
        userLogin: '',
        password: '',
        invalid: false
    };

    componentDidMount() {
        document.addEventListener('click', this.close, false);
        window.addEventListener('beforeunload', this.saveState, false)
    }

    saveState = () =>
        sessionStorage.setItem(
            'logInState',
            JSON.stringify({userLogin: this.state.userLogin, invalid: this.state.invalid})
        );


    componentWillUnmount() {
        document.removeEventListener('click', this.close, false);
        window.removeEventListener('beforeunload', this.saveState, false)
    }

    close = (e) => {
        if (e.target.className.indexOf('log-in-inside') === -1) {
            this.props.closeLogInForm();
        }
    };

    render() {
        return (
            <div
                id='log-in-form'
                className='log-in-inside'
            >

                {
                    this.props.userName === ''

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
                                        type='text'
                                        name='userLogin'
                                        className='log-in-input log-in-inside'
                                        onChange={e => this.handleInput(e)}
                                    />

                                    <input
                                        type='password'
                                        name='password'
                                        className='log-in-input log-in-inside'
                                        onChange={e => this.handleInput(e)}
                                    />

                                </div>

                            </div>

                            <div className='log-in-inside flex-100 btn-center'>

                                <button
                                    onClick={() => this.submitLogIn()}
                                    className='log-in-inside no-border-element transparent-element hover-text'
                                    id='submit-log-in'
                                >
                                    Войти
                                </button>

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
                                <button
                                    className='hover-text log-in-inside'
                                    onClick={() => this.props.logOut()}
                                >
                                    Выйти
                                </button>
                            </div>

                        </React.Fragment>
                }
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

                if (response === '') {
                    this.setState({
                        invalid: true
                    })
                } else {
                    const parsedResponse = JSON.parse(response);

                    const {firstName, lastName, roles, username, token} = parsedResponse;

                    const fullName = lastName + ' ' + firstName;

                    this.props.storeResponse(fullName, username, token, roles);
                }
            }
        };

        request.open('POST', 'http://siburarenda.publicvm.com/api/public/login', true);
        request.setRequestHeader('Content-Type', 'application/json');
        request.send(JSON.stringify({ username: this.state.userLogin, password: this.state.password }))
    };

    handleInput = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        })
    }
}

LogIn.propTypes = {
    closeLogInForm: PropTypes.func.isRequired,
    storeResponse: PropTypes.func.isRequired,
    userName: PropTypes.string.isRequired,
    logOut: PropTypes.func.isRequired
};

export default LogIn;