import React, {Component} from 'react';
import '../../resource/styles/SignUp.css'
import '../../resource/styles/Main.css'
import {connectServer} from '../../functional/ServerConnect';
import PropTypes from 'prop-types';
import {inputsToDefaults, waiting} from '../../functional/Design';

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
        const { firstName, fatherName, surname, isOrg, orgName, email } = this.state;
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

        const { edit, closeHint, showHint, userLogin, userName } = this.props; //TODO: orgName!
        const { isOrg, orgName, email, surname, firstName, fatherName, waiting, oops } = this.state;

        if (edit && userLogin === '') {
            return (
                <div
                    className='info-container'
                >
                    <p
                        className='info-paragraph'
                    >
                        Эта страница доступна к просмотру только авторизованным пользователям!
                    </p>
                </div>
            )
        }

        const split = edit ? userName.split(' ') : null;
        const prevSurname = edit ? split[0] : null;
        const prevFirstName = edit ? split[1] : null;
        const prevFatherName = edit && split != null && split.length === 3 ? split[2] : null;

        return (
            <div
                className='info-container'
                id='sign-up-page'
            >

                <h1>
                    {
                        edit
                            ?
                            'Редактирование профиля'
                            :
                            'Регистрация'
                    }
                </h1>

                {
                    edit
                        ?
                        null
                        :
                        <p
                            className='info-paragraph'
                        >
                            Поля, помеченные <span className='red-star'>*</span>, обязательны к заполнению
                        </p>
                }

                <div
                    className='flex-100'
                    id='flex-for-sign-up'
                >
                    <div
                        className='block-col'
                    >

                        <p>
                            Фамилия
                            {
                                edit
                                    ?
                                    null
                                    :
                                    <span className='red-star'>*</span>
                            }
                        </p>

                        <p>
                            Имя
                            {
                                edit
                                    ?
                                    null
                                    :
                                    <span className='red-star'>*</span>
                            }
                        </p>

                        <p>Отчество (при наличии)</p>

                        <p>Вы представляете некую организацию?</p>

                        {
                            isOrg === 'true'
                                ?
                                <p>
                                    Организация, которую Вы представляете
                                    {
                                        edit
                                            ?
                                            null
                                            :
                                            <span className='red-star'>*</span>
                                    }
                                </p>
                                :
                                null
                        }

                        <p>
                            Адрес электронной почты
                            {
                                edit
                                    ?
                                    null
                                    :
                                    <span className='red-star'>*</span>
                            }
                        </p>

                        <p>
                            Пароль
                            {
                                edit
                                    ?
                                    null
                                    :
                                    <span className='red-star'>*</span>
                            }
                        </p>

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
                            defaultValue={surname || prevSurname}
                        />

                        <input
                            type='text'
                            name='firstName'
                            onChange={e => this.handleInput(e)}
                            onKeyUp={e => this.handleKeyUp(e)}
                            defaultValue={firstName || prevFirstName}
                        />

                        <input
                            type='text'
                            name='fatherName'
                            onChange={e => this.handleInput(e)}
                            onKeyUp={e => this.handleKeyUp(e)}
                            defaultValue={fatherName || prevFatherName}
                        />

                        <div className='flex-container'>

                            <input
                                type='radio'
                                id='yes-org-radio'
                                name='isOrg'
                                className='hidden-radio'
                                value={true}
                                onChange={e => this.handleInput(e)}
                                checked={isOrg === 'true'}
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
                                checked={isOrg === 'false'}
                            />
                            <label htmlFor='no-org-radio'>
                            </label>
                            <label>Нет</label>
                        </div>

                        {
                            isOrg === 'true'
                                ?
                                <input
                                    type='text'
                                    name='orgName'
                                    onChange={e => this.handleInput(e)}
                                    onKeyUp={e => this.handleKeyUp(e)}
                                    defaultValue={orgName} //TODO: orgName!
                                />
                                :
                                null
                        }

                        <input
                            type='text'
                            name='email'
                            onChange={e => this.handleInput(e)}
                            onKeyUp={e => this.handleKeyUp(e)}
                            defaultValue={email || userLogin}
                        />

                        <input
                            type='password'
                            name='password'
                            onChange={e => this.handleInput(e)}
                            onKeyUp={e => this.handleKeyUp(e)}
                            defaultValue={''}
                        />

                        <div className='btn-pusher'>

                            {
                                waiting
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
                                            edit
                                                ?
                                                <button
                                                    onClick={() => this.clearEdits()}
                                                    onMouseEnter={e => showHint(e, 'clearAccEdit')}
                                                    onMouseLeave={() => closeHint()}
                                                    className='hover-text no-border-element transparent-element'
                                                >
                                                    Сбросить
                                                </button>
                                                :
                                                null
                                        }

                                        {
                                            oops !== ''
                                                ?
                                                <div
                                                    className='warning'
                                                    id='w2'
                                                    onMouseEnter={e => showHint(e, oops)}
                                                    onMouseLeave={() => closeHint()}
                                                >
                                                </div>
                                                :
                                                <div
                                                    className='empty-warning'
                                                >
                                                    {''}
                                                </div>
                                        }

                                        <button
                                            className='hover-text no-border-element transparent-element'
                                            id='sign-up-btn'
                                            onClick={() => this.signUp()}
                                            disabled={this.sendDisabled()}
                                        >
                                            {
                                                edit
                                                    ?
                                                    'Сохранить изменения'
                                                    :
                                                    'Зарегистрироваться'
                                            }
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
            const { firstName, surname, email, isOrg, orgName, password } = this.state;

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

    handleInput = e => {
        this.setState({
            [e.target.name]: e.target.value,
            oops: ['email', 'password'].includes(e.target.name) ? '' : this.state.oops
        })
    };

    signUp = () => {

        const { firstName, fatherName, surname, email, password, orgName, isOrg } = this.state;

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

        const headers = [{ name: 'Content-Type', value: 'application/json' }];

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
        if (this.props.edit){
            return false;
        }
        const { firstName, surname, isOrg, orgName, email, password } = this.state;
        return firstName === '' || surname === '' || (isOrg === 'true' && orgName === '') || email === '' || password === '';
    };

    clearEdits = () => {
        this.props.closeHint();
        const { userLogin, userName } = this.props; //TODO: orgName!
        const split = userName.split(' ');
        this.setState({
            firstName: split[1],
            fatherName: split.length === 3 ? split[2] : '',
            surname: split[0],
            email: userLogin,
            oops: ''
        });
        inputsToDefaults(['input'], 'sign-up-page')
    }
}

SignUp.defaultProps = {
    edit: false
};

SignUp.propTypes = {
    sendBird: PropTypes.func.isRequired,
    showHint: PropTypes.func.isRequired,
    closeHint: PropTypes.func.isRequired,
    edit: PropTypes.bool,
    userName: PropTypes.string,
    userLogin: PropTypes.string
};

export default SignUp;