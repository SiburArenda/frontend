import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Room, TypeOfEvent} from '../../functional/EnumsAndConsts'
import Calendar from "../Calendar";
import '../../resource/styles/ApplicationForm.css'
import '../../resource/styles/Main.css'

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
        eventType: TypeOfEvent.CONCERT,
        rooms: [],
        viewersExpected: false,
        viewers: 0,
        comment: '',
        offsetX: 0,
        offsetY: 0,
        dragged: false,
        resized: false,
        showPickRoom: false
    };

    position = {
        top: '40px',
        left: '400px'
    };

    render() {
        return (
            <div id='application-form'
                 className='drag-detector'
                 style={this.position}
                 onMouseDown={e => this.startFormDrag(e)}
                 onMouseMove={e => this.dragForm(e)}
                 onMouseUp={() => this.stopDrag()}
                 onMouseLeave={() => this.stopDrag()}
            >
                <div className='btn-pusher drag-detector'>
                    <button onClick={this.props.closeAppWindow} id='close-btn'>{''}</button>
                </div>
                <br/>
                <div className='block-container ninety-container drag-detector'>
                    <label className='drag-detector'>Название мероприятия:</label>
                    <input
                        type='text'
                        name='eventName'
                        onChange={(e) => {
                            this.handleInput(e)
                        }}
                        className='medium-text-input'
                    />
                    <br/>
                    <label className='drag-detector'>Тип мероприятия:</label>
                    <select name='eventType' onChange={(e) => {
                        this.handleInput(e)
                    }}>
                        <option value={TypeOfEvent.CONCERT}>Концерт, представление</option>
                        <option value={TypeOfEvent.PARTY}>Корпоратив, семинар, собрание</option>
                        <option value='SPORT'>Спорт</option>
                        <option value={TypeOfEvent.OTHER}>Другое</option>
                    </select>
                    <br/>
                    {['SPORT', 'MATCH', 'TRAINING'].includes(this.state.eventType)
                        ?
                        <React.Fragment>
                            <input name='eventType' type='radio' value='TRAINING' onChange={(e) => {
                                this.handleInput(e)
                            }}/><label>Тренировка</label><br/>
                            <input name='eventType' type='radio' value='MATCH' onChange={(e) => {
                                this.handleInput(e)
                            }}/><label>Матч</label><br/>
                        </React.Fragment>
                        :
                        null
                    }
                    <this.PickRoom/>
                    {this.state.rooms.length === 0
                        ?
                        <React.Fragment>
                            <br/>
                            <label className='placeholder'>Вы ещё не выбрали ни одного помещения</label>
                            <br/>
                        </React.Fragment>
                        :
                        <div id='picked-rooms-display'>
                            {this.state.rooms.map(room => <this.RoomSpan room={room}/>)}
                        </div>
                    }
                    {this.state.eventType === TypeOfEvent.OTHER || this.state.eventType === TypeOfEvent.PARTY
                        ?
                        <React.Fragment>
                            <label className='drag-detector'>Ожидается ли на Вашем мероприятии зрительская
                                аудитория?</label><br/>
                            <input name='viewersExpected' type='radio' value={true} onChange={(e) => {
                                this.handleInput(e)
                            }}/><label>Да</label><br/>
                            <input name='viewersExpected' type='radio' value={false} onChange={(e) => {
                                this.handleInput(e)
                            }}/><label>Нет</label><br/>
                        </React.Fragment>
                        :
                        null
                    }
                    {['MATCH', 'PARTY'].includes(this.state.eventType) || this.state.viewersExpected === 'true'
                        ?
                        <React.Fragment>
                            <label className='drag-detector'>Сколько зрителей вы ожидаете?</label>
                            <input
                                type='text'
                                name='viewers'
                                onChange={(e) => {
                                    this.handleInput(e)
                                }}
                                className='small-text-input'
                            /><br/>
                        </React.Fragment>
                        :
                        null
                    }
                </div>
                <Calendar ref={this.calendarRef}/><br/>
                <div className='block-container ninety-container drag-detector'>
                    <textarea
                        name='comment'
                        onChange={e => this.handleInput(e)}
                        className='big-text-input'
                    />
                </div>
                <br/>
                <div className='btn-pusher drag-detector'>
                    <button
                        id='send-btn'
                        className='hover-text'
                        onClick={e => this.sendApplication(e)}>
                        Отправить заявку
                    </button>
                </div>
            </div>
        );
    }

    handleInput = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        });
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
        if (!this.state.rooms.includes(room)) {
            this.setState({
                rooms: [...this.state.rooms, room]
            })
        }
    };

    startFormDrag = (e) => {
        if (e.target.className.indexOf('drag-detector') !== -1) {
            const movedObj = document.getElementById('application-form');
            const mouseX = +e.screenX;
            const mouseY = +e.screenY;

            const clientHeight = +movedObj.clientHeight;
            const clientWidth = +movedObj.clientWidth;

            const formXpx = movedObj.style.left;
            const formX = +formXpx.substr(0, formXpx.length - 2);

            const formYpx = movedObj.style.top;
            const formY = +formYpx.substr(0, formYpx.length - 2);

            const offsetX = mouseX - formX;
            const offsetY = mouseY - formY;

            if (clientHeight - offsetY > 25 || clientWidth - offsetX > 90) {
                this.setState({
                    offsetX: offsetX,
                    offsetY: offsetY,
                    dragged: true
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
            this.setState({
                dragged: false
            })
        }
    };

    RoomSelect = () => {
        const popup = Room.map((roomInfo) => {
            return (
                <div key={roomInfo.stringId}>
                    <p
                        onClick={() => {
                            this.addRoom(roomInfo)
                        }}
                        className='hover-text'
                    >
                        {roomInfo.rusName}
                    </p>
                </div>
            );
        });
        return (
            <div id='room-select-popup'>
                {popup}
            </div>
        );
    };

    PickRoom = () => {
        return (
            <span id='pick-room' className='hover-text' onClick={() => this.openPickRoom()}>
                Добавить помещение
                {this.state.showPickRoom
                    ? <this.RoomSelect/>
                    : null}
            </span>
        );
    };

    RoomSpan = (props) => {
        return (
            <span className='room-span'>
                {props.room.rusName}
                <button onClick={() => this.removeRoom(props.room)} className='remove-room-btn'>{''}</button>
            </span>
        );
    };

    openPickRoom = () => {
        this.setState({
            showPickRoom: !this.state.showPickRoom
        })
    };

    removeRoom = (room) => {
        const noRoom = this.state.rooms.slice();
        const index = noRoom.indexOf(room);
        noRoom.splice(index, 1);
        this.setState({
            rooms: noRoom
        })
    };
}

ApplicationForm.propTypes = {
    closeAppWindow: PropTypes.func.isRequired,
    userName: PropTypes.string.isRequired,
    token: PropTypes.string.isRequired
};

export default ApplicationForm;