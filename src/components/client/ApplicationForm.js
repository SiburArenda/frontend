import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Calendar from './Calendar';
import '../../resource/styles/ApplicationForm.css'
import '../../resource/styles/Main.css'
import {Link} from 'react-router-dom';
import MinifiedApplicationForm from './MinifiedApplicationForm';
import Dropdown from '../Dropdown';
import moment from 'moment';
import {connectServer, checkToken} from '../../functional/ServerConnect';
import {waiting, leadZero, inputsToDefaults} from '../../functional/Design';
import {roomArrayFormation} from '../../functional/RoomInfo';

class FromTo {
    constructor(from, to) {
        this.from = from;
        this.to = to;
        this.status = 'NOT_ACTIVE'
    }
}

class ApplicationForm extends Component {

    constructor(props) {
        super(props);

        const { initState } = this.props;
        if (initState !== undefined) {
            const {roomArray} = this.props;
            this.state.id = initState.id;
            this.state.eventName = initState.name;
            this.state.eventType = initState.type;

            const pseudoRooms = initState.rooms;
            const almostRooms = roomArrayFormation(pseudoRooms, true);
            for (let i in almostRooms) {
                const name = almostRooms[i].name;
                for (let j in roomArray) {
                    if (roomArray[j].name === name) {
                        almostRooms[i].maxAmount = roomArray[j].amount;
                        break;
                    }
                }
            }
            this.state.rooms = almostRooms;

            this.state.viewersExpected = initState.auditory !== 0;
            this.state.viewers = initState.auditory;
            this.state.comment = initState.description;
            this.state.someDatesChosen = true;
            this.state.editing = true;
        } else {
            const sessionState = sessionStorage.getItem('ApplicationForm');
            if (sessionState != null) {
                const sessionStateParsed = JSON.parse(sessionState);
                const {
                    id,
                    eventName,
                    eventType,
                    rooms,
                    viewersExpected,
                    viewers,
                    comment,
                    minimized,
                    warning,
                    y,
                    x,
                    someDatesChosen,
                    editing
                } = sessionStateParsed;
                this.state.id = id;
                this.state.eventName = eventName;
                this.state.eventType = eventType;
                this.state.rooms = rooms;
                this.state.viewersExpected = viewersExpected;
                this.state.viewers = viewers;
                this.state.comment = comment;
                this.state.minimized = minimized;
                this.state.warning = warning;
                this.state.y = y;
                this.state.x = x;
                this.state.someDatesChosen = someDatesChosen;
                this.state.editing = editing;
            }
        }

        this.calendarRef = React.createRef();
    }

    state = {
        id: null,
        eventName: '',
        eventType: 'PARTY',
        rooms: [],
        viewersExpected: 'false',
        viewers: 0,
        comment: '',
        offsetX: 0,
        offsetY: 0,
        dragged: false,
        minimized: false,
        warning: [],
        grabbed: null,
        badTimings: '',
        y: 50,
        x: 400,
        someDatesChosen: false,
        waiting: false,
        editing: false
    };

    componentDidMount() {
        window.addEventListener('resize', this.handleResize, false);
        window.addEventListener('beforeunload', this.saveState, false);
    }

    saveState = () => {
        const {
            eventName,
            eventType,
            rooms,
            viewersExpected,
            viewers,
            comment,
            minimized,
            warning,
            y,
            x,
            someDatesChosen,
            editing,
            id
        } = this.state;
        const toSave = {
            id: id,
            eventName: eventName,
            eventType: eventType,
            rooms: rooms,
            viewersExpected: viewersExpected,
            viewers: viewers,
            comment: comment,
            minimized: minimized,
            warning: warning,
            y: y,
            x: x,
            someDatesChosen: someDatesChosen,
            editing: editing
        };
        sessionStorage.setItem('ApplicationForm', JSON.stringify(toSave));
    };

    handleResize = () => {

        const screenW = window.innerWidth;
        const screenH = window.innerHeight;
        const {x, y} = this.state;

        if (x + 50 > screenW) {
            this.setState({
                x: 380
            });
        }

        if (y + 50 > screenH){
            this.setState({
                y: 40
            });
        }

    };

    componentWillUnmount() {
        window.removeEventListener('resize', this.handleResize, false);
        window.removeEventListener('beforeunload', this.saveState, false);
    }

    eventTypeOptions = [
        { rusName: 'Концерт, представление', additional: null },
        { rusName: 'Корпоратив, семинар, собрание', additional: null },
        { rusName: 'Спорт', additional: null },
        { rusName: 'Другое', additional: null }
    ];

    goToRooms =
        <p className='extra-item'>
            <Link
                to='/rooms'
                className='hover-text'
                onMouseEnter={e => this.props.showHint(e, 'goToRooms')}
                onMouseLeave={() => this.props.closeHint()}
                onClick={() => this.props.closeHint()}
            >
                Окрыть "Помещения"
            </Link>
        </p>;

    eventTypeId = ['PARTY', 'DRINKING_PARTY', 'TRAINING', 'OTHER'];

    render() {

        const {
            roomArray,
            showHint,
            closeHint,
            closeAppWindow,
            initState
        } = this.props;
        const {
            rooms,
            minimized,
            x,
            y,
            eventName,
            eventType,
            viewersExpected,
            viewers,
            warning,
            waiting,
            comment,
            editing,
            badTimings
        } = this.state;

        const roomOptions = roomArray.map(roomInfo => {
            let parentChosenOrIndependent = roomInfo.isAdditionTo === 'independent';
            if (!parentChosenOrIndependent) {
                for (let roomIndex in rooms) {
                    if (rooms[roomIndex].name.startsWith(roomInfo.isAdditionTo)) {
                        parentChosenOrIndependent = true;
                        break;
                    }
                }
            }
            if (parentChosenOrIndependent) {
                const rusName = roomInfo.name;
                const url = roomInfo.getURL();
                const additional =
                    <p className='room-info'>
                        <Link
                            to={`/rooms/${url}`}
                            style={{color: 'transparent'}}
                            onMouseEnter={e => showHint(e, 'exactRoomAbout')}
                            onMouseLeave={() => closeHint()}
                            onClick={() => closeHint()}
                        >
                            link
                        </Link>
                    </p>;

                return { rusName: rusName, additional: additional }
            }
            return null;
        });

        return (
            <React.Fragment>
                {
                    minimized
                        ?
                        <MinifiedApplicationForm
                            showHint={showHint}
                            closeHint={closeHint}
                            closeAppWindow={closeAppWindow}
                            expand={this.expand}
                            posX={x}
                            posY={y}
                        />
                        :
                        <div id='application-form'
                             className='drag-detector'
                             onMouseDown={e => this.startFormDrag(e)}
                             onMouseMove={e => this.dragForm(e)}
                             onMouseUp={() => this.stopDrag()}
                             onMouseLeave={() => this.stopDrag()}
                             style={{top: y, left: x}}
                        >
                            <div className='btn-pusher drag-detector'>
                                <button
                                    onClick={() => this.minimize()}
                                    onMouseEnter={e => showHint(e, 'minAppFormBtn')}
                                    onMouseLeave={() => closeHint()}
                                    id='minimize-btn'
                                >
                                </button>
                                <button
                                    onClick={() => {
                                        closeHint();
                                        closeAppWindow()
                                    }}
                                    onMouseEnter={e => showHint(e, 'closeAppFormBtn')}
                                    onMouseLeave={() => closeHint()}
                                    className='close-btn'
                                >
                                </button>
                            </div>

                            {
                                !editing
                                    ?
                                    <div className='block-container ninety-container drag-detector'>
                                        <p>
                                            Поля, помеченные <span className='red-star'>*</span>, обязательны к заполнению
                                        </p>
                                    </div>
                                    :
                                    null
                            }

                            <div className='block-container ninety-container drag-detector'>

                                <div className='block-col drag-detector'>

                                    <p className='drag-detector'>
                                        Название мероприятия
                                        {
                                            !editing
                                                ?
                                                <span className='red-star'>*</span>
                                                :
                                                null
                                        }
                                    </p>

                                    <p className='drag-detector'>
                                        Тип мероприятия
                                        {
                                            !editing
                                                ?
                                                <span className='red-star'>*</span>
                                                :
                                                null
                                        }
                                    </p>

                                    {['MATCH', 'TRAINING'].includes(eventType)
                                        ?
                                        <p className='drag-detector' style={{height: '1.7em'}}>{''}</p>
                                        :
                                        null
                                    }

                                    <p className='drag-detector'>
                                        Помещения
                                        {
                                            !editing
                                                ?
                                                <span className='red-star'>*</span>
                                                :
                                                null
                                        }
                                    </p>

                                </div>

                                <div className='block-col drag-detector'>

                                    <input
                                        type='text'
                                        name='eventName'
                                        onChange={e => this.handleInput(e)}
                                        onKeyUp={e => this.handleKeyUp(e)}
                                        className='medium-text-input'
                                        defaultValue={eventName}
                                    />

                                    <Dropdown
                                        header={this.getEventTypeHeader()}
                                        options={this.eventTypeOptions}
                                        onChoose={this.pickEventType}
                                        withButton={true}
                                        left={0}
                                        top={16}
                                        showHint={showHint}
                                        closeHint={closeHint}
                                        width={213}
                                    />

                                    {
                                        ['MATCH', 'TRAINING'].includes(eventType)
                                            ?
                                            <div className='flex-container'>

                                                <input
                                                    type='radio'
                                                    id='training-radio'
                                                    name='eventType'
                                                    className='hidden-radio'
                                                    value='TRAINING'
                                                    onChange={e => this.handleInput(e)}
                                                    checked={eventType === 'TRAINING'}
                                                />
                                                <label htmlFor='training-radio'>
                                                </label>
                                                <label style={{marginRight: '28px'}}>Тренировка</label>

                                                <input
                                                    type='radio'
                                                    id='match-radio'
                                                    name='eventType'
                                                    className='hidden-radio'
                                                    value='MATCH'
                                                    onChange={e => this.handleInput(e)}
                                                    checked={eventType === 'MATCH'}
                                                />
                                                <label htmlFor='match-radio'>
                                                </label>
                                                <label>Матч</label>
                                            </div>
                                            :
                                            null
                                    }

                                    <div className='map-display'>
                                        <Dropdown
                                            header='Добавить'
                                            options={roomOptions.filter(option => option != null)}
                                            onChoose={this.addRoom}
                                            withButton={false}
                                            marginRight={8}
                                            showHint={showHint}
                                            closeHint={closeHint}
                                            extraOption={this.goToRooms}
                                            width={213}
                                        />
                                        {
                                            rooms.map(room => <this.RoomSpan key={room.name} room={room}/>)
                                        }
                                    </div>

                                </div>

                            </div>

                            <div className='block-container ninety-container drag-detector'>

                                <div className='block-col drag-detector'>

                                    {
                                        ['DRINKING_PARTY', 'OTHER'].includes(eventType)
                                            ?
                                            <p className='drag-detector'>
                                                Ожидается ли на Вашем мероприятии зрительская аудитория?
                                                {
                                                    !editing
                                                        ?
                                                        <span className='red-star'>*</span>
                                                        :
                                                        null
                                                }
                                            </p>
                                            :
                                            null
                                    }

                                    {
                                        ['MATCH', 'PARTY'].includes(eventType)
                                        || (eventType !== 'TRAINING' && viewersExpected === 'true')
                                            ?
                                            <p className='drag-detector'>
                                                Количество зрителей
                                                {
                                                    !editing
                                                        ?
                                                        <span className='red-star'>*</span>
                                                        :
                                                        null
                                                }
                                            </p>
                                            :
                                            null
                                    }
                                </div>

                                <div className='block-col drag-detector'>

                                    {
                                        ['DRINKING_PARTY', 'OTHER'].includes(eventType)
                                            ?
                                            <React.Fragment>
                                                <p className='drag-detector' style={{height: '1.7em'}}>{''}</p>

                                                <div className='flex-container'>

                                                    <input
                                                        type='radio'
                                                        id='yes-viewers-radio'
                                                        name='viewersExpected'
                                                        className='hidden-radio'
                                                        value={true}
                                                        onChange={e => this.handleInput(e)}
                                                        checked={viewersExpected === 'true'}
                                                    />
                                                    <label htmlFor='yes-viewers-radio'>
                                                    </label>
                                                    <label style={{marginRight: '28px'}}>Да</label>

                                                    <input
                                                        type='radio'
                                                        id='no-viewers-radio'
                                                        name='viewersExpected'
                                                        className='hidden-radio'
                                                        value={false}
                                                        onChange={e => this.handleInput(e)}
                                                        checked={viewersExpected === 'false'}
                                                    />
                                                    <label htmlFor='no-viewers-radio'>
                                                    </label>
                                                    <label>Нет</label>
                                                </div>

                                                <p className='drag-detector' style={{height: '1.7em'}}>{''}</p>
                                            </React.Fragment>
                                            :
                                            null
                                    }

                                    {
                                        ['MATCH', 'PARTY'].includes(eventType)
                                        || (eventType !== 'TRAINING' && viewersExpected === 'true')
                                            ?
                                            <div style={{display: 'flex', alignItems: 'center'}}>

                                                <input
                                                    type='text'
                                                    name='viewers'
                                                    onChange={e => this.invalidInput(e, 'viewers')}
                                                    onKeyUp={e => this.handleKeyUp(e)}
                                                    className='small-text-input'
                                                    defaultValue={viewers === 0 ? '' : viewers}
                                                />

                                                {
                                                    warning.includes('viewers')
                                                        ?
                                                        <div
                                                            className='warning'
                                                            onMouseEnter={e => showHint(e, 'intPosNum')}
                                                            onMouseLeave={() => closeHint()}
                                                        >
                                                        </div>
                                                        :
                                                        <div
                                                            className='empty-warning'
                                                        >
                                                        </div>
                                                }

                                            </div>
                                            :
                                            null
                                    }

                                </div>

                            </div>

                            <Calendar
                                ref={this.calendarRef}
                                showHint={showHint}
                                closeHint={closeHint}
                                hideSendWarning={this.hideSendWarning}
                                chooseSomeDate={this.chooseSomeDate}
                                handleKeyUp={this.handleKeyUp}
                                initState={initState}
                            />

                            <div className='block-container ninety-container drag-detector'>
                                <label className='drag-detector'>
                                    В этом поле Вы можете оставить любые комментарии, которые сочтёте важными. К
                                    примеру, стоит указать, в каком формате и когда Вам было бы удобно связаться для
                                    окончательного заключения договора об аренде.
                                </label>
                            </div>
                            <div className='block-container drag-detector'>
                                <textarea
                                    name='comment'
                                    onChange={e => this.handleInput(e)}
                                    className='big-text-input'
                                    defaultValue={comment}
                                />
                            </div>
                            <div className='btn-pusher drag-detector'>

                                {
                                    waiting
                                        ?
                                        <div
                                            id='waiting-for-app-confirm'
                                            className='waiting'
                                        >
                                            {''}
                                        </div>
                                        :
                                        <React.Fragment>

                                            {
                                                editing
                                                    ?
                                                    <button
                                                        className='hover-text no-border-element transparent-element'
                                                        onClick={() => closeAppWindow()}
                                                    >
                                                        Отмена
                                                    </button>
                                                    :
                                                    null
                                            }

                                            {
                                                warning.includes('badTimings')
                                                    ?
                                                    <div
                                                        className='warning'
                                                        id='w3'
                                                        onMouseEnter={e => showHint(e, badTimings)}
                                                        onMouseLeave={() => closeHint()}
                                                    >
                                                    </div>
                                                    :
                                                    <div
                                                        className='empty-warning'
                                                    >
                                                    </div>
                                            }

                                            <button
                                                id='send-btn'
                                                className='hover-text'
                                                onClick={e => this.sendApplication(e)}
                                                onMouseEnter={e => showHint(e, 'sendAppBtn')}
                                                onMouseLeave={() => closeHint()}
                                                disabled={this.getSendDisabled()}
                                            >
                                                {
                                                    editing
                                                        ?
                                                        'Сохранить изменения'
                                                        :
                                                        'Отправить заявку'
                                                }
                                            </button>

                                        </React.Fragment>
                                }
                            </div>
                        </div>
                }
            </React.Fragment>

        );
    }

    handleKeyUp = e => {
        if (e.which === 13) {

            const { eventName, rooms, viewersExpected, viewers, someDatesChosen } = this.state;
            if (eventName !== '' && rooms.length !== 0 && (!viewersExpected || viewers !== 0) && someDatesChosen) {
                this.sendApplication();
            } else {
                const currentInput = e.target;
                const appFormInputs = document.getElementById('application-form');
                const allInputs = appFormInputs.getElementsByTagName('input');
                let found = false;
                let i = 0;
                while (i < allInputs.length) {
                    const inp = allInputs.item(i);

                    if (found && inp.type === 'text') {
                        inp.focus();
                        break;
                    } else if (inp === currentInput) {
                        found = true;
                    }

                    i++;
                    if (i === allInputs.length) {
                        i = 0;
                    }
                }
            }
        }
    };

    chooseSomeDate = did => {
        this.setState({
            someDatesChosen: did
        })
    };

    handleInput = e => {
        this.props.closeHint();
        this.setState({
            [e.target.name]: e.target.value
        });
    };

    getRoomJSON = () => {
        const result = [];
        const rooms = this.state.rooms.slice();
        for (let i in rooms) {
            const room = rooms[i];
            const serverName = room.serverName;
            if (room.maxAmount > 1) {
                for (let j = 1; j <= room.amount; j++) {
                    result.push(`${serverName} #${j}`)
                }
            } else {
                result.push(serverName);
            }
        }
        return `"rooms":${JSON.stringify(result)},`
    };

    sendApplication = () => {

        const { token, userLogin, password, closeHint, refreshToken } = this.props; // TODO: Security!

        closeHint();
        const { eventName, eventType, viewersExpected, viewers, comment, warning, id } = this.state;
        const { selectedDays, selectedTimings } = this.calendarRef.current.state;

        let badTimings = 'badTimings';
        for (let i in selectedTimings) {
            const {startH, startM, endH, endM} = selectedTimings[i];
            const bad = ((+startH) * 60 + (+startM)) >= ((+endH) * 60 + (+endM));
            if (bad) {
                const correlatedDay = selectedDays[i];
                const split = correlatedDay.split(' ');
                const monthNum = moment.monthsShort().indexOf(split[1]) + 1;
                badTimings += `&${split[2]}.${leadZero(monthNum)}.${split[3]}`;
            }
        }

        if (badTimings.length !== 10) {
            this.setState({
                warning: warning.includes('badTimings') ? warning : [...warning, 'badTimings'],
                badTimings: badTimings
            })
        } else {
            const nameJSON = `"name":${JSON.stringify(eventName)},`;
            const viewersNeeded = viewersExpected === 'true' || ['PARTY', 'MATCH'].includes(eventType);
            const audJSON = `"auditory":${viewersNeeded ? +viewers : 0},`;
            const typeJSON = `"type":"${eventType}",`;
            const roomsJSON = this.getRoomJSON();
            const userJSON = `"user":"${userLogin}",`;

            const dateArrJSON = JSON.stringify(JSON.stringify(this.dateTimeJSON(selectedDays, selectedTimings)));
            const dateJSON = `"dates":${dateArrJSON},`;

            const commentJSON = `"comment":${JSON.stringify(comment)}`;

            const toSend = '{' + nameJSON + audJSON + typeJSON + roomsJSON + userJSON + dateJSON + commentJSON + '}';


            const newWarning = warning.slice();
            const i = newWarning.indexOf('badTimings');
            if (i !== -1) {
                newWarning.splice(i, 1);
            }
            this.setState({
                waiting: true,
                warning: newWarning
            });
            setTimeout(() => waiting('waiting-for-app-confirm'), 1);

            const urlEnding = this.state.editing ? 'events/modify?id=' + id : 'order';

            checkToken(
                responseText => {
                    let newToken = token;
                    if (responseText !== 'true') {
                        refreshToken(responseText);
                        newToken = JSON.parse(responseText).token;
                    }
                    const headers = [
                        { name: 'Authorization', value: 'Bearer_' + newToken },
                        { name: 'Content-Type', value: 'application/json' }
                    ];
                    connectServer(
                        toSend,
                        this.cleanUp,
                        'post',
                        headers,
                        'api/user/' + urlEnding,
                        this.onResponseError,
                        this.onSendError);
                },
                token,
                userLogin,
                password,
                this.onResponseError,
                this.onSendError
            );
        }
    };

    cleanUp = () => {

        const appForm = document.getElementById('application-form');
        if (appForm != null) {
            this.setState({
                eventName: '',
                eventType: 'PARTY',
                rooms: [],
                viewersExpected: 'false',
                viewers: 0,
                comment: '',
                warning: [],
                badTimings: '',
                someDatesChosen: false,
                waiting: false
            });

            inputsToDefaults(['input', 'textarea'], 'application-form');

            const btn = document.getElementById('send-btn');
            const addLeft = this.state.editing ? 53 : 41;
            const top = btn.getBoundingClientRect().top + document.body.scrollTop - 18;
            const left = btn.getBoundingClientRect().left + document.body.scrollLeft + addLeft;
            this.props.sendBird('sign-up', left, top);

            this.calendarRef.current.clearSelectedDates();
        }

        sessionStorage.removeItem('ApplicationForm');
        sessionStorage.removeItem('Calendar');

        if (this.props.allApplicationsRef.current != null) {
            this.props.allApplicationsRef.current.getApplications();
        }

        if (this.props.sentApplicationRef.current != null) {
            this.props.sentApplicationRef.current.decideApplication();
        }
    };

    onResponseError = () => {
        this.setState({
            warning: [...this.state.warning, 'badTimings'],
            badTimings: 'responseError',
            waiting: false
        });
        document.getElementById('w3').style.transform = 'rotate(0deg)';
    };

    onSendError = () => {
        this.setState({
            warning: [...this.state.warning, 'badTimings'],
            badTimings: 'sendError',
            waiting: false
        });
        document.getElementById('w3').style.transform = 'rotate(0deg)';
    };

    dateTimeConstruction = (datesArray, timesArray) => {
        const datesTimesArrayFrom = [];
        const dateTimesArrayTo = [];
        for (let i = 0; i < datesArray.length; i++) {
            const dividedDate = datesArray[i].split(' ');
            const t = timesArray[i];
            const stringRepFrom = `${dividedDate[0]} ${dividedDate[1]} ${dividedDate[2]} ${leadZero(t.startH)}:${leadZero(t.startM)}:00 NOVT ${dividedDate[3]}`;
            const stringRepTo = `${dividedDate[0]} ${dividedDate[1]} ${dividedDate[2]} ${leadZero(t.endH)}:${leadZero(t.endM)}:00 NOVT ${dividedDate[3]}`;
            datesTimesArrayFrom.push(stringRepFrom);
            dateTimesArrayTo.push(stringRepTo);
        }
        return [datesTimesArrayFrom, dateTimesArrayTo];
    };

    dateTimeJSON = (dates, times) => {
        const dt = this.dateTimeConstruction(dates, times); // [0] = from, [1] = to
        const res = [];
        for (let i = 0; i < dt[0].length; i++) {
            res.push(new FromTo(dt[0][i], dt[1][i]));
        }
        return res;
    };

    addRoom = room => {
        this.props.closeHint();

        let toAdd = null;

        const { rooms } = this.state;
        const { roomArray } = this.props;
        for (let i in rooms) {
            if (rooms[i].name === room.rusName) {
                return;
            }
        }

        for (let roomIndex in roomArray) {
            const arrItem = roomArray[roomIndex];
            if (room.rusName === arrItem.name) {
                toAdd = {
                    serverName: arrItem.serverName,
                    name: room.rusName,
                    amount: room.rusName === 'Тренировочная арена' ? 2 : 1,
                    maxAmount: arrItem.amount,
                    isAdditionTo: arrItem.isAdditionTo
                };
                break;
            }
        }

        if (toAdd != null) {
            this.setState({
                rooms: [...this.state.rooms, toAdd]
            })
        }
    };

    getCoords = () => {
        const movedObj = document.getElementById('application-form');
        const formXpx = movedObj.style.left === '' ? '400px' : movedObj.style.left;
        const formX = +formXpx.substr(0, formXpx.length - 2);
        const formYpx = movedObj.style.top === '' ? '50px' : movedObj.style.top;
        const formY = +formYpx.substr(0, formYpx.length - 2);
        return [formX, formY]
    };

    startFormDrag = e => {
        if (e.target.className.indexOf('drag-detector') !== -1) {

            e.target.style.cursor = 'grab';

            const movedObj = document.getElementById('application-form');
            const mouseX = +e.screenX;
            const mouseY = +e.screenY;

            const clientHeight = +movedObj.clientHeight;
            const clientWidth = +movedObj.clientWidth;

            const formX = this.getCoords()[0];
            const formY = this.getCoords()[1];

            const offsetX = mouseX - formX;
            const offsetY = mouseY - formY;

            if (clientHeight - offsetY > 25 || clientWidth - offsetX > 90) {
                this.setState({
                    offsetX: offsetX,
                    offsetY: offsetY,
                    dragged: true,
                    grabbed: e.target
                })
            }

        }
    };

    dragForm = e => {
        if (this.state.dragged) {
            this.setState({
                x: +e.screenX - this.state.offsetX,
                y: +e.screenY - this.state.offsetY
            });
        }
    };

    stopDrag = () => {

        if (this.state.dragged) {
            const grabbed = this.state.grabbed;
            grabbed.style.cursor = 'default';
            this.setState({
                dragged: false,
                grabbed: null
            })
        }
    };

    PlusMinus = props => {
        const room = props.room;
        const { amount, maxAmount } = room;
        const { closeHint, showHint} = this.props;
        return(
            <span className='flex-container'>

                <button
                    className='plus-minus-btn'
                    onMouseEnter={e => showHint(e, 'minus')}
                    onMouseLeave={() => closeHint()}
                    onClick={() => this.changeRoomAmount(room, -1)}
                >
                    -
                </button>

                <label
                    onMouseEnter={e => showHint(e, `roomAmount%${maxAmount}%${amount}`)}
                    onMouseLeave={() => closeHint()}
                    style={{margin: '0 8px'}}
                >
                    {amount}
                </label>

                <button
                    className='plus-minus-btn'
                    onMouseEnter={e => showHint(e, 'plus')}
                    onMouseLeave={() => closeHint()}
                    onClick={() => this.changeRoomAmount(room, 1)}
                >
                    +
                </button>

            </span>
        );
    };

    Half = () => {
        return(
            <React.Fragment>
                <input
                    type='checkbox'
                    onChange={e => this.halfField(e)}
                    id='hidden-half'
                />
                <label
                    htmlFor='hidden-half'
                    onMouseEnter={e => this.halfHint(e)}
                    onMouseLeave={() => this.props.closeHint()}
                    onClick={() => this.props.closeHint()}
                >
                </label>
            </React.Fragment>
        )
    };

    halfHint = e => {
        const secondHalf = document.getElementById('hidden-half').checked ? 'full' : 'half';
        this.props.showHint(e, `trainingArena%${secondHalf}`)
    };

    RoomSpan = (props) => {
        const { room } = props;
        const { name, maxAmount } = room;
        return(
            <span className='map-span' style={{order: name.length}}>
                {name}
                {
                    name === 'Тренировочная арена'
                        ?
                        <this.Half/>
                        :
                        maxAmount === 1
                            ? null
                            : <this.PlusMinus room={room}/>
                }
                <button
                    onClick={() => this.removeRoom(props.room)}
                    className='remove-btn'
                >
                    {''}
                </button>
            </span>
        );
    };

    removeRoom = room => {
        const noRoom = this.state.rooms.slice();
        const index = noRoom.indexOf(room);
        noRoom.splice(index, 1);
        while (true) {
            const toRemoveAlso = [];
            for (let i in noRoom) {
                if (noRoom[i].isAdditionTo !== 'independent') {
                    let chosen = false;
                    for (let j in noRoom) {
                        if (noRoom[j].name.startsWith(noRoom[i].isAdditionTo)) {
                            chosen = true;
                            break;
                        }
                    }
                    if (!chosen) {
                        toRemoveAlso.push(i);
                    }
                }
            }
            let deleted = 0;
            if (toRemoveAlso.length !== 0) {
                for (let i in toRemoveAlso) {
                    noRoom.splice(toRemoveAlso[i] - deleted++, 1);
                }
            } else {
                break;
            }
        }
        this.setState({
            rooms: noRoom
        })
    };

    minimize = () => {
        this.props.closeHint();
        sessionStorage.setItem('Calendar', JSON.stringify(this.calendarRef.current.state));
        this.setState({
            minimized: true
        });
    };

    expand = (x, y) => {
        this.props.closeHint();
        sessionStorage.removeItem('MinifiedApplicationForm');
        this.setState({
            minimized: false,
            x: x,
            y: y
        })
    };

    pickEventType = option => {
        const index = this.eventTypeOptions.indexOf(option);
        this.setState({
            eventType: this.eventTypeId[index]
        })
    };

    invalidInput = (e, where) => {

        if (!e.target.value.match(/^\d*$/)) {
            this.setState({
                warning: [this.state.warning, where]
            })
        } else {

            const warning = this.state.warning.slice();
            const indexW = warning.indexOf(where);
            if (indexW !== -1) {
                warning.splice(indexW, 1);
            }

            this.props.closeHint();
            this.setState({
                warning: warning,
                [e.target.name]: e.target.value
            })
        }
    };

    hideSendWarning = () => {
        this.props.closeHint();
        const warning = this.state.warning.slice();
        const index = warning.indexOf('badTimings');
        if (index !== -1) {
            warning.splice(index, 1);
        }
        this.setState({
            warning: warning
        })
    };

    changeRoomAmount = (room, number) => {
        const index = this.state.rooms.indexOf(room);
        const newRooms = this.state.rooms.slice();
        const newAmount = room.amount + number;
        if (room.maxAmount >= newAmount && 1 <= newAmount) {
            newRooms[index].amount = newAmount;
            this.setState({
                rooms: newRooms
            });
        }
    };

    halfField = (e) => {
        const rooms = this.state.rooms.slice();
        let index = 0;
        for (let i in rooms) {
            if (rooms[i].name === 'Тренировочная арена') {
                index = i;
                break;
            }
        }
        rooms[index].amount = e.target.checked ? 1 : 2;
        this.setState({
            rooms: rooms
        })
    };

    getEventTypeHeader() {
        const index = this.eventTypeId.indexOf(this.state.eventType);
        return index === -1 ? 'Спорт' : this.eventTypeOptions[index].rusName;
    }

    getSendDisabled = () => {
        const {eventName, rooms, viewersExpected, viewers, someDatesChosen, eventType} = this.state;
        const viewersNeeded = viewersExpected === 'true' || ['MATCH', 'PARTY'].includes(eventType);
        return eventName === '' || rooms.length === 0 || (viewersNeeded && viewers === 0) || !someDatesChosen;
    }
}

ApplicationForm.propTypes = {
    closeAppWindow: PropTypes.func.isRequired,
    userLogin: PropTypes.string.isRequired,
    token: PropTypes.string.isRequired,
    showHint: PropTypes.func.isRequired,
    closeHint: PropTypes.func.isRequired,
    roomArray: PropTypes.array.isRequired,
    refreshToken: PropTypes.func.isRequired,
    sendBird: PropTypes.func.isRequired,
    allApplicationsRef: PropTypes.object.isRequired,
    initState: PropTypes.object,
    sentApplicationRef: PropTypes.object.isRequired
};

export default ApplicationForm;