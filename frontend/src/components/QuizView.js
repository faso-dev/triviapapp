import React, {Component} from 'react';
import $ from 'jquery';
import '../stylesheets/QuizView.css';
import BaseLayout from "../Layout/BaseLayout";
import {config} from "../config/config";

const questionsPerPlay = 5;

class QuizView extends Component {
    constructor(props) {
        super();
        this.state = {
            quizCategory: null,
            previousQuestions: [],
            showAnswer: false,
            categories: {},
            numCorrect: 0,
            currentQuestion: {},
            guess: '',
            forceEnd: false,
        };
    }

    componentDidMount() {
        $.ajax({
            url: `${config.API_BASE_URL}/api/categories`, //TODO: update request URL
            type: 'GET',
            success: (result) => {
                this.setState({categories: result.categories});
                return;
            },
            error: (error) => {
                alert('Unable to load categories. Please try your request again');
                return;
            },
        });
    }

    selectCategory = ({type, id = 0}) => {
        this.setState({quizCategory: {type, id}}, this.getNextQuestion);
    };

    handleChange = (event) => {
        this.setState({[event.target.name]: event.target.value});
    };

    getNextQuestion = () => {
        const previousQuestions = [...this.state.previousQuestions];
        if (this.state.currentQuestion.id) {
            previousQuestions.push(this.state.currentQuestion.id);
        }

        $.ajax({
            url: `${config.API_BASE_URL}/api/quizzes`, //TODO: update request URL
            type: 'POST',
            dataType: 'json',
            contentType: 'application/json',
            data: JSON.stringify({
                previous_questions: previousQuestions,
                quiz_category: this.state.quizCategory,
            }),
            xhrFields: {
                withCredentials: true,
            },
            crossDomain: true,
            success: (result) => {
                this.setState({
                    showAnswer: false,
                    previousQuestions: previousQuestions,
                    currentQuestion: result.question,
                    guess: '',
                    forceEnd: result.question ? false : true,
                });
                return;
            },
            error: (error) => {
                alert('Unable to load question. Please try your request again');
                return;
            },
        });
    };

    submitGuess = (event) => {
        event.preventDefault();
        let evaluate = this.evaluateAnswer();
        this.setState({
            numCorrect: !evaluate ? this.state.numCorrect : this.state.numCorrect + 1,
            showAnswer: true,
        });
    };

    restartGame = () => {
        this.setState({
            quizCategory: null,
            previousQuestions: [],
            showAnswer: false,
            numCorrect: 0,
            currentQuestion: {},
            guess: '',
            forceEnd: false,
        });
    };

    renderPrePlay() {
        return (
            <div className='quiz-play-holder'>
                <div className='choose-header'>Choose Category</div>
                <div className='category-holder'>
                    <div className='play-category' onClick={this.selectCategory}>
                        ALL
                    </div>
                    {Object.keys(this.state.categories).map((id) => {
                        return (
                            <div
                                key={id}
                                value={id}
                                className='play-category'
                                onClick={() =>
                                    this.selectCategory({type: this.state.categories[id], id})
                                }
                            >
                                {this.state.categories[id]}
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    }

    renderFinalScore() {
        return (
            <div className='quiz-play-holder'>
                <div className="flex content-center">
                    <div className={`${this.state.numCorrect > 0 ? 'success' : 'error'} show`}>
                        Your Final Score is {this.state.numCorrect}
                    </div>
                </div>
                <div className="flex content-center">
                    <button
                        type="button"
                        className='primary outline'
                        onClick={this.restartGame}>
                        Play Again?
                    </button>
                </div>
            </div>
        );
    }

    evaluateAnswer = () => {
        const formatGuess = this.state.guess
            // eslint-disable-next-line
            .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, '')
            .toLowerCase();
        const answerArray = this.state.currentQuestion.answer
            .toLowerCase()
            .split(' ');
        return answerArray.every((el) => formatGuess.includes(el));
    };

    renderCorrectAnswer() {
        let evaluate = this.evaluateAnswer();
        return (
            <div className='quiz-play-holder'>
                <div className='quiz-question'>
                    {this.state.currentQuestion.question}
                </div>
                <div className="flex content-center">
                    <div className={`${evaluate ? 'success show' : 'error show'}`}>
                        {evaluate ? 'You were correct!' : 'You were incorrect'}
                    </div>
                </div>
                <div className='quiz-answer'> Answer : {this.state.currentQuestion.answer}</div>
                <div className="flex content-center">
                    <button type="button" className='next-question outline primary' onClick={this.getNextQuestion}>
                        {' '}
                        Next Question{' '}
                    </button>
                </div>
            </div>
        );
    }

    renderPlay() {
        return this.state.previousQuestions.length === questionsPerPlay ||
        this.state.forceEnd ? (
            this.renderFinalScore()
        ) : this.state.showAnswer ? (
            this.renderCorrectAnswer()
        ) : (
            <div className='quiz-play-holder'>
                <div className='quiz-question'>
                    {this.state.currentQuestion.question}
                </div>
                <form onSubmit={this.submitGuess}>
                    <div className="flex content-center">
                        <input className="search" type='text' name='guess' onChange={this.handleChange}/>
                        <button
                            className='primary outline'
                            type='submit'
                        >
                            Submit Answer
                        </button>
                    </div>
                </form>
            </div>
        );
    }

    render() {
        return (
            <BaseLayout>
                {this.state.quizCategory ? this.renderPlay() : this.renderPrePlay()}
            </BaseLayout>
        )
    }
}

export default QuizView;
