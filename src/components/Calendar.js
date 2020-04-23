import React from 'react';
import moment from 'moment';
import '../resource/styles/Calendar.css'
import TimeSelectDialogue from "./TimeSelectDialogue";
import Timing from "../functional/Timing";
import '../resource/styles/Main.css'
import PropTypes from 'prop-types';
import Dropdown from "./Dropdown";

class Calendar extends React.Component {

    state = this.props.savedState.nothing === 'nothing'
        ?
        {
            dateContext: moment(),
            today: moment(),
            showYearNav: false,
            selectedDays: [],
            selectedTimings: [],
            lastChosenWithShift: null,
            timeSelectDialogue: null,
            currentlyManagedDayIndex: -1,
            nothing: 'something',
            warning: ''
        }
        :
        this.props.savedState;

    weekdaysShort = ['ПН', 'ВТ', 'СР', 'ЧТ', 'ПТ', 'СБ', 'ВС'];
    months = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'];

    year = () => this.state.dateContext.format("Y");

    month = () => {
        const monthEng = this.state.dateContext.format("MMMM");
        // eslint-disable-next-line default-case
        switch (monthEng) {
            case 'January': {
                return 'Январь';
            }
            case 'February': {
                return 'Февраль';
            }
            case 'March': {
                return 'Март';
            }
            case 'April': {
                return 'Апрель';
            }
            case 'May': {
                return 'Май';
            }
            case 'June': {
                return 'Июнь';
            }
            case 'July': {
                return 'Июль';
            }
            case 'August': {
                return 'Август';
            }
            case 'September': {
                return 'Сентябрь';
            }
            case 'October': {
                return 'Октябрь';
            }
            case 'November': {
                return 'Ноябрь';
            }
            case 'December': {
                return 'Декабрь';
            }
        }
    };

    daysInMonth = () => this.state.dateContext.daysInMonth();

    firstDayOfMonth = () => moment(this.state.dateContext).startOf('month').format('d');

    setMonth = (monthOpt) => {
        const month = monthOpt.rusName;
        const monthNo = this.months.indexOf(month);
        let dateContext = Object.assign({}, this.state.dateContext);
        dateContext = moment(dateContext).set("month", monthNo);
        this.setState({
            dateContext: dateContext
        });
    };

    moveMonth = (side) => {
        let dateContext = Object.assign({}, this.state.dateContext);
        dateContext = moment(dateContext).add(side, "month");
        this.setState({
            dateContext: dateContext
        });
    };

    showYearEditor = () => {

        document.addEventListener('click', this.handleClickOutside, false);

        this.setState({
            showYearNav: true
        });
    };

    setYear = (userInput) => {
        if (/\d+/.test(userInput)) {
            let dateContext = Object.assign({}, this.state.dateContext);
            dateContext = moment(dateContext).set("year", +userInput);
            this.setState({
                dateContext: dateContext
            });
        }
    };

    onKeyUpYear = (e) => {
        if (/^\d*$/.test(e.target.value) && (e.which === 13 || e.which === 27)) {
            if (e.target.value !== '') {
                this.setYear(e.target.value);
            }
            document.removeEventListener('click', this.handleClickOutside, false);
            this.setState({
                showYearNav: false
            })
        }
    };

    YearNav = () => {
        return (
            this.state.showYearNav
                ?
                <span className='flex-container'>
                    <input
                        defaultValue={this.year()}
                        onKeyUp={e => this.onKeyUpYear(e)}
                        onChange={e => this.invalidInput(e, 'year')}
                        type="text"
                        className='small-text-input'
                        id='year-inp-line'
                    />
                    <button
                        className='transparent-element no-border-element hover-text'
                        style={{marginLeft: '7px'}}
                        id='ok-year'
                        onClick={() => this.okYear()}
                    >
                        OK
                    </button>
                    {
                        this.state.warning === 'year'
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
                </span>
                :
                <span
                    onClick={() => {
                        this.showYearEditor()
                    }}
                    className='hover-text'
                >
                {this.year()}
                </span>
        );
    };

    exactDayDescription = (day) => {
        const monthIndex = moment.months().indexOf(this.state.dateContext.format("MMMM"));
        const monthShort = moment.monthsShort()[monthIndex];
        const weekdayShort = moment.weekdaysShort()[(+this.firstDayOfMonth() + day - 1) % 7];
        return `${weekdayShort} ${monthShort} ${day} ${this.year()}`
    };

    shiftSelect = (e, day) => {
        const clickedDayDescription = this.exactDayDescription(day);
        const additionDays = [];
        const additionTimings = [];
        if (this.state.lastChosenWithShift === null) {
            if (!this.state.selectedDays.includes(clickedDayDescription)) {
                additionDays.push(clickedDayDescription);
                additionTimings.push(new Timing());
            }
            this.setState({
                lastChosenWithShift: day,
                selectedDays: [...this.state.selectedDays, ...additionDays],
                selectedTimings: [...this.state.selectedTimings, ...additionTimings]
            });
        } else {
            if (this.state.lastChosenWithShift < day) {
                for (let i = this.state.lastChosenWithShift + 1; i <= day; i++) {
                    const iDesc = this.exactDayDescription(i);
                    if (!this.state.selectedDays.includes(iDesc)) {
                        additionDays.push(iDesc);
                        additionTimings.push(new Timing());
                    }
                }
            } else {
                for (let i = day; i <= this.state.lastChosenWithShift - 1; i++) {
                    const iDesc = this.exactDayDescription(i);
                    if (!this.state.selectedDays.includes(iDesc)) {
                        additionDays.push(iDesc);
                        additionTimings.push(new Timing());
                    }
                }
            }
            this.setState({
                lastChosenWithShift: null,
                selectedDays: [...this.state.selectedDays, ...additionDays],
                selectedTimings: [...this.state.selectedTimings, ...additionTimings]
            })
        }
    };

    onDayClick = (e, day) => {
        if (e.target.className.indexOf('time-set-button') === -1) {
            const clickedDayDescription = this.exactDayDescription(day);
            if (e.shiftKey) {
                this.shiftSelect(e, day);
            } else {
                const newSelectedDays = this.state.selectedDays.slice();
                const newSelectedTimings = this.state.selectedTimings.slice();
                const index = newSelectedDays.indexOf(clickedDayDescription);
                if (index > -1) {
                    newSelectedDays.splice(index, 1);
                    newSelectedTimings.splice(index, 1);
                } else {
                    newSelectedDays.push(clickedDayDescription);
                    newSelectedTimings.push(new Timing());
                }
                const timeSelect =
                    (index === +this.state.currentlyManagedDayIndex) ? null : this.state.timeSelectDialogue;
                let newDayIndex = this.state.currentlyManagedDayIndex;
                newDayIndex -= (index < newDayIndex) ? 1 : 0;
                this.setState({
                    selectedDays: newSelectedDays,
                    selectedTimings: newSelectedTimings,
                    timeSelectDialogue: timeSelect,
                    currentlyManagedDayIndex: newDayIndex
                });
            }
        }
    };

    changeTiming = (attr, timing) => {
        const newTimings = this.state.selectedTimings.slice();
        newTimings[this.state.currentlyManagedDayIndex].setTiming(attr, timing);
        this.setState({
            selectedTimings: newTimings
        })
    };

    render() {
        const weekdays = this.weekdaysShort.map((day) => {
            return (
                <td key={day} className='weekday drag-detector'>{day}</td>
            )
        });

        const blanks = [];
        const realBlanksLen = +this.firstDayOfMonth() === 0 ? 7 : +this.firstDayOfMonth();
        for (let i = 1; i < realBlanksLen; i++) {
            blanks.push(<td key={i * 80} className='drag-detector'>{""}</td>);
        }

        const daysInMonth = [];
        for (let d = 1; d <= this.daysInMonth(); d++) {
            let dayClass = 'day';
            if (this.state.selectedDays.includes(this.exactDayDescription(d))) {
                dayClass += ' selected-day';
            } else {
                dayClass += ' non-selected-day';
                const dayOfWeek = (blanks.length + d) % 7;
                dayClass += (dayOfWeek === 0 || dayOfWeek === 6) ? ' non-selected-weekend' : ' non-selected-weekday'
            }
            daysInMonth.push(
                <td
                    key={d} onClick={(e) => {
                    this.onDayClick(e, d)
                }}
                    className={dayClass}
                >
                    {d}
                    <button
                        className={this.getTimeSetButtonClass(d)}
                        onClick={e => this.timeSetButton(e, d)}
                        onMouseEnter={e => {if (!e.shiftKey) this.props.showHint(e, 'timeSet')}}
                        onMouseLeave={() => this.props.closeHint()}
                    >
                    </button>
                </td>
            );
        }

        const totalSlots = [...blanks, ...daysInMonth];
        const rows = [];
        let cells = [];

        totalSlots.forEach((row, i) => {
            if ((i % 7) !== 0) {
                cells.push(row);
            } else {
                rows.push(cells.slice());
                cells = [];
                cells.push(row);
            }
            if (i === totalSlots.length - 1) {
                rows.push(cells.slice());
            }
        });

        const trElements = rows.map((d, i) => {
            return (
                <tr key={i * 100}>
                    {d}
                </tr>
            );
        });

        const monthOptions = this.months.map(
            monthRusName => {
                return {rusName: monthRusName, additional: null};
            });

        return (
            <div id='calendar-container' className='drag-detector block-container'>

                <table id='calendar-table' className='transparent-element drag-detector'>
                    <thead id='calendar-head'>
                    <tr>
                        <td colSpan="5" className='drag-detector'>
                            <div className='drag-detector flex-container' style={{margin: 'auto'}}>
                                <Dropdown
                                    header={this.month()}
                                    options={monthOptions}
                                    onChoose={this.setMonth}
                                    withButton={false}
                                    left={-13}
                                    showHint={this.props.showHint}
                                    closeHint={this.props.closeHint}
                                />
                                <this.YearNav/>
                            </div>
                        </td>
                        <td colSpan="2" className='drag-detector'>
                            <button
                                id='prev'
                                className='time-move-btn'
                                onClick={() => {
                                    this.moveMonth(-1)
                                }}>{''}</button>
                            <button
                                id='next'
                                className='time-move-btn'
                                onClick={() => {
                                    this.moveMonth(1)
                                }}>{''}</button>
                        </td>
                    </tr>
                    </thead>
                    <tbody>
                    <tr>
                        {weekdays}
                    </tr>
                    {trElements}
                    </tbody>
                </table>

                <p className='flex-container' style={{flexDirection: 'row-reverse'}}>
                    <label
                        className='hover-text'
                        onClick={() => this.clearSelectedDates()}
                        onMouseEnter={e => this.props.showHint(e, 'clearCalendar')}
                        onMouseLeave={() => this.props.closeHint()}
                    >
                        Очистить
                    </label>
                </p>

                <p className='drag-detector text-display'>
                    Чтобы выбрать сразу несколько дат, идущих подряд, зажмите клавишу Shift и выберите первый и
                    последний день интервала
                </p>

                {this.state.timeSelectDialogue}
            </div>

        );
    }

    timeSetButton = (e, day) => {
        const dayDesc = this.exactDayDescription(day);
        if (!this.state.selectedDays.includes(dayDesc)) {
            this.setState({
                selectedDays: [...this.state.selectedDays, dayDesc],
                selectedTimings: [...this.state.selectedTimings, new Timing()]
            })
        }
        if (!e.shiftKey) {
            const prob = this.state.selectedDays.indexOf(dayDesc);
            const index = prob === -1 ? this.state.selectedDays.length : prob;
            const newTimingObj = prob === -1 ? new Timing() : this.state.selectedTimings[index];
            const timeSelect =
                <
                    TimeSelectDialogue
                    dayToShow={newTimingObj}
                    changeTiming={this.changeTiming}
                    setForAll={this.setForAll}
                    closeTimeSelectDialogue={() => this.closeTimeSettings()}
                    startHRef={el => {
                        if (el != null) el.value = el.defaultValue
                    }}
                    startMRef={el => {
                        if (el != null) el.value = el.defaultValue
                    }}
                    endHRef={el => {
                        if (el != null) el.value = el.defaultValue
                    }}
                    endMRef={el => {
                        if (el != null) el.value = el.defaultValue
                    }}
                    checkBoxRef={el => {
                        if (el != null) el.checked = false
                    }}
                    showHint={this.props.showHint}
                    closeHint={this.props.closeHint}
                />;
            this.setState({
                currentlyManagedDayIndex: index,
                timeSelectDialogue: timeSelect
            })
        } else {
            this.shiftSelect(e, day);
        }
    };

    getTimeSetButtonClass = (day) => {
        return this.state.selectedDays.includes(this.exactDayDescription(day))
            ? 'time-set-button time-set-button-orange'
            : 'time-set-button time-set-button-white'
    };

    closeTimeSettings = () => {
        this.setState({
            timeSelectDialogue: null
        })
    };

    setForAll = (e) => {
        const newTimings = this.state.selectedTimings.slice();
        const ind = this.state.currentlyManagedDayIndex;
        if (e.target.checked) {
            const globalTiming = this.state.selectedTimings[this.state.currentlyManagedDayIndex];
            for (let i = 0; i < newTimings.length; i++) {
                if (i !== ind) {
                    newTimings[i].storeLastValue();
                    newTimings[i].setTimingFull(globalTiming);
                }
            }
        } else {
            for (let i = 0; i < newTimings.length; i++) {
                if (i !== ind) {
                    newTimings[i].backup();
                }
            }
        }
        this.setState({
            selectedTimings: newTimings
        })
    };

    clearSelectedDates = () => {
        this.setState({
            selectedDays: [],
            selectedTimings: [],
            timeSelectDialogue: null,
            currentlyManagedDayIndex: -1,
            lastChosenWithShift: null
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
    };

    okYear = () => {
        const y = document.getElementById('year-inp-line');
        if (/^\d+$/.test(y.value)) {
            this.setYear(y.value);
            document.removeEventListener('click', this.handleClickOutside, false);
            this.setState({
                showYearNav: false
            })
        }
    };

    handleClickOutside = (e) => {
        if (!['year-inp-line', 'ok-year'].includes(e.target.id)) {
            this.okYear();
        }
    };
}

Calendar.propTypes = {
    savedState: PropTypes.object.isRequired,
    showHint: PropTypes.func.isRequired,
    closeHint: PropTypes.func.isRequired
};

export default Calendar;