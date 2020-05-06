import React, {Component} from 'react';
import PropTypes from 'prop-types';
import '../../resource/styles/LogInForm.css'
import '../../resource/styles/Main.css'

class LogIn extends Component {

    state = {
        userLogin: '',
        password: '',
        invalid: false
    };

    componentDidMount() {
        document.addEventListener('click', this.close, false);
    }

    componentWillUnmount() {
        document.removeEventListener('click', this.close, false);
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
                        <div
                            className='log-in-inside'
                            style={{display: 'flex'}}
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

                                <div className='log-in-inside btn-pusher'>

                                    <button
                                        onClick={() => this.submitLogIn()}
                                        className='log-in-inside no-border-element transparent-element hover-text'
                                        id='submit-log-in'
                                    >
                                        Войти
                                    </button>

                                </div>

                            </div>

                        </div>

                        :

                        <React.Fragment>

                            <p>Вы вошли как {this.props.userName}</p>

                            <button className='hover-text log-in-inside'>
                                Мои заявки
                            </button>

                            <button className='hover-text log-in-inside'>
                                Редактировать профиль
                            </button>

                            <button className='hover-text log-in-inside'>
                                Выйти
                            </button>

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

                    const fullName = firstName + ' ' + lastName;

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
    userName: PropTypes.string.isRequired
};

export default LogIn;