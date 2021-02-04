import React, { Component,Fragment } from 'react'
import {Switch,Route,Redirect} from 'react-router-dom'
import Login from './pages/login'
import Admin from './pages/admin'
import './utils/flexible'

export default class App extends Component {
    render() {
        return (
            <Fragment>
                <Switch>
                    <Route path="/login" component={Login} />
                    <Route path="/admin" component={Admin} />
                    <Redirect to="/login" />
                </Switch>
            </Fragment>
        )
    }
}
