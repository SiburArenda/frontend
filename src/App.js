import React, {Component} from 'react';
import {BrowserRouter as Router} from "react-router-dom"
import './resource/styles/Main.css'
import ClientNavList from "./components/client/ClientNavList";
import AdminNavList from "./components/admin/AdminNavList";
import ClientMainContent from "./components/client/ClientMainContent";
import AdminMainContent from "./components/admin/AdminMainContent";
import Hint from "./components/client/Hint";
import LogIn from "./components/client/LogIn";

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
            if (len < split.length) {
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

    constructor(props) {
        super(props);

        this.appFormRef = React.createRef();

        const screen = window.innerWidth;
        this.state.headerWidth =  screen > 1200 ? screen - 20 : 1430
    }

    state = {
        logInFormVisible: false,
        applicationFormVisible: false,
        showHint: false,
        whichHint: '',
        hintHPos: 8,
        hintVPos: 8,
        hintX: 0,
        hintY: 0,
        roomArray: [],
        headerWidth: 1430,
        userLogin: '',
        userName: '',
        token: '',
        role: 'USER'
    };

    headerWidth = () => {
        const screen = window.innerWidth;
        this.setState({
            headerWidth: screen > 1090 ? screen - 20 : 1430
        })
    };

    componentDidMount() {

        window.addEventListener('resize', this.headerWidth, false);

        const request = new XMLHttpRequest();

        request.onreadystatechange = () => {
            if (request.readyState === 4) {

                const pureResponse = JSON.parse(request.responseText);
                const roomArray = [];

                for (let roomIndex in pureResponse) {

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
                    for (let i in roomArray) {
                        if (roomArray[i].name === name) {
                            roomArray[i].increaseAmount();
                            add = true;
                        }
                    }

                    if (!add) {
                        const description = roomObj.description;

                        const tags = roomObj.tags.slice(0, roomObj.tags.length - 1);

                        const isAdditionTo = roomObj.tags[roomObj.tags.length - 1];

                        const newRoomInfo = new RoomInfo(serverName, name, auditory, description, tags, isAdditionTo);
                        roomArray.push(newRoomInfo);
                    }

                }

                this.setState({
                    roomArray: roomArray
                })
            }
        };

        request.open('GET', 'http://siburarenda.publicvm.com/api/public/rooms', true);
        request.setRequestHeader('Content-Type', 'application/json');
        request.send(null)
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.headerWidth, false);
    }

    getHintText = () => {

        const whichHint = this.state.whichHint;

        if (whichHint.startsWith('trainingArena')) {
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

        if (whichHint.startsWith('roomAmount')) {
            const split = whichHint.split('%');
            return `Таких помещений в комплексе ${split[1]}, на данный момент в Вашу заявку об аренде включены ${split[2]} из них`
        }

        if (whichHint.startsWith('notFilled')) {
            const split = whichHint.split(/%/g).filter(tag => tag !== '');

            let message = '<p>Пожалуйста, исправьте следующие ошибки:</p>';

            for (let i = 1; i < split.length; i++) {
                const tag = split[i];

                if (tag.startsWith('timings')) {

                    const t = tag.split('->')[1].split('&').filter(p => p !== '');

                    message += '<p>- Для следующих дат некорректно указаны временные рамки:' + t.toString() + '</p>';

                } else {
                    // eslint-disable-next-line default-case
                    switch (tag) {
                        case 'name': {
                            message += '<p>- Не введено название мероприятия</p>';
                            break;
                        }
                        case 'viewers': {
                            message += '<p>- Не указано количество зрителей\n</p>';
                            break;
                        }
                        case 'days': {
                            message += '<p>- Не выбрано ни одной даты</p>';
                            break;
                        }
                        case 'rooms': {
                            message += '<p>- Не выбрано ни одного помещения</p>';
                            break;
                        }
                    }
                }
            }

            return message;
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
            case 'logIn':
                return this.state.userName === '' ? 'Войти' : 'Мой аккаунт';
            default:
                return '';
        }
    };

    showHint = (e, which) => {
        const textLength = this.getHintText().length * 7 + 5;
        const length = textLength < 250 ? textLength : 260;
        const width = window.innerWidth;
        const height = window.innerHeight;
        const vPos = +e.clientY + 95 <= height ? 8 : -95;
        const hPos = +e.clientX + length <= width ? 8 : -length;
        this.setState({
            showHint: true,
            whichHint: which,
            hintX: +e.clientX,
            hintY: +e.clientY,
            hintHPos: hPos,
            hintVPos: vPos
        })
    };

    closeHint = () => {
        this.setState({
            showHint: false
        })
    };

    render() {
        const scroll = !window.screenTop && !window.screenY ? 'hidden' : 'scroll';
        return (
            <div style={{overflowX: {scroll}}}>
                <Router>

                    <header style={{width: this.state.headerWidth}}>

                        <button
                            id='open-log-in-button'
                            onClick={() => this.openLogInForm()}
                            onMouseEnter={e => this.showHint(e, 'logIn')}
                            onMouseLeave={() => this.closeHint()}
                        >
                        </button>

                        {this.state.logInFormVisible
                            ?
                            <LogIn
                                closeLogInForm={this.closeLogInForm}
                                storeResponse={this.storeResponse}
                                userName={this.state.userName}
                            />
                            :
                            null
                        }

                    </header>

                    <nav>
                        <div
                            id='sibur-logo-container'
                        >
                            <img
                                src='http://siburarenda.publicvm.com/img/logo.svg'
                                alt='logo'
                            />
                        </div>
                        <ul>
                            {
                                this.state.role === 'USER'
                                    ?
                                    <ClientNavList
                                        openApplicationForm={this.openApplicationForm}
                                        showHint={this.showHint}
                                        closeHint={this.closeHint}
                                        appFormRef={this.appFormRef}
                                    />
                                    :
                                    <AdminNavList/>
                            }
                        </ul>
                        <div
                            id='triangle'
                        >
                        </div>
                    </nav>

                    <section id='main-content'>
                        {
                            this.state.role === 'USER'
                                ?
                                <ClientMainContent
                                    logInFormVisible={this.state.logInFormVisible}
                                    applicationFormVisible={this.state.applicationFormVisible}
                                    closeLogInForm={this.closeLogInForm}
                                    closeAppWindow={this.closeApplicationForm}
                                    showHint={this.showHint}
                                    closeHint={this.closeHint}
                                    roomArray={this.state.roomArray}
                                    appFormRef={this.appFormRef}
                                    userLogin={this.state.userLogin}
                                    token={this.state.token}
                                />
                                :
                                <AdminMainContent/>
                        }

                        {this.state.showHint
                            ?
                            <Hint
                                hintText={this.getHintText()}
                                x={this.state.hintX}
                                y={this.state.hintY}
                                hintHPos={this.getHintText().length > 8 ? this.state.hintHPos : 8}
                                hintVPos={this.state.hintVPos}
                            />
                            : null
                        }

                    </section>

                </Router>
            </div>
        );
    }

    openApplicationForm = () => {
        this.setState({
            applicationFormVisible: true
        })
    };

    openLogInForm = () => {
        this.closeHint();
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

    storeResponse = (userName, userLogin, token, roles) => {
        const role = roles.includes('USER') ? 'USER' : 'ADMIN';
        this.setState({
            userLogin: userLogin,
            userName: userName,
            token: token,
            role: role
        })
    };
}

export default App;
