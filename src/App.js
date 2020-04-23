import React, {Component} from 'react';
import {BrowserRouter as Router, Route, Link} from "react-router-dom"
import './resource/styles/Main.css'
import ClientNavList from "./components/client/ClientNavList";
import AdminNavList from "./components/admin/AdminNavList";
import ClientMainContent from "./components/client/ClientMainContent";
import AdminMainContent from "./components/admin/AdminMainContent";
import Hint from "./components/client/Hint";

class App extends Component {

    state = {
        logInFormVisible: false,
        applicationFormVisible: false,
        showHint: false,
        whichHint: '',
        hintX: 0,
        hintY: 0
    };

    getHintText = () => {

        if (this.state.whichHint.startsWith('fullName&')) {
            return this.state.whichHint.substring(9)
        }

        if (this.state.whichHint.startsWith('interval')) {
            const split = this.state.whichHint.split('%');
            return `Пожалуйста, введите число от ${split[1]} до ${split[2]}`;
        }

        switch (this.state.whichHint) {
            case 'closeAppFormBtn':
                return 'Если Вы закроете неотправленную заявку, введённая информация не сохранится';
            case 'minAppFormBtn':
                return 'Свернуть';
            case 'expAppFormBtn':
                return 'Открыть форму';
            case 'openAppFormBtn':
                return 'Окно заполнения заявки откроется параллельно с остальным содержимым сервиса' +
                    ' - Вы сможете переходить по разделам, не закрывая его и не заполняя заново!';
            case 'sendAppBtn':
                return 'Заявка будет отправлена, но Вы всегда сможете отредактировать её:' +
                    ' просто отыщите её в Отправленных Заявках в Вашем профиле';
            case 'intPosNum':
                return 'Пожалуйста, введите целое положительное число';
            case 'clearCalendar':
                return 'Все выбранные даты и временные рамки для них будут сброшены';
            case 'timeSet':
                return 'Установить временные рамки для этой даты';
            case 'timeSelOK':
                return 'Введённые временные рамки уже сохранены -' +
                    ' эта кнопка просто скроет этот диалог, чтобы он Вам не мешал!';
            case 'forAllCheck':
                return 'Пока Вы настраиваете временные рамки для выбранной сейчас даты, это действие можно' +
                    ' будет отменить; как только Вы переключитесь на другую дату, значения сохранятся';
            default:
                return '';
        }
    };

    showHint = (e, which) => {
        this.setState({
            showHint: true,
            whichHint: which,
            hintX: +e.clientX,
            hintY: +e.clientY
        })
    };

    closeHint = () => {
        this.setState({
            showHint: false
        })
    };

    render() {
        return (
            <Router>

                <header>
                    <Route
                        path={/^\/(?!admin).*/}
                        render=
                            {
                                () => (
                                    <button
                                        id='open-log-in-button'
                                        onClick={() => {
                                            this.openLogInForm()
                                        }}>Войти
                                    </button>
                                )
                            }
                    />
                    <Link to='/admin'>Войти как администратор</Link>
                </header>

                <nav>
                    <ul id='main-nav'>
                        <Route
                            path={/^\/(?!admin).*/}
                            render={(props) => (
                                <ClientNavList
                                    {...props}
                                    openApplicationForm={this.openApplicationForm}
                                    showHint={this.showHint}
                                    closeHint={this.closeHint}
                                />
                                )
                            }
                        />
                        <Route
                            path='/admin'
                            render={(props) => (<AdminNavList {...props}/>)}
                        />
                    </ul>
                </nav>

                <section id='main-content'>
                    <Route
                        path={/^\/(?!admin).*/}
                        render=
                            {
                                (props) => (
                                    <ClientMainContent
                                        {...props}
                                        logInFormVisible={this.state.logInFormVisible}
                                        applicationFormVisible={this.state.applicationFormVisible}
                                        closeLogInForm={this.closeLogInForm}
                                        closeAppWindow={this.closeApplicationForm}
                                        showHint={this.showHint}
                                        closeHint={this.closeHint}
                                    />
                                )
                            }
                    />
                    <Route
                        path='/admin'
                        render=
                            {
                                (props) => (
                                    <AdminMainContent
                                        {...props}
                                    />
                                )
                            }
                    />
                    {this.state.showHint
                        ?
                        <Hint
                            hintText={this.getHintText()}
                            x={this.state.hintX}
                            y={this.state.hintY}
                        />
                        : null
                    }
                </section>

            </Router>
        );
    }

    openApplicationForm = () => {
        this.setState({
            applicationFormVisible: true
        })
    };

    openLogInForm = () => {
        this.setState({
            logInFormVisible: true
        })
    };

    closeApplicationForm = () => {
        this.setState({
            applicationFormVisible: false
        })
    };

    closeLogInForm = () => {
        this.setState({
            logInFormVisible: false
        })
    };
}

export default App;
