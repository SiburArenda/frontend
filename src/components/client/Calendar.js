import React from 'react';
import moment from 'moment';
import '../../resource/styles/Calendar.css'
import TimeSelectDialogue from "./TimeSelectDialogue";
import Timing from "../../functional/Timing";
import '../../resource/styles/Main.css'
import PropTypes from 'prop-types';
import Dropdown from "../Dropdown";
import {leadZero} from "../../functional/Design";

class Calendar extends React.Component {

    constructor(props) {
        super(props);

        this.startHRef = React.createRef();
        this.startMRef = React.createRef();
        this.endHRef = React.createRef();
        this.endMRef = React.createRef();
        this.checkBoxRef = React.createRef();

        const {initState} = this.props;
        if (initState !== undefined) {
            const dates = initState.dates;
            const datesInState = [];
            const timesInState = [];
            let earliestDate = null;
            for (let i in dates) {
                const fromTo = dates[i];
                const from = fromTo.from;
                const to = fromTo.to;
                const dayDesc = from.replace(/ \d{2}:\d{2}:\d{2} NOVT/, '');
                datesInState.push(dayDesc);
                const sFP = from.split(' ');

                const monthN = moment.monthsShort().indexOf(sFP[1]);
                const checkForEarliest = moment.utc(`${sFP[5]}-${leadZero(monthN)}-${sFP[2]}T00:00:00`);
                if (earliestDate == null || checkForEarliest.isBefore(earliestDate)) {
                    earliestDate = checkForEarliest;
                }

                const splitFrom = sFP[3].split(':');
                const splitTo = to.split(' ')[3].split(':');
                const time = new Timing(+splitFrom[0], +splitFrom[1], +splitTo[0], +splitTo[1]);
                timesInState.push(time);
            }
            this.state.selectedDays = datesInState;
            this.state.selectedTimings = timesInState;
            this.state.dateContext.set('month', +earliestDate.format('MM'));
            this.state.dateContext.set('year', +earliestDate.format('YYYY'));
        } else {

            const savedStateStr = sessionStorage.getItem('Calendar');

            if (savedStateStr != null) {

                const savedState = JSON.parse(savedStateStr);

                const {
                    dateContext,
                    showYearNav,
                    selectedDays,
                    selectedTimings,
                    lastChosenWithShift,
                    currentlyManagedDayIndex,
                    warning,
                    showTimeSelect
                } = savedState;

                const len = dateContext.length;
                const dateContextM = moment.utc(dateContext.substring(0, len - 2));

                const restoredT = [];
                for (let i in selectedTimings) {
                    const strT = selectedTimings[i];
                    restoredT.push(new Timing(strT.startH, strT.startM, strT.endH, strT.endM))
                }

                this.state.dateContext = dateContextM;
                this.state.showYearNav = showYearNav;
                this.state.selectedDays = selectedDays;
                this.state.selectedTimings = restoredT;
                this.state.lastChosenWithShift = lastChosenWithShift;
                this.state.currentlyManagedDayIndex = currentlyManagedDayIndex;
                this.state.warning = warning;
                this.state.showTimeSelect = showTimeSelect;
            }
        }
    }

    state = {
        dateContext: moment(),
        showYearNav: false,
        selectedDays: [],
        selectedTimings: [],
        lastChosenWithShift: null,
        currentlyManagedDayIndex: -1,
        warning: '',
        showTimeSelect: false
    };

    componentDidMount() {
        if (this.props.chooseSomeDate !== undefined) {
            this.props.chooseSomeDate(this.state.selectedDays.length !== 0);
        }
        window.addEventListener('beforeunload', this.saveState, false);
    };

    saveState = () => {
        if (!this.props.noEdit) {
            sessionStorage.setItem('Calendar', JSON.stringify(this.state));
        }
    };

    componentWillUnmount() {
        window.removeEventListener('beforeunload', this.saveState, false);
    }

    weekdaysShort = ['ПН', 'ВТ', 'СР', 'ЧТ', 'ПТ', 'СБ', 'ВС'];
    months = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'];

    render() {

        const {selectedDays, dateContext, selectedTimings, currentlyManagedDayIndex} = this.state;
        const {showHint, closeHint, noEdit, handleKeyUp} = this.props;

        const weekdays = this.weekdaysShort.map(day => {
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

            const now = moment();
            const thenYM = dateContext.format('YYYY-MM-');
            const thenT = dateContext.format('Thh:mm:ss');
            const then = moment.utc(thenYM + leadZero(d) + thenT);

            const settable = then.isAfter(now);

            let dayClass = 'day';

            if ((!noEdit && settable) || (noEdit && selectedDays.includes(this.exactDayDescription(d)))) {
                dayClass += ' pointer';
            }

            if (selectedDays.includes(this.exactDayDescription(d))) {
                dayClass += ' selected-day';
            } else {
                dayClass += ' non-selected-day';
                const dayOfWeek = (blanks.length + d) % 7;
                dayClass += (dayOfWeek === 0 || dayOfWeek === 6) ? ' non-selected-weekend' : ' non-selected-weekday'
            }

            daysInMonth.push(
                <td
                    key={d}
                    onClick={e => this.onDayClick(e, d)}
                    className={dayClass}
                >
                    {d}
                    {
                        (!noEdit && settable) || (noEdit && selectedDays.includes(this.exactDayDescription(d)))
                            ?
                            <button
                                className={this.getTimeSetButtonClass(d)}
                                onClick={e => this.timeSetButton(e, d)}
                                onMouseEnter={e => this.timeButtonHint(e)}
                                onMouseLeave={() => closeHint()}
                            >
                            </button>
                            :
                            null
                    }
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
                                    showHint={showHint}
                                    closeHint={closeHint}
                                />
                                <this.YearNav/>
                            </div>
                        </td>
                        <td colSpan="2" className='drag-detector'>
                            <button
                                id='prev'
                                className='time-move-btn'
                                onClick={() => this.moveMonth(-1)}
                            >
                                {''}
                            </button>
                            <button
                                id='next'
                                className='time-move-btn'
                                onClick={() => this.moveMonth(1)}
                            >
                                {''}
                            </button>
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

                {
                    noEdit
                        ?
                        null
                        :
                        <React.Fragment>

                            <p className='btn-pusher'>
                                <button
                                    className='hover-text transparent-element no-border-element'
                                    onClick={() => this.clearSelectedDates()}
                                    onMouseEnter={e => showHint(e, 'clearCalendar')}
                                    onMouseLeave={() => closeHint()}
                                >
                                    Очистить
                                </button>
                            </p>

                            <p className='drag-detector text-display'>
                                Чтобы выбрать сразу несколько дат, идущих подряд, зажмите клавишу Shift и выберите первый и
                                последний день интервала
                            </p>

                        </React.Fragment>
                }

                {this.state.showTimeSelect
                    ?
                    <
                        TimeSelectDialogue
                        changeTiming={this.changeTiming}
                        setForAll={this.setForAll}
                        closeTimeSelectDialogue={this.closeTimeSettings}
                        startHRef={this.startHRef}
                        startMRef={this.startMRef}
                        endHRef={this.endHRef}
                        endMRef={this.endMRef}
                        checkBoxRef={this.checkBoxRef}
                        showHint={showHint}
                        closeHint={closeHint}
                        defaultTiming={selectedTimings[currentlyManagedDayIndex]}
                        header={this.getHeaderForTiming()}
                        handleKeyUp={handleKeyUp}
                        noEdit={noEdit}
                    />
                    :
                    null
                }
            </div>

        );
    }

    timeButtonHint = e => {
        const {noEdit, showHint} = this.props;
        if (noEdit) {
            showHint(e, 'timeSetNoEdit');
        } else if (!e.shiftKey){
            showHint(e, 'timeSet');
        }
    };

    year = () => this.state.dateContext.format("Y");

    month = () => {
        const monthInd = this.state.dateContext.format("M");
        return this.months[+monthInd - 1];
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

    onKeyUpYear = e => {
        if (/^\d*$/.test(e.target.value) && (e.which === 13)) {
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
                    onClick={() => this.showYearEditor()}
                    className='hover-text'
                >
                {this.year()}
                </span>
        );
    };

    exactDayDescription = day => {
        const monthShort = this.state.dateContext.format("MMM");
        const weekdayShort = moment.weekdaysShort()[(+this.firstDayOfMonth() + day - 1) % 7];
        return `${weekdayShort} ${monthShort} ${day} ${this.year()}`
    };

    shiftSelect = (e, day) => {

        if (!this.props.noEdit) {

            const {dateContext, selectedDays, selectedTimings, lastChosenWithShift} = this.state;

            const clickedDayDescription = this.exactDayDescription(day);
            const additionDays = [];
            const additionTimings = [];
            const dateContextStr = dateContext.format('YYYY-MM-%Thh:mm:ss');
            const chosen = dateContextStr.replace('%', leadZero(day));

            if (lastChosenWithShift === null) {
                if (!selectedDays.includes(clickedDayDescription)) {
                    additionDays.push(clickedDayDescription);
                    additionTimings.push(new Timing());
                }
                this.setState({
                    lastChosenWithShift: chosen
                });

            } else {

                const lcsM = moment.utc(lastChosenWithShift);
                const cM = moment.utc(chosen);
                const lcsIsEarlier = lcsM.isSameOrBefore(cM);
                const startDate = lcsIsEarlier ? lcsM : cM;
                const endDate = lcsIsEarlier ? cM : lcsM;
                if (lcsIsEarlier) {
                    startDate.add(1, 'd');
                }

                while (startDate.isSameOrBefore(endDate)) {
                    additionDays.push(startDate.format('ddd MMM D YYYY'));
                    additionTimings.push(new Timing());
                    startDate.add(1, 'd');
                }

                this.setState({
                    lastChosenWithShift: null
                })
            }

            this.setState({
                selectedDays: [...selectedDays, ...additionDays],
                selectedTimings: [...selectedTimings, ...additionTimings]
            });

            this.props.chooseSomeDate(true);
        }
    };

    onDayClick = (e, day) => {
        if (!this.props.noEdit) {
            const {dateContext, selectedTimings, selectedDays} = this.state;
            let {showTimeSelect, currentlyManagedDayIndex} = this.state;
            const now = moment();
            const thenYM = dateContext.format('YYYY-MM-');
            const thenT = dateContext.format('Thh:mm:ss');
            const then = moment.utc(thenYM + leadZero(day) + thenT);
            if (then.isAfter(now) && e.target.className.indexOf('time-set-button') === -1) {
                this.props.hideSendWarning();
                const clickedDayDescription = this.exactDayDescription(day);
                if (e.shiftKey) {
                    this.shiftSelect(e, day);
                } else {
                    const newSelectedDays = selectedDays.slice();
                    const newSelectedTimings = selectedTimings.slice();
                    const index = newSelectedDays.indexOf(clickedDayDescription);
                    if (index > -1) {
                        newSelectedDays.splice(index, 1);
                        newSelectedTimings.splice(index, 1);
                        if (index === +currentlyManagedDayIndex) {
                            showTimeSelect = false;
                            currentlyManagedDayIndex = -1;
                        } else {
                            currentlyManagedDayIndex -= (index < currentlyManagedDayIndex) ? 1 : 0;
                        }
                        if (newSelectedDays.length === 0) {
                            this.props.chooseSomeDate(false);
                        }
                    } else {
                        newSelectedDays.push(clickedDayDescription);
                        newSelectedTimings.push(new Timing());
                        if (newSelectedDays.length === 1) {
                            this.props.chooseSomeDate(true);
                        }
                    }
                    this.setState({
                        lastChosenWithShift: null,
                        selectedDays: newSelectedDays,
                        selectedTimings: newSelectedTimings,
                        currentlyManagedDayIndex: currentlyManagedDayIndex,
                        showTimeSelect: showTimeSelect
                    });
                }
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

    getHeaderForTiming = () => {
        const {currentlyManagedDayIndex, selectedDays} = this.state;
        const day = selectedDays[currentlyManagedDayIndex];
        const split = day.split(' ');
        const d = leadZero(+split[2]);
        const m = leadZero(moment.monthsShort().indexOf(split[1]) + 1);
        const y = split[3];
        return `${d}.${m}.${y}`
    };

    timeSetButton = (e, day) => {
        const {hideSendWarning, chooseSomeDate, noEdit} = this.props;
        const {selectedTimings, selectedDays} = this.state;

        if (!noEdit) {
            hideSendWarning();
        }
        const dayDesc = this.exactDayDescription(day);
        if (!selectedDays.includes(dayDesc)) {
            this.setState({
                selectedDays: [...selectedDays, dayDesc],
                selectedTimings: [...selectedTimings, new Timing()]
            });
            chooseSomeDate(true);
        }
        if (!e.shiftKey) {
            const prob = selectedDays.indexOf(dayDesc);
            const index = prob === -1 ? selectedDays.length : prob;

            const newTimingObj = prob === -1 ? new Timing() : selectedTimings[index];

            if (this.startHRef.current != null) {
                this.startHRef.current.value = newTimingObj.startH;
            }

            if (this.startMRef.current != null) {
                this.startMRef.current.value = newTimingObj.startM;
            }

            if (this.endHRef.current != null) {
                this.endHRef.current.value = newTimingObj.endH;
            }

            if (this.endMRef.current != null) {
                this.endMRef.current.value = newTimingObj.endM;
            }

            if (this.checkBoxRef.current != null) {
                this.checkBoxRef.current.checked = false;
            }

            this.setState({
                currentlyManagedDayIndex: index,
                showTimeSelect: true
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
            showTimeSelect: false
        })
    };

    setForAll = e => {
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
        this.props.chooseSomeDate(false);
        this.setState({
            selectedDays: [],
            selectedTimings: [],
            showTimeSelect: false,
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

    handleClickOutside = e => {
        if (!['year-inp-line', 'ok-year'].includes(e.target.id)) {
            this.okYear();
        }
    };
}

Calendar.defaultProps = {
    noEdit: false,
    handleKeyUp: () => {}
};

Calendar.propTypes = {
    showHint: PropTypes.func.isRequired,
    closeHint: PropTypes.func.isRequired,
    hideSendWarning: PropTypes.func,
    chooseSomeDate: PropTypes.func,
    handleKeyUp: PropTypes.func,
    initState: PropTypes.object,
    noEdit: PropTypes.bool
};

export default Calendar;