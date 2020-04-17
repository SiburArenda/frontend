import React, {Component} from 'react';
import {BrowserRouter as Router, Route, Link} from "react-router-dom"
import './resource/styles/Main.css'
import ClientNavList from "./components/client/ClientNavList";
import AdminNavList from "./components/admin/AdminNavList";
import ClientMainContent from "./components/client/ClientMainContent";
import AdminMainContent from "./components/admin/AdminMainContent";

class App extends Component {

    state = {
        logInFormVisible: false,
        applicationFormVisible: false
    };

    render() {
        return (
            <Router>

                <header>
                    <Route
                        path={/^\/(?!admin).*/}
                        render=
                            {
                                () => (
                                    <button
                                        id='open-log-in-button'
                                        onClick={() => {
                                            this.openLogInForm()
                                        }}>Войти
                                    </button>
                                )
                            }
                    />
                    <Link to='/admin'>Войти как администратор</Link>
                </header>

                <nav>
                    <ul id='main-nav'>
                        <Route
                            path={/^\/(?!admin).*/}
                            render={(props) => (
                                <ClientNavList {...props} openApplicationForm={this.openApplicationForm}/>)}
                        />
                        <Route
                            path='/admin'
                            render={(props) => (<AdminNavList {...props}/>)}
                        />
                    </ul>
                </nav>

                <section id='main-content'>
                    <Route
                        path={/^\/(?!admin).*/}
                        render=
                            {
                                (props) => (
                                    <ClientMainContent
                                        {...props}
                                        logInFormVisible={this.state.logInFormVisible}
                                        applicationFormVisible={this.state.applicationFormVisible}
                                        closeLogInForm={this.closeLogInForm}
                                        closeAppWindow={this.closeApplicationForm}
                                    />
                                )
                            }
                    />
                    <Route
                        path='/admin'
                        render=
                            {
                                (props) => (
                                    <AdminMainContent
                                        {...props}
                                    />
                                )
                            }
                    />
                </section>

            </Router>
        );
    }

    openApplicationForm = () => {
        this.setState({
            applicationFormVisible: true
        })
    };

    openLogInForm = () => {
        this.setState({
            logInFormVisible: true
        })
    };

    closeApplicationForm = () => {
        this.setState({
            applicationFormVisible: false
        })
    };

    closeLogInForm = () => {
        this.setState({
            logInFormVisible: false
        })
    };
}

export default App;
