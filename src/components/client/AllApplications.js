import React, {Component} from 'react';
import PropTypes from 'prop-types';
import '../../resource/styles/Main.css'

class AllApplications extends Component {

    state = {
        applications: []
    };

    render() {

        let inside =
                <p
                    className='info-paragraph'
                >
                    Данная страница доступна к просмотру или редактированию только авторизовавшимся пользователям!
                </p>;

        if (this.props.userLogin !== '') {
            if (this.props.refresh) {
                const {token} = this.props;

                const request = new XMLHttpRequest();

                request.onreadystatechange = () => {

                    if (request.readyState === 4) {
                        this.setState({
                            applications: JSON.parse(request.responseText)
                        });
                        this.props.newApplication(false);
                    }
                };

                request.open('GET', 'http://siburarenda.publicvm.com/api/user/events?username=' + this.props.userLogin, true);
                request.setRequestHeader('Authorization', 'Bearer_' + token);
                request.setRequestHeader('Content-Type', 'application/json');
                request.send(null)
            }

            inside =
                this.state.applications.map(
                    app =>
                        <p
                            className='info-paragraph'
                            key={app.name + Math.floor(Math.random() * 3000)}
                        >
                            {app.name}
                        </p>
                );
        }

        return (
            <div className='info-container'>
                <h1>Мои заявки</h1>
                {inside}
            </div>
        );
    }
}

AllApplications.propTypes = {
    token: PropTypes.string.isRequired,
    userLogin: PropTypes.string.isRequired,
    newApplication: PropTypes.func.isRequired,
    refresh: PropTypes.bool.isRequired
};

export default AllApplications;