/* eslint-disable react/no-direct-mutation-state */
import React, {Component} from 'react';
import {BrowserRouter as Router} from "react-router-dom"
import './resource/styles/Main.css'
import ClientNavList from "./components/client/ClientNavList";
import AdminNavList from "./components/admin/AdminNavList";
import ClientMainContent from "./components/client/ClientMainContent";
import AdminMainContent from "./components/admin/AdminMainContent";
import Hint from "./components/client/Hint";
import LogIn from "./components/client/LogIn";
import {connectServer} from "./functional/ServerConnect";
import RoomInfo from "./functional/RoomInfo";
import {connectDatabase} from "./functional/Database";

class App extends Component {

    // happens first and once before any rendering; the state object does not exist yet
    constructor(props) {
        super(props);

        this.appFormRef = React.createRef();
        this.minAppRef = React.createRef();

        const screen = window.innerWidth;
        this.state.headerWidth =  screen > 1200 ? screen - 20 : 1430;

        connectDatabase(
            'App',
            'get',
            this.setInitState
        );

    }

    setInitState = dbData => {
        if (dbData !== undefined) {
            const {userLogin, userName, password, token, role, roomArray, logInFormVisible, applicationFormVisible} = dbData;
            const objRooms = JSON.parse(roomArray).map(r => new RoomInfo(r.serverName, r.name, r.auditory, r.description, r.tags, r.isAdditionTo));
            this.state.userLogin = userLogin;
            this.state.userName = userName;
            this.state.password = password; //TODO: security!
            this.state.token = token;
            this.state.role = role;
            this.state.roomArray = objRooms;
            if (logInFormVisible !== undefined && applicationFormVisible !== undefined) {
                this.state.logInFormVisible = logInFormVisible;
                this.state.applicationFormVisible = applicationFormVisible;
            }
        }
    };

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
        password: '', // TODO: Security!
        token: '',
        role: ['USER']
    };

    // happens once after constructor, right after the first render
    componentDidMount() {

        window.addEventListener('resize', this.headerWidth, false);
        window.addEventListener('beforeunload', () => this.saveState(true), false);
        window.addEventListener('close', () => this.saveState(false), false);

        if (this.state.roomArray.length === 0) {
            const headers = [
                {name: 'Content-Type', value: 'application/json'}
            ];
            connectServer(null, this.getRoomsFromServer, 'get', headers, 'api/public/rooms');
        }
    }

    // tweak the header width so that the LogIn button is positioned nicely
    headerWidth = () => {
        const screen = window.innerWidth;
        this.setState({
            headerWidth: screen > 1090 ? screen - 20 : 1430
        })
    };

    // save the website state when the page is reloaded (reload = true) or closed (reload = false)
    saveState = (reload) => {

        const {logInFormVisible, applicationFormVisible, roomArray, userLogin, userName, token, role, password} = this.state;

        const interactionArray = [];

        const toSave = {
            componentName: 'App',
            userLogin: userLogin,
            userName: userName,
            token: token,
            role: role,
            roomArray: JSON.stringify(roomArray),
            password: password //TODO: Security!
        };

        if (reload) {
            toSave.applicationFormVisible = applicationFormVisible;
            toSave.logInFormVisible = logInFormVisible;

            if (this.appFormRef.current != null) {
                const af = Object.assign({}, this.appFormRef.current.state);
                af.componentName = 'ApplicationForm';
                interactionArray.push(af);
            }

            if (this.minAppRef.current != null) {
                const {x, y} = this.minAppRef.current.state;
                const coords = {componentName: 'MinifiedApplicationForm', x: x, y: y};
                interactionArray.push(coords);
            }
        } else {
            connectDatabase(
                [
                    'App',
                    'ApplicationForm',
                    'Calendar',
                    'MinifiedApplicationForm',
                    'LogInForm'
                ],
                'delete'
            );
        }

        interactionArray.push(toSave);

        connectDatabase(interactionArray, 'put');
    };

    // get rooms if they are not saved from last session
    getRoomsFromServer = (responseText) => {
        const pureResponse = JSON.parse(responseText);
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
    };

    // happens once right before the component is removed
    componentWillUnmount() {
        window.removeEventListener('resize', this.headerWidth, false);
        window.removeEventListener('beforeunload', () => this.saveState(true), false);
    }

    // happens on each state change
    render() {

        const scroll = !window.screenTop && !window.screenY ? 'hidden' : 'scroll';
        const {
            logInFormVisible,
            applicationFormVisible,
            headerWidth,
            userName,
            role,
            roomArray,
            userLogin,
            token,
            showHint,
            hintVPos,
            hintHPos,
            hintX,
            hintY,
            password
        } = this.state;

        return (
            <div style={{overflowX: {scroll}}}>
                <Router>

                    <header style={{width: headerWidth}}>

                        <button
                            id='open-log-in-button'
                            onClick={() => this.openLogInForm()}
                            onMouseEnter={e => this.showHint(e, 'logIn')}
                            onMouseLeave={() => this.closeHint()}
                        >
                        </button>

                        {logInFormVisible
                            ?
                            <LogIn
                                closeLogInForm={this.closeLogInForm}
                                storeResponse={this.storeResponse}
                                userName={userName}
                                logOut={this.logOut}
                                closeHint={this.closeHint}
                                showHint={this.showHint}
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
                                role.includes('USER')
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
                            role.includes('USER')
                                ?
                                <ClientMainContent
                                    logInFormVisible={logInFormVisible}
                                    applicationFormVisible={applicationFormVisible}
                                    closeLogInForm={this.closeLogInForm}
                                    closeAppWindow={this.closeApplicationForm}
                                    showHint={this.showHint}
                                    closeHint={this.closeHint}
                                    roomArray={roomArray}
                                    appFormRef={this.appFormRef}
                                    userLogin={userLogin}
                                    token={token}
                                    password={password} //TODO: Security!
                                    minAppRef={this.minAppRef}
                                    openLogInForm={this.openLogInForm}
                                    refreshToken={this.refreshToken}
                                />
                                :
                                <AdminMainContent/>
                        }

                        {
                            showHint
                            ?
                            <Hint
                                hintText={this.getHintText()}
                                x={hintX}
                                y={hintY}
                                hintHPos={this.getHintText().length > 8 ? hintHPos : 8}
                                hintVPos={hintVPos}
                            />
                            : null
                        }

                    </section>

                </Router>
            </div>
        );
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
            case 'invalidLogIn':
                return 'Что-то пошло не так. Возможно, Вы неверно ввели адрес электронной почты или пароль';
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

    logOut = () => {
        this.setState({
            userLogin: '',
            userName: '',
            token: '',
            password: '', //TODO: Security!
            role: ['USER']
        });
    };

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
        connectDatabase(['ApplicationForm', 'Calendar', 'MinifiedApplicationForm'], 'delete');
        this.setState({
            applicationFormVisible: false
        })
    };

    closeLogInForm = () => {
        this.setState({
            logInFormVisible: false
        })
    };

    storeResponse = (userName, userLogin, token, roles, password) => {
        this.setState({
            userLogin: userLogin,
            userName: userName,
            token: token,
            role: roles,
            password: password //TODO: Security!
        })
    };

    refreshToken = (response) => {
        this.setState({
            token: JSON.parse(response).token
        })
    }
}

export default App;
