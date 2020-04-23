import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Room} from '../../functional/EnumsAndConsts'
import Calendar from "../Calendar";
import '../../resource/styles/ApplicationForm.css'
import '../../resource/styles/Main.css'
import {BrowserRouter as Router} from "react-router-dom";
import MinifiedApplicationForm from "./MinifiedApplicationForm";
import Dropdown from "../Dropdown";

class FromTo {
    constructor(from, to) {
        this.from = from;
        this.to = to;
    }
}

class ApplicationForm extends Component {

    constructor(props) {
        super(props);

        this.calendarRef = React.createRef();
    }

    state = {
        eventName: null,
        eventType: 'PARTY',
        rooms: [],
        viewersExpected: 'false',
        viewers: 0,
        comment: '',
        offsetX: 0,
        offsetY: 0,
        dragged: false,
        resized: false,
        minimized: false,
        minimizedX: 0,
        minimizedY: 0,
        calendarState: {nothing: 'nothing'},
        warning: '',
        grabbed: null
    };

    eventTypeOptions = [
        {rusName: 'Концерт, представление', additional: null},
        {rusName: 'Корпоратив, семинар, собрание', additional: null},
        {rusName: 'Спорт', additional: null},
        {rusName: 'Другое', additional: null}
    ];

    render() {

        const roomOptions = Room.map(roomInfo => {
            return {rusName: roomInfo.rusName, additional: null} //TODO: add Link to Room Page as additional
        });

        return (
            <Router>
                {
                    this.state.minimized
                        ?
                        <MinifiedApplicationForm
                            showHint={this.props.showHint}
                            closeHint={this.props.closeHint}
                            closeAppWindow={this.props.closeAppWindow}
                            expand={this.expand}
                            posX={this.state.minimizedX}
                            posY={this.state.minimizedY}
                        />
                        :
                        <div id='application-form'
                             className='drag-detector'
                             onMouseDown={e => this.startFormDrag(e)}
                             onMouseMove={e => this.dragForm(e)}
                             onMouseUp={() => this.stopDrag()}
                             onMouseLeave={() => this.stopDrag()}
                        >
                            <div className='btn-pusher drag-detector'>
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
                                <button
                                    onClick={() => this.minimize()}
                                    onMouseEnter={e => this.props.showHint(e, 'minAppFormBtn')}
                                    onMouseLeave={() => this.props.closeHint()}
                                    id='minimize-btn'
                                >
                                </button>
                            </div>

                            <div className='block-container ninety-container drag-detector'>

                                <div className='block-col-left drag-detector'>

                                    <p className='drag-detector'>Название мероприятия:</p>

                                    <p className='drag-detector'>Тип мероприятия:</p>

                                    {['MATCH', 'TRAINING'].includes(this.state.eventType)
                                        ?
                                        <p className='drag-detector' style={{height: '1.7em'}}>{''}</p>
                                        :
                                        null
                                    }

                                    <p className='drag-detector'>Помещения:</p>

                                </div>

                                <div className='block-col-right drag-detector'>

                                    <input
                                        type='text'
                                        name='eventName'
                                        onChange={(e) => {
                                            this.handleInput(e, null)
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
                                                        this.handleInput(e, null)
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
                                                        this.handleInput(e, null)
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

                                    <div id='picked-rooms-display'>
                                        <Dropdown
                                            header='Добавить'
                                            options={roomOptions}
                                            onChoose={this.addRoom}
                                            withButton={false}
                                            marginRight={8}
                                            showHint={this.props.showHint}
                                            closeHint={this.props.closeHint}
                                        />
                                        {this.state.rooms.map(room => <this.RoomSpan key={room.rusName} room={room}/>)}
                                    </div>

                                </div>

                            </div>

                            <div className='block-container ninety-container drag-detector'>

                                <div className='block-col-left drag-detector'>

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
                                            ? <p className='drag-detector'>Количество зрителей:</p>
                                            : null
                                    }
                                </div>

                                <div className='block-col-right drag-detector'>

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
                                                            this.handleInput(e, null)
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
                                                            this.handleInput(e, null)
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
                                                    onChange={e => {
                                                        this.handleInput(e, this.invalidInput(e, 'viewers'))
                                                    }}
                                                    className='small-text-input'
                                                    defaultValue={this.state.viewers === 0 ? '' : this.state.viewers}
                                                />

                                                {
                                                    this.state.warning === 'viewers'
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
                                savedState={this.state.calendarState}
                                showHint={this.props.showHint}
                                closeHint={this.props.closeHint}
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
            </Router>

        );
    }

    handleInput = (e, callback) => {
        this.setState({
            [e.target.name]: e.target.value
        });

        if (callback != null) {
            callback();
        }
    };

    sendApplication = () => {
        const nameJSON = `"name":"${this.state.eventName}",`;
        const audJSON = `"auditory":${this.state.viewers},`;
        const typeJSON = `"type":"${this.state.eventType}",`;
        const roomsJSON = `"rooms":${JSON.stringify(this.state.rooms.map(room => room.stringId))},`;
        const userJSON = `"user":"${this.props.userName}",`;

        const datesArraySel = this.calendarRef.current.state.selectedDays;
        const timesArraySel = this.calendarRef.current.state.selectedTimings;
        const dateArrJSON = JSON.stringify(JSON.stringify(this.dateTimeJSON(datesArraySel, timesArraySel)));
        const dateJSON = `"dates":${dateArrJSON},`;

        const commentJSON = `"comment":"${this.state.comment}"`;

        const toSend = '{' + nameJSON + audJSON + typeJSON + roomsJSON + userJSON + dateJSON + commentJSON + '}';

        const request = new XMLHttpRequest();

        request.onreadystatechange = function () {
            if (request.readyState === 4) {
                console.log('OK!');
            }
        };

        request.open('POST', 'http://siburarenda.publicvm.com/api/user/order', true);
        request.setRequestHeader('Authorization', 'Bearer_' + this.props.token);
        request.setRequestHeader('Content-Type', 'application/json');
        request.send(toSend)
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
        let toAdd = null;

        for (let roomInfo in Room) {
            if (room.rusName === Room[roomInfo].rusName) {
                toAdd = Room[roomInfo];
                break;
            }
        }

        if (toAdd != null && !this.state.rooms.includes(toAdd)) {
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
            const movedObj = document.getElementById('application-form');
            movedObj.style.top = (+e.screenY - this.state.offsetY) + 'px';
            movedObj.style.left = (+e.screenX - this.state.offsetX) + 'px';
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

    RoomSpan = (props) => {
        return (
            <span className='room-span' style={{order: props.room.rusName.length}}>
                {props.room.rusName}
                <button onClick={() => this.removeRoom(props.room)} className='remove-room-btn'>{''}</button>
            </span>
        );
    };

    removeRoom = (room) => {
        const noRoom = this.state.rooms.slice();
        const index = noRoom.indexOf(room);
        noRoom.splice(index, 1);
        this.setState({
            rooms: noRoom
        })
    };

    minimize = () => {
        this.props.closeHint();
        const bothCoords = this.getCoords();
        const x = bothCoords[0];
        const y = bothCoords[1];
        this.setState({
            minimizedX: x,
            minimizedY: y,
            minimized: true,
            calendarState: this.calendarRef.current.state
        })
    };

    expand = () => {
        this.props.closeHint();
        this.setState({
            minimized: false
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
                warning: where
            })
        } else {
            this.props.closeHint();
            this.setState({
                warning: ''
            })
        }
    }
}

ApplicationForm.propTypes = {
    closeAppWindow: PropTypes.func.isRequired,
    userName: PropTypes.string.isRequired,
    token: PropTypes.string.isRequired,
    showHint: PropTypes.func.isRequired,
    closeHint: PropTypes.func.isRequired
};

export default ApplicationForm;