import React, { Component } from 'react';
import '../css/style.css';
import profile_pic from '../res/img_profile_pic.png';
import '../pages/CreateSurvey.js';
import '../pages/ManagerHome.js';
import '../pages/GivenSurveys.js';

class Sidenav extends Component {
  render() {
    return (
        <div className="sidenav">
                <img src={profile_pic} alt="profile_pic"></img>
                <p>John Smith</p>
                <p>Manager</p>
         
      
                <div className="links">
                  <a href="/Home">Home</a>
                  <a href="/CreateSurvey">Create Survey</a>
                  <a href="/GivenSurveys">Given Surveys</a>  
                </div>             
        </div>
    );
  }
}
export default Sidenav;