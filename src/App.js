import React, {Component} from 'react';
import {BrowserRouter as Router} from 'react-router-dom'
import './resource/styles/Main.css'
import ClientNavList from './components/client/ClientNavList';
import AdminNavList from './components/admin/AdminNavList';
import ClientMainContent from './components/client/ClientMainContent';
import AdminMainContent from './components/admin/AdminMainContent';
import Hint from './components/client/Hint';
import LogIn from './components/client/LogIn';
import {flyBird} from './functional/Design';

class App extends Component {

    // happens first and once before any rendering; the state object does not exist yet
    constructor(props) {

        super(props);

        this.appFormRef = React.createRef();
        this.allApplicationsRef = React.createRef();

        const screen = window.innerWidth;
        this.state.headerWidth =  screen > 1200 ? screen - 20 : 1430;

        const sessionState = sessionStorage.getItem('App');
        if (sessionState != null) {
            const sessionStateParsed = JSON.parse(sessionState);
            const { applicationFormVisible, logInFormVisible } = sessionStateParsed;
            this.state.applicationFormVisible = applicationFormVisible;
            this.state.logInFormVisible = logInFormVisible;
        }

        const localState = localStorage.getItem('App');
        if (localState != null) {
            const { userLogin, userName, password, token, role } = JSON.parse(localState);
            this.state.userLogin = userLogin;
            this.state.userName = userName;
            this.state.password = password; //TODO: security!
            this.state.token = token;
            this.state.role = role;
        }

    }
    state = {
        logInFormVisible: false,
        applicationFormVisible: false,
        whichHint: '',
        hintHPos: 8,
        hintVPos: 8,
        hintX: 0,
        hintY: 0,
        headerWidth: 1430,
        userLogin: '',
        userName: '',
        password: '', // TODO: Security!
        token: '',
        role: ['USER'],
        bird: [],
        applicationFormState: undefined
    };

    // happens once after constructor, right after the first render
    componentDidMount() {
        window.addEventListener('resize', this.headerWidth, false);
        window.addEventListener('beforeunload', this.saveState, false);
    }

    // tweak the header width so that the LogIn button is positioned nicely
    headerWidth = () => {
        const screen = window.innerWidth;
        this.setState({
            headerWidth: screen > 1090 ? screen - 20 : 1430
        })
    };

    // save the website state when the page is reloaded (reload = true) or closed (reload = false)
    saveState = () => {
        const { logInFormVisible, applicationFormVisible, userLogin, userName, token, role, password } = this.state;

        const toSave = {
            userLogin: userLogin,
            userName: userName,
            token: token,
            role: role,
            password: password //TODO: Security!
        };

        localStorage.setItem('App', JSON.stringify(toSave));

        sessionStorage.setItem(
            'App',
            JSON.stringify({ logInFormVisible: logInFormVisible, applicationFormVisible: applicationFormVisible })
        );
    };

    // happens once right before the component is removed
    componentWillUnmount() {
        window.removeEventListener('resize', this.headerWidth, false);
        window.removeEventListener('beforeunload', this.saveState, false);
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
            userLogin,
            token,
            whichHint,
            hintVPos,
            hintHPos,
            hintX,
            hintY,
            password,
            bird,
            applicationFormState
        } = this.state;

        return (
            <div
                style={{overflowX: {scroll}}}
            >
                <Router>

                    <header
                        style={{width: headerWidth}}
                    >

                        <button
                            id='open-log-in-button'
                            onClick={() => this.openLogInForm()}
                            onMouseEnter={e => this.showHint(e, 'logIn')}
                            onMouseLeave={() => this.closeHint()}
                        >
                        </button>

                        {
                            logInFormVisible
                                ?
                                <LogIn
                                    closeLogInForm={this.closeLogInForm}
                                    storeResponse={this.storeResponse}
                                    userName={userName}
                                    logOut={this.logOut}
                                    closeHint={this.closeHint}
                                    showHint={this.showHint}
                                    storePassword={this.storePassword} //TODO: Security!
                                    allApplicationsRef={this.allApplicationsRef}
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

                    <section
                        id='main-content'
                    >
                        {
                            role.includes('USER')
                                ?
                                <ClientMainContent
                                    applicationFormVisible={applicationFormVisible}
                                    closeAppWindow={this.closeApplicationForm}
                                    showHint={this.showHint}
                                    closeHint={this.closeHint}
                                    appFormRef={this.appFormRef}
                                    userLogin={userLogin}
                                    token={token}
                                    password={password} //TODO: Security!
                                    refreshToken={this.refreshToken}
                                    sendBird={this.sendBird}
                                    applicationFormState={applicationFormState}
                                    openApplicationForm={this.openApplicationForm}
                                    allApplicationsRef={this.allApplicationsRef}
                                    userName={userName}
                                />
                                :
                                <AdminMainContent/>
                        }

                        {
                            whichHint !== ''
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

                        {
                            bird.map(
                                b =>
                                    <div
                                        key={b.id}
                                        id={b.id}
                                        style={{left: b.left, top: b.top, opacity: '1'}}
                                        className='bird'
                                    >
                                        {''}
                                    </div>
                            )
                        }

                    </section>

                </Router>
            </div>
        );
    }

    sendBird = (id, left, top) => {
        const bird = this.state.bird.slice();
        const newBird = {id: id, left: left, top: top};
        bird.push(newBird);
        this.setState({
            bird: bird
        });
        setTimeout(() => flyBird(id, this.removeBird), 1);
    };

    removeBird = id => {
        const bird = this.state.bird.slice();
        for (let i in bird) {
            const b = bird[i];
            if (b.id === id) {
                bird.splice(+i, 1);
                break;
            }
        }
        this.setState({
            bird: bird
        })
    };

    getHintText = () => {
        const { whichHint } = this.state;

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

        if (whichHint.startsWith('badTimings')) {
            const split = whichHint.split('&');

            let message = '<p>Для следующих дат некорректно указаны временные рамки:</p>';

            for (let i = 1; i < split.length; i++) {
                message += '<p>- ' + split[i].toString() + '</p>';
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
                return (
                    this.state.userLogin === ''
                        ?
                        'Только авторизованные пользователи могут отправлять заявки!'
                        :
                        'Окно заполнения заявки откроется параллельно с остальным содержимым сервиса' +
                        ' - Вы сможете переходить по разделам, не закрывая его и не заполняя заново!'
                );
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
            case 'compulsoryFields':
                return 'Пожалуйста, заполните обязательные поля';
            case 'responseError':
                return 'Нам очень жаль, но, похоже, на сервере какие-то неполадки; мы уже работаем над этим - попробуйте ещё раз через пару минут!';
            case 'sendError':
                return 'Что-то пошло не так; пожалуйста, проверьте, подключён ли Ваш компьютер к интернету';
            case 'sendErrorSignUp':
                return 'Что-то пошло не так; возможно, аккаунт для такого адреса электронной почты уже существует, или Ваш компьютер не подключён к сети';
            case 'timeSetNoEdit':
                return 'Временные рамки для этой даты';
            case 'clearAccEdit':
                return 'Вернуть значения всех полей к текущим';
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
            whichHint: which,
            hintX: +e.clientX,
            hintY: +e.clientY,
            hintHPos: hPos,
            hintVPos: vPos
        })
    };

    closeHint = () => {
        this.setState({
            whichHint: ''
        })
    };

    logOut = () => {
        this.closeApplicationForm();
        localStorage.removeItem('AllApplications');
        localStorage.removeItem('App');
        this.setState({
            userLogin: '',
            userName: '',
            token: '',
            password: '', //TODO: Security!
            role: ['USER']
        });
    };

    openApplicationForm = (applicationFormState = undefined) => {
        if (this.state.userLogin !== '') {
            this.setState({
                applicationFormVisible: true,
                applicationFormState: applicationFormState
            })
        } else {
            this.openLogInForm();
        }
    };

    openLogInForm = () => {
        this.closeHint();
        this.setState({
            logInFormVisible: true
        })
    };

    closeApplicationForm = () => {
        sessionStorage.removeItem('ApplicationForm');
        sessionStorage.removeItem('Calendar');
        this.setState({
            applicationFormVisible: false,
            applicationFormState: undefined
        })
    };

    closeLogInForm = () => {
        this.setState({
            logInFormVisible: false
        })
    };

    storePassword = password => {
        this.setState({
            password: password
        })
    };
    //TODO: Security!

    storeResponse = (userName, userLogin, token, roles) => {
        this.setState({
            userLogin: userLogin,
            userName: userName,
            token: token,
            role: roles
        });
    };

    refreshToken = response => {
        this.setState({
            token: JSON.parse(response).token
        })
    }
}

export default App;
