import React, {Component} from 'react';
import '../../resource/styles/SignUp.css'
import '../../resource/styles/Main.css'
import {connectServer} from "../../functional/ServerConnect";
import PropTypes from 'prop-types';
import {waiting} from "../../functional/Design";

class SignUp extends Component {

    constructor(props) {
        super(props);

        const sessionState = sessionStorage.getItem('SignUp');
        if (sessionState != null) {
            const sessionStateParsed = JSON.parse(sessionState);
            const {firstName, fatherName, surname, isOrg, orgName, email} = sessionStateParsed;
            this.state.firstName = firstName;
            this.state.fatherName = fatherName;
            this.state.surname = surname;
            this.state.isOrg = isOrg;
            this.state.orgName = orgName;
            this.state.email = email;
        }
    }

    state = {
        firstName: '',
        fatherName: '',
        surname: '',
        isOrg: 'false',
        orgName: '',
        email: '',
        password: '',
        oops: '',
        waiting: false
    };

    componentDidMount() {
        window.addEventListener('beforeunload', this.saveState, false);
    }

    saveState = () => {
        const {firstName, fatherName, surname, isOrg, orgName, email} = this.state;
        const toSave = {
            firstName: firstName,
            fatherName: fatherName,
            surname: surname,
            isOrg: isOrg,
            orgName: orgName,
            email: email
        };

        sessionStorage.setItem('SignUp', JSON.stringify(toSave));
    };

    componentWillUnmount() {
        window.removeEventListener('beforeunload', this.saveState, false);
    }

    render() {
        return (
            <div
                className='info-container'
                id='sign-up-page'
            >

                <h1>Регистрация</h1>

                <p
                    className='info-paragraph'
                >
                    Поля, помеченные <span className='red-star'>*</span>, обязательны к заполнению
                </p>

                <div
                    className='flex-100'
                    id='flex-for-sign-up'
                >
                    <div
                        className='block-col'
                    >

                        <p>Фамилия <span className='red-star'>*</span></p>

                        <p>Имя <span className='red-star'>*</span></p>

                        <p>Отчество (при наличии)</p>

                        <p>Вы представляете некую организацию?</p>

                        {
                            this.state.isOrg === 'true'
                                ?
                                <p>Организация, которую Вы представляете <span className='red-star'>*</span></p>
                                :
                                null
                        }

                        <p>Адрес электронной почты <span className='red-star'>*</span></p>

                        <p>Пароль <span className='red-star'>*</span></p>

                    </div>

                    <div
                        className='block-col'
                        id='sign-up-inputs'
                    >
                        <input
                            type='text'
                            name='surname'
                            onChange={e => this.handleInput(e)}
                            onKeyUp={e => this.handleKeyUp(e)}
                            defaultValue={this.state.surname}
                        />

                        <input
                            type='text'
                            name='firstName'
                            onChange={e => this.handleInput(e)}
                            onKeyUp={e => this.handleKeyUp(e)}
                            defaultValue={this.state.firstName}
                        />

                        <input
                            type='text'
                            name='fatherName'
                            onChange={e => this.handleInput(e)}
                            onKeyUp={e => this.handleKeyUp(e)}
                            defaultValue={this.state.fatherName}
                        />

                        <div className='flex-container'>

                            <input
                                type='radio'
                                id='yes-org-radio'
                                name='isOrg'
                                className='hidden-radio'
                                value={true}
                                onChange={e => this.handleInput(e)}
                                checked={this.state.isOrg === 'true'}
                            />
                            <label htmlFor='yes-org-radio'>
                            </label>
                            <label style={{marginRight: '28px'}}>Да</label>

                            <input
                                type='radio'
                                id='no-org-radio'
                                name='isOrg'
                                className='hidden-radio'
                                value={false}
                                onChange={e => this.handleInput(e)}
                                checked={this.state.isOrg === 'false'}
                            />
                            <label htmlFor='no-org-radio'>
                            </label>
                            <label>Нет</label>
                        </div>

                        {
                            this.state.isOrg === 'true'
                                ?
                                <input
                                    type='text'
                                    name='orgName'
                                    onChange={e => this.handleInput(e)}
                                    onKeyUp={e => this.handleKeyUp(e)}
                                    defaultValue={this.state.orgName}
                                />
                                :
                                null
                        }

                        <input
                            type='text'
                            name='email'
                            onChange={e => this.handleInput(e)}
                            onKeyUp={e => this.handleKeyUp(e)}
                            defaultValue={this.state.email}
                        />

                        <input
                            type='password'
                            name='password'
                            onChange={e => this.handleInput(e)}
                            onKeyUp={e => this.handleKeyUp(e)}
                        />

                        <div className='btn-pusher'>

                            {
                                this.state.waiting
                                    ?
                                    <div
                                        id='waiting-for-sign-up-confirm'
                                        className='waiting'
                                    >
                                        {''}
                                    </div>
                                    :
                                    <React.Fragment>

                                        {
                                            this.state.oops !== ''
                                                ?
                                                <div
                                                    className='warning'
                                                    id='w2'
                                                    onMouseEnter={e => this.props.showHint(e, this.state.oops)}
                                                    onMouseLeave={() => this.props.closeHint()}
                                                >
                                                </div>
                                                :
                                                null
                                        }

                                        <button
                                            className='hover-text no-border-element transparent-element'
                                            id='sign-up-btn'
                                            onClick={() => this.signUp()}
                                            disabled={this.sendDisabled()}
                                        >
                                            Зарегистрироваться
                                        </button>

                                    </React.Fragment>
                            }
                        </div>

                    </div>
                </div>

            </div>
        );
    }

    handleKeyUp = e => {
        if (e.which === 13) {

            const {firstName, surname, email, isOrg, orgName, password} = this.state;
            if (firstName !== '' && surname !== '' && email !== '' && (!isOrg || orgName !== '') && password !== '') {
                this.signUp();
            } else {
                const currentInput = e.target;
                const signUpInputs = document.getElementById('sign-up-inputs');
                const allInputs = signUpInputs.getElementsByTagName('input');
                let found = false;
                for (let i = 0; i < allInputs.length; i++) {
                    const inp = allInputs.item(i);

                    if (found && (inp.type === 'text' || inp.type === 'password') && inp.value === '') {
                        inp.focus();
                        break;
                    } else if (inp === currentInput) {

                        if (i === allInputs.length - 1) {
                            allInputs.item(0).focus();
                            break;
                        } else {
                            found = true;
                        }
                    }
                }
            }
        }
    };

    handleInput = (e) => {
        this.setState({
            [e.target.name]: e.target.value,
            oops: ['email', 'password'].includes(e.target.name) ? '' : this.state.oops
        })
    };

    signUp = () => {

        const {firstName, fatherName, surname, email, password, orgName, isOrg} = this.state;

        const toSend = JSON.stringify(
            {
                username: email,
                password: password,
                email: email,
                firstName: firstName + (fatherName === '' ? '' : ' ' + fatherName),
                lastName: surname,
                company: isOrg ? orgName : ''
            }
        );

        const headers = [{name: 'Content-Type', value: 'application/json'}];

        this.setState({
            waiting: true,
            oops: ''
        });
        setTimeout(() => waiting('waiting-for-sign-up-confirm'), 1);

        connectServer(
            toSend,
            this.onConnect,
            'post',
            headers,
            'api/public/register',
            this.onResponseError,
            this.onSendError
        )
    };

    onConnect = () => {
        const signUp = document.getElementById('sign-up-page');
        if (signUp != null) {
            this.setState({
                waiting: false,
                firstName: '',
                fatherName: '',
                surname: '',
                email: '',
                password: '',
                isOrg: 'false',
                orgName: ''
            });
            const inputs = signUp.getElementsByTagName('input');
            for (let i = 0; i < inputs.length; i++) {
                inputs.item(i).value = inputs.item(i).defaultValue;
            }

            const btn = document.getElementById('sign-up-btn');
            const top = btn.getBoundingClientRect().top + document.body.scrollTop - 18;
            const left = btn.getBoundingClientRect().left + document.body.scrollLeft + 49;
            this.props.sendBird('sign-up', left, top);
        }

        sessionStorage.removeItem('SignUp');
    };

    onResponseError = () => {
        this.setState({
            oops: 'responseError',
            waiting: false
        });
        document.getElementById('w2').style.transform = 'rotate(0deg)';
    };

    onSendError = () => {
        this.setState({
            oops: 'sendErrorSignUp',
            waiting: false
        });
        document.getElementById('w2').style.transform = 'rotate(0deg)';
    };

    sendDisabled = () => {
        const {firstName, surname, isOrg, orgName, email, password} = this.state;
        return firstName === '' || surname === '' || (isOrg === 'true' && orgName === '') || email === '' || password === '';
    }
}

SignUp.propTypes = {
    sendBird: PropTypes.func.isRequired,
    showHint: PropTypes.func.isRequired,
    closeHint: PropTypes.func.isRequired
};

export default SignUp;