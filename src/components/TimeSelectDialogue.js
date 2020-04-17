import React, {Component} from 'react';
import PropTypes from 'prop-types';
import '../resource/styles/TimeSelectDialogue.css'

class TimeSelectDialogue extends Component {

    handleInput = (e) => {
        this.props.changeTiming(e.target.name, e.target.value)
    };

    render() {
        const { startH, startM, endH, endM } = this.props.dayToShow;
        const { startHRef, startMRef, endHRef, endMRef, checkBoxRef } = this.props;
        return (
            <div id='timing-container'>
                <label>Время начала мероприятия: </label>
                <input
                    className='time-input'
                    type='text'
                    defaultValue={startH}
                    min={0}
                    max={23}
                    name='startH'
                    onChange={e => this.handleInput(e)}
                    ref={startHRef}
                />
                <label> ч </label>
                <input
                    className='time-input'
                    type='text'
                    defaultValue={startM}
                    min={0}
                    max={59}
                    name='startM'
                    onChange={e => this.handleInput(e)}
                    ref={startMRef}
                />
                <label> мин</label><br/>
                <label>Время окончания мероприятия: </label>
                <input
                    className='time-input'
                    type='text'
                    defaultValue={endH}
                    min={0}
                    max={23}
                    name='endH'
                    onChange={e => this.handleInput(e)}
                    ref={endHRef}
                />
                <label> ч </label>
                <input
                    className='time-input'
                    type='text'
                    defaultValue={endM}
                    min={0}
                    max={59}
                    name='endM'
                    onChange={e => this.handleInput(e)}
                    ref={endMRef}
                />
                <label> мин</label><br/>
                <input
                    type='checkbox'
                    onChange={(e) => {this.props.setForAll(e)}}
                    ref={checkBoxRef}
                />
                <label>Установить такие временные рамки для всех выбранных дней</label><br/>
                <button onClick={()=> {this.props.closeTimeSelectDialogue()}}>OK</button>
            </div>
        );
    }
}

TimeSelectDialogue.propTypes = {
    dayToShow: PropTypes.object.isRequired,
    changeTiming: PropTypes.func.isRequired,
    setForAll: PropTypes.func.isRequired,
    closeTimeSelectDialogue: PropTypes.func.isRequired,
    startHRef: PropTypes.func.isRequired,
    startMRef: PropTypes.func.isRequired,
    endHRef: PropTypes.func.isRequired,
    endMRef: PropTypes.func.isRequired,
    checkBoxRef: PropTypes.func.isRequired
};

export default TimeSelectDialogue;