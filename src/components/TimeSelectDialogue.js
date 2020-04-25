import React, {Component} from 'react';
import PropTypes from 'prop-types';
import '../resource/styles/TimeSelectDialogue.css'

class TimeSelectDialogue extends Component {

    state = {
        warning: []
    };

    handleInput = (e) => {
        const obj = e.target;

        if (!/^\d*$/.test(obj.value) || +obj.value < obj.min || +obj.value > obj.max) {
            if (!this.state.warning.includes(obj.id)){
                this.setState({
                    warning: [...this.state.warning, obj.id]
                })
            }
        } else {
            this.props.closeHint();
            const warnArray = this.state.warning.slice();
            const index = warnArray.indexOf(obj.id);
            warnArray.splice(index, 1);
            if (index !== -1) {
                this.setState({
                    warning: warnArray
                })
            }
            if (obj.value !== '') {
                this.props.changeTiming(e.target.name, e.target.value);
            }
        }
    };

    render() {
        const { startH, startM, endH, endM } = this.props.dayToShow;
        const { startHRef, startMRef, endHRef, endMRef, checkBoxRef } = this.props;
        return (
            <div id='timing-container' className='drag-detector'>

                <div className='flex-container drag-detector' style={{width: '100%'}}>

                    <div className='block-col-left drag-detector'>

                        <p className='drag-detector'>Время начала:</p>

                        <p className='drag-detector'>Время окончания:</p>

                    </div>

                    <div className='block-col-right drag-detector'>

                        <div className='flex-container drag-detector'>

                            <input
                                id='s-h-i'
                                className='time-input'
                                type='text'
                                defaultValue={startH}
                                min={0}
                                max={23}
                                name='startH'
                                onClick={e => this.addClickOutside(e)}
                                onChange={e => this.handleInput(e)}
                                ref={startHRef}
                            />

                            <label className='drag-detector hour-min'>ч</label>

                            {
                                this.state.warning.includes('s-h-i')
                                    ?
                                    <div
                                        className='warning'
                                        onMouseEnter={e => this.props.showHint(e, 'interval%0%23')}
                                        onMouseLeave={() => this.props.closeHint()}
                                    >
                                    </div>
                                    :
                                    <div
                                        className='empty-warning'
                                    >
                                    </div>
                            }

                            <input
                                id='s-m-i'
                                className='time-input'
                                type='text'
                                defaultValue={startM}
                                min={0}
                                max={59}
                                name='startM'
                                onChange={e => this.handleInput(e)}
                                onClick={e => this.addClickOutside(e)}
                                ref={startMRef}
                            />

                            <label className='drag-detector hour-min'>мин</label>

                            {
                                this.state.warning.includes('s-m-i')
                                    ?
                                    <div
                                        className='warning'
                                        onMouseEnter={e => this.props.showHint(e, 'interval%0%59')}
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

                        <div className='flex-container drag-detector'>

                            <input
                                id='e-h-i'
                                className='time-input'
                                type='text'
                                defaultValue={endH}
                                min={0}
                                max={23}
                                name='endH'
                                onChange={e => this.handleInput(e)}
                                onClick={e => this.addClickOutside(e)}
                                ref={endHRef}
                            />

                            <label className='drag-detector hour-min'>ч</label>

                            {
                                this.state.warning.includes('e-h-i')
                                    ?
                                    <div
                                        className='warning'
                                        onMouseEnter={e => this.props.showHint(e, 'interval%0%23')}
                                        onMouseLeave={() => this.props.closeHint()}
                                    >
                                    </div>
                                    :
                                    <div
                                        className='empty-warning'
                                    >
                                    </div>
                            }

                            <input
                                id='e-m-i'
                                className='time-input'
                                type='text'
                                defaultValue={endM}
                                min={0}
                                max={59}
                                name='endM'
                                onChange={e => this.handleInput(e)}
                                onClick={e => this.addClickOutside(e)}
                                ref={endMRef}
                            />

                            <label className='drag-detector hour-min'>мин</label>

                            {
                                this.state.warning.includes('e-m-i')
                                    ?
                                    <div
                                        className='warning'
                                        onMouseEnter={e => this.props.showHint(e, 'interval%0%59')}
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

                    </div>

                </div>

                <div id='checkbox-aligner'>
                    <input
                        type='checkbox'
                        onChange={e => {this.props.setForAll(e)}}
                        ref={checkBoxRef}
                        id='hidden-check'
                    />
                    <label
                        htmlFor='hidden-check'
                        onMouseEnter={e => this.props.showHint(e, 'forAllCheck')}
                        onMouseLeave={() => this.props.closeHint()}
                    >
                    </label>
                    <label>Установить такие временные рамки для всех выбранных дат</label><br/>
                </div>
                <div className='btn-pusher'>
                    <button
                        onClick={() => {
                            this.props.closeHint();
                            this.props.closeTimeSelectDialogue()
                        }}
                        className='hover-text transparent-element no-border-element'
                        style={{marginRight: '15px'}}
                        onMouseEnter={e => this.props.showHint(e, 'timeSelOK')}
                        onMouseLeave={() => this.props.closeHint()}
                    >
                        OK
                    </button>
                </div>
            </div>
        );
    }

    addClickOutside = (e) => {

        const obj = e.target;

        const clickOutside = (event) => {
            if (event.target.id !== obj.id) {

                if (!/^\d+$/.test(obj.value) || +obj.value < obj.min || +obj.value > obj.max) {
                    obj.value = 0;
                    const warnArray = this.state.warning.slice();
                    const index = warnArray.indexOf(obj.id);
                    if (index !== -1) {
                        warnArray.splice(index, 1);
                        this.setState({
                            warning: warnArray
                        })
                    }
                }

                document.removeEventListener('click', clickOutside, false);
            }
        };

        document.addEventListener('click', clickOutside, false);
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
    checkBoxRef: PropTypes.func.isRequired,
    showHint: PropTypes.func.isRequired,
    closeHint: PropTypes.func.isRequired
};

export default TimeSelectDialogue;