import React from 'react'
import MainPageNew from "./components/MainPageNew"
import HostFrame from './components/HostLive'
import FinalPage from './components/FinalPage'
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { ChannelProvider } from './components/contextApi/chennal';
import "./app.css"

const App = () => {
    return (
        <ChannelProvider>
        <Router>
        <div>
            <Switch>
                <Route component={MainPageNew} path="/" exact/>
                <Route component={HostFrame} path="/HostLive"/>
                <Route component={FinalPage} path="/Final"/>
            </Switch>
        </div>
        </Router>
        </ChannelProvider>
    )
}

export default App
