import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import MeetingPage from '../pages/Meeting';
import HomePage from '../pages/Home';

const PublicRoutes: React.FC = () => {
    return (
        <Router>
            <Switch>
                <Route exact path="/meeting/:id" component={MeetingPage} />
                <Route path="/" component={HomePage} />
            </Switch>
        </Router>
    );
};

export default PublicRoutes;
