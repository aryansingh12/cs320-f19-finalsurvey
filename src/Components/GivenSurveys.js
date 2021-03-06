import React, { Component } from 'react';
import '../css/style.css';
import axios from 'axios';
import Collapsible from './Collapsible';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import * as utils from './Utils.js'
import {SLIDER_VALUES, SLIDER_NUMS} from '../constants/Slider.js'
import BarChart from 'react-bar-chart';


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
      closedSurveyDataList: [],
      width: 500
    };
  }

  // componentDidMount: () => {
  //   window.onresize = () => {
  //    this.setState({width: this.refs.root.offsetWidth}); 
  //   };
  // }

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
    console.log("------Open survey data-----")
    console.log(openSurveyDataList)
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

  randerTableHeader(header) {
    return header.map((key, index) => {
      return <th key={index}>{key}</th>
    })
  }

  formatAnswers(answers, num){
    return answers.map((ans, index) => {
      let person = ans
      return person.map((answer, ind) =>{
        if(ind == num) {
          let personNum = index + 1
          return <p>{'Person ' + personNum +') '+answer}</p>
        }
      })
    })
  }

  randerTableItems(survey) {
    return survey.questions.map((sur, index) => {
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

  renderTrueFalseTableItems(survey) {
      return survey.questions.map((ques, index) => {
          if(ques.type != "True False") return null
          console.log(ques)

          let totalAnswers = survey.answers.length
          let numTrue = 0
          let quesNum = ques.num
          
          survey.answers.map((ansArr, idx) => {
              if(ansArr[quesNum] == "True") 
                numTrue++
          })
          console.log(numTrue)
          let numFalse = totalAnswers - numTrue

          return (
            <tr>
              <td>{ques.name}</td>
              <td>{numTrue}</td>
              <td>{numFalse}</td>
            </tr>
          );
      })   
  }

  renderSliderGraph(survey) {
    return survey.questions.map((ques, ind) => {
      if(ques.type != "Slider") return null
      console.log(ques)

      let quesNum = ques.num
      let totalAnsLength = survey.answers.length
      let stDisCount = 0,
          soDisCnt = 0, 
          noOpinionCnt = 0, 
          soAgreeCnt = 0,
          stAgreeCnt = 0,
          total = 0;

      survey.answers.map((ansArr, idx) => {
        let ans = ansArr[quesNum]
        if(ans == SLIDER_VALUES.ONE) {
          stDisCount++;
          total+= SLIDER_NUMS.ONE
        }
        else if(ans == SLIDER_VALUES.TWO) {
          soDisCnt++;
          total+= SLIDER_NUMS.TWO
        }
        else if(ans == SLIDER_VALUES.THREE) {
          noOpinionCnt++;
          total+= SLIDER_NUMS.THREE
        }
        else if(ans == SLIDER_VALUES.FOUR) {
          soAgreeCnt++;
          total+= SLIDER_NUMS.FOUR
        }
        else if(ans == SLIDER_VALUES.FIVE) {
          stAgreeCnt++;
          total+= SLIDER_NUMS.FIVE
        }
      })
      let averageNum = total / totalAnsLength
      console.log("&&&&&&")
      console.log(total)
      console.log(averageNum)
      const data = [
        {text: "StronglyD", value: stDisCount},
        {text: "SomewhatD", value: soDisCnt},
        {text: "Neutral", value: noOpinionCnt},
        {text: "SomewhatA", value: soAgreeCnt},
        {text: "StronglyA", value: stAgreeCnt}
      ];
      const margin = {top: 20, right: 20, bottom: 30, left: 40};

      return (
        <div ref="root">
          <strong className="questionTitle">Question#{ques.num} {ques.name}</strong>
          <br></br><br></br>
          <strong>Total Answers: {totalAnsLength}</strong>
          <p><b>Average Response: {this.determineAverageResponse(averageNum)}</b></p>
          <p>Strongly Disagree: {stDisCount} --- Somewhat Disagree: {soDisCnt}</p>
          <p>No Opinion: {noOpinionCnt}</p>
          <p>Somewhat Agree: {soAgreeCnt} --- Strongly Agree: {stAgreeCnt}</p>
          <BarChart 
            ylabel='Count'
            width={this.state.width}
            height={500}
            margin={margin}
            data={data}
            onBarClick={this.handleBarClick}/>
        </div>
      )
    })
  }

  determineAverageResponse(avgVal) {
    let diff1 = Math.abs(SLIDER_NUMS.ONE-avgVal)
    let diff2 = Math.abs(SLIDER_NUMS.TWO-avgVal)
    let diff3 = Math.abs(SLIDER_NUMS.THREE-avgVal)
    let diff4 = Math.abs(SLIDER_NUMS.FOUR-avgVal)
    let diff5 = Math.abs(SLIDER_NUMS.FIVE-avgVal)
    let minDiff = Math.min(diff1, diff2, diff3, diff4, diff5)
    if(minDiff == diff1) return SLIDER_VALUES.ONE
    if(minDiff == diff2) return SLIDER_VALUES.TWO
    if(minDiff == diff3) return SLIDER_VALUES.THREE
    if(minDiff == diff4) return SLIDER_VALUES.FOUR
    if(minDiff == diff5) return SLIDER_VALUES.FIVE
  }

  handleBarClick(element, id){ 
    console.log(`The bin ${element.text} with id ${id} was clicked`);
  }

  generateQuestions(headerAnswers, survey) {
    return (
      <>
        <h3>Questions</h3>     
        <table id='surveys'>
          <tbody>
            <tr>{this.randerTableHeader(headerAnswers)}</tr>
            {this.randerTableItems(survey)}
          </tbody>
        </table>
        <br></br>
      </>
    ) 
  }

  generateAnalytics(headerTrueFalse,survey, headerCategories, headerSlider) {
    return (
      <>
        <h3>Analytics</h3>
        <h4>True False Count</h4>
        <table id='surveys'>
          <tbody>
            <tr>{this.randerTableHeader(headerTrueFalse)}</tr>
            {this.renderTrueFalseTableItems(survey)}
          </tbody>
        </table>

        <br></br>
        <h4>Slider Question Values</h4>
        <table id='surveys'>
          <tbody>
            {this.renderSliderGraph(survey)}
          </tbody>
        </table>

        <br></br>
      </>
    )
  }

  render() {
    if (this.props.auth.isAuthenticated && this.state.gotSurveyData === false) {
      this.getOpenSurveys(this.props.auth.user.openSurveys)
      this.getClosedSurveyData(this.props.auth.user.closedSurveys)
      this.setState({ gotSurveyData: true });
    }

    // TODO: Need to check manager's given surveys to move to closed surveys
    function isExpired(survey) {
      let today = new Date()
      let closedDate = new Date(survey.close_date)
      if(closedDate < today) {
        return true
      }
      return false
    }


    function renderOpenSurveys(surveys) {
      surveys.map((survey) => {
        if(isExpired(survey)) 
          afterCheckClosedSurveys.push(survey)
        else
          afterCheckOpenSurveys.push(survey)
      })

      console.log("---after check expire open surveys-----")
      console.log(afterCheckOpenSurveys)
      console.log("---after check expire closed surveys-----")
      console.log(afterCheckClosedSurveys)
    }


    let afterCheckOpenSurveys = []
    let afterCheckClosedSurveys =[]

    let headerAnswers = ["#", "Question", "Type", "Category", "Answers"]
    let headerTrueFalse = ["T/F Question", "True Count", "False Count"]
    let headerSlider = ["Average Value /100", "#Strong Disagree","#Somewhat Disagree", "#No Opinion", "#Somewhat Agree", "#Strongly Agree"]
    let headerMC = ["MC Question","Option 1, Option 2", "Option 3", "Option 4"]
    let headerCategories = ["Category", "Answers"]


    return (
      <div className="header">
        <h2>Open Surveys</h2>
        <div>
          {this.state.openSurveyDataList.map((survey) => {
            if(survey == null) return  <></>
            return <>
              <Collapsible
                title={survey.title_survey}
                surveyType="surveyResults"
                issueDate={'Issue Date: ' + utils.formatDate(new Date(survey.issued_date))}
                closingDate={'Closing Date: ' + utils.formatDate(new Date(survey.close_date))}>
                {this.generateQuestions(headerAnswers, survey)}
                {this.generateAnalytics(headerTrueFalse, survey, headerCategories, headerSlider)}
              </Collapsible>
            </>
          })}
        </div>


        <br></br>
        <h2>Closed Surveys</h2>
        <div>
          {this.state.closedSurveyDataList.map((survey) => {
            if(survey == null) return  <></>
            return <>
              <Collapsible
                title={survey.title_survey}
                surveyType="closedSurvey"
                issueDate={'Issue Date: ' + utils.formatDate(new Date(survey.issued_date))}
                closingDate={'Closing Date: ' + utils.formatDate(new Date(survey.close_date))}>          
                {this.generateQuestions(headerAnswers, survey)}
                {this.generateAnalytics(headerTrueFalse, survey, headerCategories, headerSlider )}
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