import React, {Component} from 'react';
import moment from 'moment';
import PropTypes from 'prop-types';
import '../../resource/styles/Main.css'
import {getEventTypeByID, leadZero} from '../../functional/Design';
import '../../resource/styles/AllApplications.css'
import {Link} from 'react-router-dom';

class ApplicationsList extends Component {

    componentDidMount() {
        sessionStorage.removeItem('SentApplicationView');
    }

    render() {

        const { oops, applications } = this.props;

        const text =
            oops === 'response'
                ?
                'Нам очень жаль, но, похоже, на сервере какие-то неполадки; мы уже работаем над этим - попробуйте ещё раз через пару минут!'
                :
                'Что-то пошло не так; пожалуйста, проверьте, подключён ли Ваш компьютер к интернету';

        return (
            <div className='info-container'>
                <h1>Мои заявки</h1>

                {
                    oops !== ''
                        ?
                        <p
                            className='info-paragraph'
                        >
                            {text}
                        </p>
                        :
                        applications.map(application => this.getLayout(application))
                }

            </div>
        );
    }

    getLayout = application => {
        const {name, type, dates, id} = application;
        let dateString = dates.slice(0, 4).map(date => this.getNumericDate(date.from)).join(', ');
        if (dates.length > 4) {
            dateString += '...'
        }
        return <div
            key={id}
            className='application-in-list'
        >

            <h2>
                {name}
            </h2>

            <h3>
                {getEventTypeByID(type)}
            </h3>

            <p>
                {dateString}
            </p>

            <div
                className='flex-container'
            >

                <Link
                    to={'/applications/' + id}
                    className='hover-text'
                >
                    Открыть
                </Link>

                <button
                    className='hover-text no-border-element transparent-element'
                    onClick={() => this.props.openApplicationForm(this.getApplicationToEdit(id))}
                >
                    Редактировать
                </button>

            </div>

        </div>
    };

    getNumericDate = date => {
        const split = date.split(' ');
        const day = leadZero(split[2]);
        const monthsShort = moment.monthsShort();
        const month = leadZero(monthsShort.indexOf(split[1]) + 1);
        const year = split[5];
        return `${day}.${month}.${year}`;
    };

    getApplicationToEdit = id => {
        const { applications } = this.props;
        for (let i in applications) {
            if (applications[i].id === id) {
                return applications[i];
            }
        }
    }
}

ApplicationsList.propTypes = {
    oops: PropTypes.string.isRequired,
    applications: PropTypes.array.isRequired,
    openApplicationForm: PropTypes.func.isRequired
};

export default ApplicationsList;