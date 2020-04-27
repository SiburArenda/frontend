import React, {Component} from 'react';
import {BrowserRouter as Router, Route, Link} from "react-router-dom"
import './resource/styles/Main.css'
import ClientNavList from "./components/client/ClientNavList";
import AdminNavList from "./components/admin/AdminNavList";
import ClientMainContent from "./components/client/ClientMainContent";
import AdminMainContent from "./components/admin/AdminMainContent";
import Hint from "./components/client/Hint";

class RoomInfo {
    constructor(serverName, name, auditory, description, tags, isAdditionTo) {
        this.serverName = serverName;
        this.name = name;
        this.auditory = auditory;
        this.description = description;
        this.tags = tags;
        this.isAdditionTo = isAdditionTo === '-1' ? 'independent' : isAdditionTo;
        this.amount = 1;
    }

    increaseAmount = () => this.amount += 1;

    getURL = (len = -1) => {
        if (this.name.startsWith('VIP')) {
            return 'VIP_ложи'
        }
        if (len !== -1) {
            const split = this.name.split(' ');
            if (len < split.length)
            {
                let urlName = '';
                for (let i = 0; i < len; i++) {
                    urlName += split[i] + (i === len - 1 ? '' : '_')
                }
                return urlName;
            }
        }
        return this.name.replace(/ /g, '_');
    }
}

class App extends Component {

    state = {
        logInFormVisible: false,
        applicationFormVisible: false,
        showHint: false,
        whichHint: '',
        hintX: 0,
        hintY: 0
    };

    static roomArray = [];

    componentDidMount() {
        const request = new XMLHttpRequest();

        request.onreadystatechange = function () {
            if (request.readyState === 4) {

                const pureResponse = JSON.parse(request.responseText);

                for (let roomIndex in pureResponse){

                    const roomObj = pureResponse[roomIndex];

                    const priorName = roomObj.name;
                    let name = '';
                    let serverName = '';
                    if (priorName.indexOf('#') !== -1) {
                        const splitSpace = priorName.split(' ');
                        name = `${splitSpace[0]} ${splitSpace[1]}`;
                        const splitHash = priorName.split(' #');
                        serverName = splitHash[0];
                    } else {
                        name = priorName;
                        serverName = priorName;
                    }

                    const auditory = roomObj.auditory === -1 ? 0 : roomObj.auditory;
                    if (name === 'VIP ложи') {
                        name += ` на ${auditory} персон`
                    }

                    let add = false;
                    for (let i in App.roomArray) {
                        if (App.roomArray[i].name === name) {
                            App.roomArray[i].increaseAmount();
                            add = true;
                        }
                    }

                    if (!add) {
                        const description = roomObj.description;

                        const tags = roomObj.tags.slice(0, roomObj.tags.length - 1);

                        const isAdditionTo = roomObj.tags[roomObj.tags.length - 1];

                        const newRoomInfo = new RoomInfo(serverName, name, auditory, description, tags, isAdditionTo);
                        App.roomArray.push(newRoomInfo);
                    }

                }
            }
        };

        request.open('GET', 'http://siburarenda.publicvm.com/api/public/rooms', true);
        request.setRequestHeader('Content-Type', 'application/json');
        request.send(null)
    }

    getHintText = () => {

        const whichHint = this.state.whichHint;

        if (whichHint.startsWith('trainingArena')){
            const split = whichHint.split('%');
            let hintText = 'Тренировочная арена состоит из двух одинаковых баскетбольных площадок. Включить в заявку об аренде ';
            return hintText + (split[1] === 'half' ? 'только одну из них?' : 'обе части?')
        }

        if (whichHint.startsWith('fullName&')) {
            return whichHint.substring(9)
        }

        if (whichHint.startsWith('interval')) {
            const split = whichHint.split('%');
            return `Пожалуйста, введите число от ${split[1]} до ${split[2]}`;
        }

        if(whichHint.startsWith('roomAmount')) {
            const split = whichHint.split('%');
            return `Таких помещений в комплексе ${split[1]}, на данный момент в Вашу заявку об аренде включены ${split[2]} из них`
        }

        switch (whichHint) {
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
            case 'goToRooms':
                return 'Открыть параллельно с формой заявки раздел "Помещения" с подробной информацией о каждом из них';
            case 'exactRoomAbout':
                return 'Перейти к странице с описанием данного помещения';
            case 'plus':
                return 'Увеличить количество';
            case 'minus':
                return 'Уменьшить количество';
            case 'searchRooms':
                return 'Поиск';
            case 'backToRooms':
                return 'К списку помещений';
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
                            render={
                                (props) => (
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
                                        roomArray={App.roomArray}
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
