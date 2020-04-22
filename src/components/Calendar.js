import React from 'react';
import moment from 'moment';
import '../resource/styles/Calendar.css'
import TimeSelectDialogue from "./TimeSelectDialogue";
import Timing from "../functional/Timing";
import '../resource/styles/Main.css'
import PropTypes from 'prop-types';

class Calendar extends React.Component {

    state = this.props.savedState.nothing === 'nothing'
        ?
        {
            dateContext: moment(),
            today: moment(),
            showMonthPopup: false,
            showYearPopup: false,
            selectedDays: [],
            selectedTimings: [],
            lastChosenWithShift: null,
            timeSelectDialogue: null,
            currentlyManagedDayIndex: -1,
            nothing: 'something'
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

    setMonth = (month) => {
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

    SelectList = (props) => {
        const popup = props.monthList.map((monthName) => {
            return (
                <div key={monthName}>
                    <p className='hover-text' onClick={() => {
                        this.setMonth(monthName)
                    }}>
                        {monthName}
                    </p>
                </div>
            );
        });

        return (
            <div id='month-select-popup'>
                {popup}
            </div>
        );
    };

    onChangeMonth = () => {
        this.setState({
            showMonthPopup: !this.state.showMonthPopup
        });
    };

    MonthNav = () => {
        return (
            <span id='month-nav' className='hover-text' onClick={() => {
                this.onChangeMonth()
            }}>
                {this.month()}
                {this.state.showMonthPopup
                    ? <this.SelectList monthList={this.months}/>
                    : null
                }
            </span>
        );
    };

    showYearEditor = () => {
        this.setState({
            showYearNav: !this.state.showYearNav
        });
    };

    setYear = (e) => {
        const userInput = e.target.value;
        if (/\d+/.test(userInput)) {
            let dateContext = Object.assign({}, this.state.dateContext);
            dateContext = moment(dateContext).set("year", e.target.value);
            this.setState({
                dateContext: dateContext
            });
        }
    };

    onKeyUpYear = (e) => {
        if (e.which === 13 || e.which === 27) {
            this.setYear(e);
            this.setState({
                showYearNav: false
            })
        }
    };

    YearNav = () => {
        return (
            this.state.showYearNav
                ?
                <span>
                    <input
                        defaultValue={this.year()}
                        onKeyUp={(e) => this.onKeyUpYear(e)}
                        type="number"
                    />
                    <button
                        className='transparent-element no-border-element hover-text'
                        onClick={() => {
                            this.showYearEditor()
                        }}
                    >
                        OK
                    </button>
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

    onDayClick = (e, day) => {
        if (e.target.className.indexOf('time-set-button') === -1) {
            const clickedDayDescription = this.exactDayDescription(day);
            if (e.shiftKey) {
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
                <td key={day} className='weekday'>{day}</td>
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
                        onClick={(e) => {
                            this.timeSetButton(e, d)
                        }}>
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

        return (
            <div id='calendar-container' className='drag-detector block-container'>
                <table id='calendar-table' className='transparent-element drag-detector'>
                    <thead id='calendar-head'>
                    <tr>
                        <td colSpan="5">
                            <this.MonthNav/>
                            {" "}
                            <this.YearNav/>
                        </td>
                        <td colSpan="2">
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
                />;
            this.setState({
                currentlyManagedDayIndex: index,
                timeSelectDialogue: timeSelect
            })
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
}

Calendar.propTypes = {
    savedState: PropTypes.object.isRequired
};

export default Calendar;