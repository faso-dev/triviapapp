import React, {Component} from 'react';
import '../stylesheets/Question.css';

class Question extends Component {
    constructor() {
        super();
        this.state = {
            visibleAnswer: false,
        };
    }

    flipVisibility() {
        this.setState({visibleAnswer: !this.state.visibleAnswer});
    }

    render() {
        const {question, answer, category, difficulty} = this.props;
        return (
            <div className='Question-holder'>
                <div className='Question'>{question}</div>
                <div className='Question-status'>
                    <img
                        className='category'
                        alt={`${category.toLowerCase()}`}
                        src={`${category.toLowerCase()}.svg`}
                    />
                    <div className='difficulty'>Difficulty: {difficulty}</div>
                    <img
                        src='delete.png'
                        alt='delete'
                        className='delete'
                        onClick={() => this.props.questionAction('DELETE')}
                    />
                </div>
                <button
                    className='show-answer primary outline'
                    onClick={() => this.flipVisibility()}
                >
                    {this.state.visibleAnswer ? 'Hide' : 'Show'} Answer
                </button>
                <div className={`answer-holder ${this.state.visibleAnswer ? 'show' : ''}`}>
                    Answer: {answer}
                </div>
            </div>
        );
    }
}

export default Question;
