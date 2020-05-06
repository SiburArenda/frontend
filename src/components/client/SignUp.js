import React, {Component} from 'react';
import PropTypes from 'prop-types';
import '../../resource/styles/SignUp.css'
import '../../resource/styles/Main.css'

class SignUp extends Component {

    state = {
        firstName: '',
        fatherName: '',
        surname: '',
        isOrg: 'false',
        orgName: '',
        email: '',
        password: ''
    };

    render() {
        return (
            <div
                className='info-container'
            >

                <h1>Регистрация</h1>

                <p>Поля, помеченные <span className='red-star'>*</span>, обязательны к заполнению</p>

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
                    >
                        <input
                            type='text'
                            name='surname'
                            onChange={e => this.handleInput(e)}
                        />

                        <input
                            type='text'
                            name='firstName'
                            onChange={e => this.handleInput(e)}
                        />

                        <input
                            type='text'
                            name='fatherName'
                            onChange={e => this.handleInput(e)}
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
                                    defaultValue={this.state.orgName}
                                />
                                :
                                null
                        }

                        <input
                            type='email'
                            name='email'
                            onChange={e => this.handleInput(e)}
                        />

                        <input
                            type='password'
                            name='password'
                            onChange={e => this.handleInput(e)}
                        />

                        <div className='btn-pusher'>
                            <button
                                className='hover-text no-border-element transparent-element'
                                id='sign-up-btn'
                                onClick={() => this.signUp()}
                            >
                                Зарегистрироваться
                            </button>
                        </div>

                    </div>
                </div>

            </div>
        );
    }

    handleInput = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        })
    };

    signUp = () => {
        const request = new XMLHttpRequest();

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

        request.onreadystatechange = function () {
            if (request.readyState === 4) {
                console.log('OK!');
            }
        };

        request.open('POST', 'http://siburarenda.publicvm.com/api/public/register', true);
        request.setRequestHeader('Content-Type', 'application/json');
        request.send(toSend)
    }
}

SignUp.propTypes = {};

export default SignUp;