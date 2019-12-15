import React, { Component } from 'react';
import '../css/style.css';
import axios from 'axios';
import Collapsible from './Collapsible';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import * as utils from './Utils.js'


class GivenSurveys extends Component {
  static propTypes = {
    auth: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);

    this.state = {
      surveys: [],
      gotSurveyData: false,
      openSurveyDataList: [],
      closedSurveyDataList: []
    };
  }

  getOpenSurveys = (surveyList) => {
    let opensurveyIdList = surveyList
    let openSurveyDataList = []
    let requests = []

    opensurveyIdList.forEach(function (survey) {
      requests.push(
        axios.get('http://localhost:5000/surveys/' + survey)
          .then(survey => {
            openSurveyDataList.push(survey.data)
          })
          .catch(function (error) {
            console.log("Could not get survey: " + error)
          })
      )
    })

    // Need to use Promise.all() to make sure setState will update the surveyDataList after all requests finished
    Promise.all(requests).then((val) => {
      this.setState({ openSurveyDataList: openSurveyDataList })
    })
  }
  getClosedSurveyData = (closedSurveyList) => {
      let surveyDataList = []
      let requests = []

      closedSurveyList.forEach(function(survey) {
          requests.push(
            axios.get('http://localhost:5000/surveys/'+ survey)
          .then(survey => {
            surveyDataList.push(survey.data)
          }).catch(function (error) {
            console.log('Failed to get survey' + error);
          })
      )})

       // Need to use Promise.all() to make sure setState will update the surveyDataList AFTER all requests finished
      Promise.all(requests).then((val) => {
        this.setState({closedSurveyDataList: surveyDataList})
      })
  }

  randerTableHeader() {
    let header = ["#", "Questions", "Type", "Category", "Answers"]
    return header.map((key, index) => {
      return <th key={index}>{key}</th>
    })
  }

  formatAnswers(answers, num){
    return answers.map((ans, index) => {
      let person = ans
      return person.map((answer, ind) =>{
        if(ind == num)
        return <p>{answer}</p>
        //return <p>{'Person ' + ind+') '+answer}</p>
      })
    })
  }

  randerTableItems(questions, survey) {
    return questions.map((sur, index) => {
      // temporarily hardcode survey answers
      return (
        <tr>
          <td>{sur.num}</td>
          <td>{sur.name}</td>
          <td>{sur.type}</td>
          <td>{sur.category}</td>
          <td>{survey.answers ? this.formatAnswers(survey.answers, index + 1) : ""}</td>
        </tr>
      )
    })
  }

  render() {
    if (this.props.auth.isAuthenticated && this.state.gotSurveyData === false) {
      this.getOpenSurveys(this.props.auth.user.openSurveys)
      this.getClosedSurveyData(this.props.auth.user.closedSurveys)
      this.setState({ gotSurveyData: true });
    }

    function isExpired(survey) {
      let today = utils.formatDate(new Date())
      let closedDate = utils.formatDate(new Date(survey.close_date))
      if (closedDate < today) {
        return true
      }
      return false
    }

    function renderOpenSurveys(surveys) {
      let openSurveys = surveys.filter((survey) => {
        if (survey === null) {  return null }
        if (!isExpired(survey))
          return survey
      })
      return openSurveys
    }

    function renderClosedSurveys(surveys) {
      let closedSurveys = surveys.filter((survey) => {
        if (survey === null) {  return null }
        if (isExpired(survey))
          return survey
      })
      return closedSurveys
    }

    return (
      <div className="header">
        <h2>Open Surveys</h2>
        <div>
          {renderOpenSurveys(this.state.openSurveyDataList).map((survey) => {
            if(survey == null) return  <></>
            return <>
              <Collapsible
                title={survey.title_survey}
                issueDate={'Issue Date: ' + utils.formatDate(new Date(survey.issued_date))}
                closingDate={'Closing Date: ' + utils.formatDate(new Date(survey.close_date))}>
                <h3>Questions</h3>
                
                <table id='surveys'>
                  <tbody>
                    <tr>{this.randerTableHeader()}</tr>
                    {this.randerTableItems(survey.questions, survey)}
                  </tbody>
                </table>

                <h3>Analytics</h3>
                <p>Project 1 Label: Employees satisfied</p>
                <p>Project 2 Label: Employees not satisfied</p>
              </Collapsible>
            </>
          })}
        </div>
        <br></br>
        <h2>Closed Surveys</h2>
        <div>
          {renderClosedSurveys(this.state.closedSurveyDataList).map((survey) => {
            if(survey == null) return  <></>
            return <>
              <Collapsible
                title={survey.title_survey}
                issueDate={'Issue Date: ' + utils.formatDate(new Date(survey.issued_date))}
                closingDate={'Closing Date: ' + utils.formatDate(new Date(survey.close_date))}>
                <h3>Questions</h3>               
                <table id='surveys'>
                  <tbody>
                    <tr>{this.randerTableHeader()}</tr>
                    {this.randerTableItems(survey.questions, survey)}
                  </tbody>
                </table>

                <h3 style={{padding:10}}>Analytics</h3>
                <p>Group by analytics</p>
              </Collapsible>
            </>
          })}
        </div>

      </div>

    );
  }
}
const mapStateToProps = state => ({
  auth: state.auth,
});

export default connect(
  mapStateToProps,
  null
)(GivenSurveys);