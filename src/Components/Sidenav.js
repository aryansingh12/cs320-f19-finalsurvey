import React, { Component } from 'react';
import '../css/style.css';
import profile_pic from '../res/img_profile_pic.png';
import '../pages/CreateSurvey.js';
import '../pages/ManagerHome.js';
import '../pages/GivenSurveys.js';

class Sidenav extends Component {
  render() {
    return (
      <nav class="navbar navbar-inverse navbar-fixed-left">
      <div class="container">
        <div class="navbar-header">
          <button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#navbar" aria-controls="navbar">
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>
          </button>
        </div>
        <div id="navbar" class="navbar-collapse collapse">
            <ul class="nav navbar-nav">
                <li class="arrow"><a href="#"><i class="fa fa-tachometer"></i><br></br>Dashboard</a></li>
             <li class="dropdown">
              <a href="#" class="dropdown-toggle" data-toggle="dropdown" aria-haspopup="true"><i class="fa fa-table" aria-hidden="true"></i><br></br>Tables<span class="caret"></span></a>
              <ul class="dropdown-menu">
                <li><a href="#">Table 1</a></li>
                <li><a href="#">Table 2</a></li>
                <li><a href="#">Table 3</a></li>
                <li><a href="#">Table 4</a></li>
                <li><a href="#">Table 5</a></li>
                <li><a href="#">Table 6</a></li>
               
              </ul>
            </li>
            <li class="dropdown">
              <a href="#" class="dropdown-toggle" data-toggle="dropdown" aria-haspopup="true"><i class="fa fa-file" aria-hidden="true"></i><br></br>Report<span class="caret"></span></a>
              <ul class="dropdown-menu">
                <li><a href="#">Report A</a></li>
                <li><a href="#">Report B</a></li>
              </ul>
            </li>
            <li class="dropdown">
              <a href="#" class="dropdown-toggle" data-toggle="dropdown" aria-haspopup="true"><i class="fa fa-user" aria-hidden="true"></i><br></br>Attendance<span class="caret"></span></a>
              <ul class="dropdown-menu">
                <li><a href="#">Team Attendance</a></li>
                <li><a href="#">User Attendance</a></li>
              </ul>
            </li>
            <li><a href="#"><i class="fa fa-map-marker" aria-hidden="true"></i><br></br>Location</a></li>
            <li><a href="#"><i class="fa fa-line-chart"></i><br></br>Sales</a></li>
          </ul>
       
        </div>
      </div>
    </nav>
    );
  }
}
export default Sidenav;