import React, { Component } from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter as Router, Route, Switch} from "react-router-dom";
import { Redirect } from 'react-router'

import Sidenav from "./Components/Sidenav.component"
import CreateSurvey from "./Components/CreateSurvey"
import GivenSurveys from "./Components/GivenSurveys"
import Analytics from "./Components/Analytics"
import YourSurveys from './Components/YourSurveys';
import TakingSurvey from './Components/TakingSurvey';
import login from './Components/login';

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isManagerVal: true,
      firstName: "John"
    }
  }

 
  render() {
    const mySidenav = (props) => {
      return (
        <Sidenav isManager={this.state.isManagerVal} />
      );
    }

    return (
      <Router>
          <div>
          <Route exact path="/" render={() => (
              <Redirect to="/login"/>
          )}/>  

          <Switch>
            <Route path="/login" />
            <Route path="/" render={mySidenav} />   
          </Switch>
           
          <Switch>
            <Route path="/login" component={login} />
            <Route path="/YourSurveys" exact component={YourSurveys} />
            <Route path="/CreateSurvey" component={CreateSurvey} />
            <Route path="/GivenSurveys" component={GivenSurveys} />
            <Route path="/Analytics" component={Analytics} />
            <Route path="/TakingSurvey" component={TakingSurvey} />
          </Switch>         
          </div>      
      </Router>

    );
  }
  
}