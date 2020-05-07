import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Calendar from "./Calendar";
import '../../resource/styles/ApplicationForm.css'
import '../../resource/styles/Main.css'
import {Link} from "react-router-dom";
import MinifiedApplicationForm from "./MinifiedApplicationForm";
import Dropdown from "../Dropdown";
import moment from "moment";

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

        const prevState = sessionStorage.getItem('appFormState');
        if (prevState != null) {
            this.state = JSON.parse(prevState);
        }

        this.calendarRef = React.createRef();
    }

    state = {
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
        notFilled: '',
        y: 50,
        x: 400
    };

    eventTypeOptions = [
        {rusName: 'Концерт, представление', additional: null},
        {rusName: 'Корпоратив, семинар, собрание', additional: null},
        {rusName: 'Спорт', additional: null},
        {rusName: 'Другое', additional: null}
    ];

    goToRooms =
        <p className='extra-item'>
            <Link
                to='/rooms'
                className='hover-text'
                style={{textDecoration: 'none'}}
                onMouseEnter={e => this.props.showHint(e, 'goToRooms')}
                onMouseLeave={() => this.props.closeHint()}
                onClick={() => this.props.closeHint()}
            >
                Окрыть "Помещения"
            </Link>
        </p>;

    render() {

        const roomOptions = this.props.roomArray.map(roomInfo =>
        {
            let parentChosenOrIndependent = roomInfo.isAdditionTo === 'independent';
            if (!parentChosenOrIndependent) {
                for (let roomIndex in this.state.rooms) {
                    if (this.state.rooms[roomIndex].name.startsWith(roomInfo.isAdditionTo)){
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
                            to={`/${url}`}
                            style={{color: 'transparent'}}
                            onMouseEnter={e => this.props.showHint(e, 'exactRoomAbout')}
                            onMouseLeave={() => this.props.closeHint()}
                            onClick={() => this.props.closeHint()}
                        >
                            link
                        </Link>
                    </p>;

                return {rusName: rusName, additional: additional}
            } else return null;
        });

        return (
            <React.Fragment>
                {
                    this.state.minimized
                        ?
                        <MinifiedApplicationForm
                            showHint={this.props.showHint}
                            closeHint={this.props.closeHint}
                            closeAppWindow={this.props.closeAppWindow}
                            expand={this.expand}
                            posX={this.state.x}
                            posY={this.state.y}
                            ref={this.props.minAppRef}
                        />
                        :
                        <div id='application-form'
                             className='drag-detector'
                             onMouseDown={e => this.startFormDrag(e)}
                             onMouseMove={e => this.dragForm(e)}
                             onMouseUp={() => this.stopDrag()}
                             onMouseLeave={() => this.stopDrag()}
                             style={{top: this.state.y, left: this.state.x}}
                        >
                            <div className='btn-pusher drag-detector'>
                                <button
                                    onClick={() => this.minimize()}
                                    onMouseEnter={e => this.props.showHint(e, 'minAppFormBtn')}
                                    onMouseLeave={() => this.props.closeHint()}
                                    id='minimize-btn'
                                >
                                </button>
                                <button
                                    onClick={() => {
                                        this.props.closeHint();
                                        this.props.closeAppWindow()
                                    }}
                                    onMouseEnter={e => this.props.showHint(e, 'closeAppFormBtn')}
                                    onMouseLeave={() => this.props.closeHint()}
                                    className='close-btn'
                                >
                                </button>
                            </div>

                            <div className='block-container ninety-container drag-detector'>

                                <div className='block-col drag-detector'>

                                    <p className='drag-detector'>Название мероприятия</p>

                                    <p className='drag-detector'>Тип мероприятия</p>

                                    {['MATCH', 'TRAINING'].includes(this.state.eventType)
                                        ?
                                        <p className='drag-detector' style={{height: '1.7em'}}>{''}</p>
                                        :
                                        null
                                    }

                                    <p className='drag-detector'>Помещения</p>

                                </div>

                                <div className='block-col drag-detector'>

                                    <input
                                        type='text'
                                        name='eventName'
                                        onChange={(e) => {
                                            this.handleInput(e)
                                        }}
                                        className='medium-text-input'
                                        defaultValue={this.state.eventName}
                                    />

                                    <Dropdown
                                        header=''
                                        options={this.eventTypeOptions}
                                        onChoose={this.pickEventType}
                                        withButton={true}
                                        left={0}
                                        top={16}
                                        showHint={this.props.showHint}
                                        closeHint={this.props.closeHint}
                                        width={213}
                                    />

                                    {
                                        ['MATCH', 'TRAINING'].includes(this.state.eventType)
                                            ?
                                            <div className='flex-container'>

                                                <input
                                                    type='radio'
                                                    id='training-radio'
                                                    name='eventType'
                                                    className='hidden-radio'
                                                    value='TRAINING'
                                                    onChange={(e) => {
                                                        this.handleInput(e)
                                                    }}
                                                    checked={this.state.eventType === 'TRAINING'}
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
                                                    onChange={(e) => {
                                                        this.handleInput(e)
                                                    }}
                                                    checked={this.state.eventType === 'MATCH'}
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
                                            showHint={this.props.showHint}
                                            closeHint={this.props.closeHint}
                                            extraOption={this.goToRooms}
                                            width={213}
                                        />
                                        {this.state.rooms.map(room => <this.RoomSpan key={room.name} room={room}/>)}
                                    </div>

                                </div>

                            </div>

                            <div className='block-container ninety-container drag-detector'>

                                <div className='block-col drag-detector'>

                                    {
                                        ['DRINKING_PARTY', 'OTHER'].includes(this.state.eventType)
                                            ?
                                            <p className='drag-detector'>Ожидается ли на Вашем мероприятии
                                                зрительская аудитория?</p>
                                            :
                                            null
                                    }

                                    {
                                        ['MATCH', 'PARTY'].includes(this.state.eventType)
                                        || (this.state.eventType !== 'TRAINING' && this.state.viewersExpected === 'true')
                                            ? <p className='drag-detector'>Количество зрителей</p>
                                            : null
                                    }
                                </div>

                                <div className='block-col drag-detector'>

                                    {
                                        ['DRINKING_PARTY', 'OTHER'].includes(this.state.eventType)
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
                                                        onChange={(e) => {
                                                            this.handleInput(e)
                                                        }}
                                                        checked={this.state.viewersExpected === 'true'}
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
                                                        onChange={(e) => {
                                                            this.handleInput(e)
                                                        }}
                                                        checked={this.state.viewersExpected === 'false'}
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
                                        ['MATCH', 'PARTY'].includes(this.state.eventType)
                                        || (this.state.eventType !== 'TRAINING' && this.state.viewersExpected === 'true')
                                            ?
                                            <div style={{display: 'flex', alignItems: 'center'}}>

                                                <input
                                                    type='text'
                                                    name='viewers'
                                                    onChange={e => this.invalidInput(e, 'viewers')}
                                                    className='small-text-input'
                                                    defaultValue={this.state.viewers === 0 ? '' : this.state.viewers}
                                                />

                                                {
                                                    this.state.warning.includes('viewers')
                                                        ?
                                                        <div
                                                            className='warning'
                                                            onMouseEnter={e => this.props.showHint(e, 'intPosNum')}
                                                            onMouseLeave={() => this.props.closeHint()}
                                                        >
                                                        </div>
                                                        :
                                                        <div
                                                            className='empty-warning'
                                                        >
                                                        </div>
                                                }

                                            </div>
                                            : null
                                    }

                                </div>

                            </div>

                            <Calendar
                                ref={this.calendarRef}
                                showHint={this.props.showHint}
                                closeHint={this.props.closeHint}
                                hideSendWarning={this.hideSendWarning}
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
                                    defaultValue={this.state.comment}
                                />
                            </div>
                            <div className='btn-pusher drag-detector'>
                                {
                                    this.state.warning.includes('notFilled')
                                        ?
                                        <div
                                            className='warning'
                                            onMouseEnter={e => this.props.showHint(e, 'notFilled' + this.state.notFilled)}
                                            onMouseLeave={() => this.props.closeHint()}
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
                                    onMouseEnter={e => this.props.showHint(e, 'sendAppBtn')}
                                    onMouseLeave={() => this.props.closeHint()}
                                >
                                    Отправить заявку
                                </button>
                            </div>
                        </div>
                }
            </React.Fragment>

        );
    }

    handleInput = (e) => {
        this.props.closeHint();
        const warning = this.state.warning.slice();
        const index = warning.indexOf('notFilled');
        if (index !== -1) {
            warning.splice(index, 1);
        }

        this.setState({
            [e.target.name]: e.target.value,
            warning: warning
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

        const {eventName, viewers, eventType, comment, viewersExpected, rooms, warning} = this.state;
        const {selectedDays, selectedTimings} = this.calendarRef.current.state;

        const nameProblems = eventName === '';

        const viewersNeeded = ['MATCH', 'PARTY'].includes(eventType) || viewersExpected;
        const viewersProblems = viewersNeeded && +viewers === 0;

        const noDays = selectedDays.length === 0;

        let badTimings = '';
        for (let i in selectedTimings) {
            const {startH, startM, endH, endM} = selectedTimings[i];
            const bad = ((+startH) * 60 + (+startM)) >= ((+endH) * 60 + (+endM));
            if (bad) {
                const correlatedDay = selectedDays[i];
                const split = correlatedDay.split(/ /g);
                const monthNum = moment.monthsShort().indexOf(split[1]);
                badTimings += `& ${split[2]}.${monthNum}.${split[3]}`;
            }
        }

        const roomProblems = rooms.length === 0;

        if (nameProblems || viewersProblems || noDays || badTimings.length !== 0 || roomProblems) {

            let notFilled = '';

            if (nameProblems) {
                notFilled += '%name';
            }

            if (viewersProblems) {
                notFilled += '%viewers';
            }

            if (noDays) {
                notFilled += '%days';
            }

            if (roomProblems) {
                notFilled += '%rooms';
            }

            if (badTimings.length !== 0) {
                notFilled += '%timings->' + badTimings;
            }

            this.setState({
                warning: warning.indexOf('notFilled') === -1 ? [...warning, 'notFilled'] : warning,
                notFilled: notFilled
            })

        } else {
            const nameJSON = `"name":"${eventName}",`;
            const audJSON = `"auditory":${viewersNeeded ? +viewers : 0},`;
            const typeJSON = `"type":"${eventType}",`;
            const roomsJSON = this.getRoomJSON();
            const userJSON = `"user":"${this.props.userLogin}",`;

            const dateArrJSON = JSON.stringify(JSON.stringify(this.dateTimeJSON(selectedDays, selectedTimings)));
            const dateJSON = `"dates":${dateArrJSON},`;

            const commentJSON = `"comment":"${comment}"`;

            const toSend = '{' + nameJSON + audJSON + typeJSON + roomsJSON + userJSON + dateJSON + commentJSON + '}';

            sessionStorage.removeItem('appFormState');

            console.log(toSend);

            // const request = new XMLHttpRequest();
            //
            // request.onreadystatechange = function () {
            //     if (request.readyState === 4) {
            //         console.log('OK!');
            //     }
            // };

            // request.open('POST', 'http://siburarenda.publicvm.com/api/user/order', true);
            // request.setRequestHeader('Authorization', 'Bearer_' + this.props.token);
            // request.setRequestHeader('Content-Type', 'application/json');
            // request.send(toSend)
        }
    };

    dateTimeConstruction = (datesArray, timesArray) => {
        const datesTimesArrayFrom = [];
        const dateTimesArrayTo = [];
        for (let i = 0; i < datesArray.length; i++) {
            const dividedDate = datesArray[i].split(' ');
            const t = timesArray[i];
            const stringRepFrom = `${dividedDate[0]} ${dividedDate[1]} ${dividedDate[2]} ${this.leadZero(t.startH)}:${this.leadZero(t.startM)}:00 NOVT ${dividedDate[3]}`;
            const stringRepTo = `${dividedDate[0]} ${dividedDate[1]} ${dividedDate[2]} ${this.leadZero(t.endH)}:${this.leadZero(t.endM)}:00 NOVT ${dividedDate[3]}`;
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

    leadZero = (num) => {
        let ans = num + "";
        while (ans.length < 2) {
            ans = '0' + ans;
        }
        return ans;
    };

    addRoom = (room) => {
        this.props.closeHint();
        const warning = this.state.warning.slice();
        const index = warning.indexOf('notFilled');
        if (index !== -1) {
            warning.splice(index, 1);
        }

        let toAdd = null;

        const {roomArray} = this.props;

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

        if (toAdd != null && !this.state.rooms.includes(toAdd)) {
            this.setState({
                rooms: [...this.state.rooms, toAdd],
                warning: warning
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

    startFormDrag = (e) => {
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

    dragForm = (e) => {
        if (this.state.dragged) {
            this.setState({
                x: +e.screenX - this.state.offsetX + 'px',
                y: +e.screenY - this.state.offsetY + 'px'
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

    PlusMinus = (props) => {
        const room = props.room;
        const {amount, maxAmount} = room;
        return(
            <span className='flex-container'>

                <button
                    className='plus-minus-btn'
                    onMouseEnter={e => this.props.showHint(e, 'minus')}
                    onMouseLeave={() => this.props.closeHint()}
                    onClick={() => this.changeRoomAmount(room, -1)}
                >
                    -
                </button>

                <label
                    onMouseEnter={e => this.props.showHint(e, `roomAmount%${maxAmount}%${amount}`)}
                    onMouseLeave={() => this.props.closeHint()}
                    style={{margin: '0 8px'}}
                >
                    {amount}
                </label>

                <button
                    className='plus-minus-btn'
                    onMouseEnter={e => this.props.showHint(e, 'plus')}
                    onMouseLeave={() => this.props.closeHint()}
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

    halfHint = (e) => {
        const secondHalf = document.getElementById('hidden-half').checked ? 'full' : 'half';
        this.props.showHint(e, `trainingArena%${secondHalf}`)
    };

    RoomSpan = (props) => {
        const {room} = props;
        const {name, maxAmount} = room;
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
                <button onClick={() => this.removeRoom(props.room)} className='remove-btn'>{''}</button>
            </span>
        );
    };

    removeRoom = (room) => {
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
        sessionStorage.setItem('calendarState', JSON.stringify(this.calendarRef.current.state))
        this.setState({
            minimized: true
        });
    };

    expand = (x, y) => {
        this.props.closeHint();
        this.setState({
            minimized: false,
            x: x,
            y: y
        })
    };

    eventTypeId = ['PARTY', 'DRINKING_PARTY', 'TRAINING', 'OTHER'];

    pickEventType = (option) => {
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
            const indexF = warning.indexOf('notFilled');
            if (indexF !== -1) {
                warning.splice(indexF, 1);
            }
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
        const index = warning.indexOf('notFilled');
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
    }
}

ApplicationForm.propTypes = {
    closeAppWindow: PropTypes.func.isRequired,
    userLogin: PropTypes.string.isRequired,
    token: PropTypes.string.isRequired,
    showHint: PropTypes.func.isRequired,
    closeHint: PropTypes.func.isRequired,
    roomArray: PropTypes.array.isRequired,
    minAppRef: PropTypes.object.isRequired
};

export default ApplicationForm;