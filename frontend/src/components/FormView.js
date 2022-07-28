import React, {Component} from 'react';
import $ from 'jquery';
import '../stylesheets/FormView.css';
import BaseLayout from "../layout/base-layout";
import {config} from "../config/config";

class FormView extends Component {
    constructor(props) {
        super();
        this.state = {
            question: '',
            answer: '',
            difficulty: 1,
            category: null,
            categories: {},
            successMessage: '',
            errorMessage: '',
            violations: {},

        };
    }

    componentDidMount() {
        $.ajax({
            url: `${config.API_BASE_URL}/api/categories`, //TODO: update request URL
            type: 'GET', success: (result) => {
                this.setState({categories: result.categories});
                return;
            }, error: (error) => {
                alert('Unable to load categories. Please try your request again');
                return;
            },
        });
    }

    submitQuestion = (event) => {
        event.preventDefault();
        $.ajax({
            url: `${config.API_BASE_URL}/api/questions`, //TODO: update request URL
            type: 'POST', dataType: 'json', contentType: 'application/json', data: JSON.stringify({
                question: this.state.question,
                answer: this.state.answer,
                difficulty: this.state.difficulty,
                category: this.state.category,
            }), xhrFields: {
                withCredentials: true,
            }, crossDomain: true, success: (result) => {
                document.getElementById('add-question-form').reset();
                this.setState({successMessage: 'Question added successfully !'});
                this.clearFormErrors()
                return;
            }, error: (error) => {
                this.setState({errorMessage: 'Unable to add question. Please try your request again'});
                this.setState({violations: error.responseJSON.violations || {}});
                return;
            },
        });
    };

    handleChange = (event) => {
        this.setState({[event.target.name]: event.target.value});
    };

    clearFormErrors = () => {
        this.setState({violations: {}, errorMessage: ''});
    }

    clearInputErrors = (name) => {
        this.setState({violations: {...this.state.violations, [name]: null}});
    }

    displayErrors = (name) => {
        if (this.state.violations[name]) {
            return this.state.violations[name].errors.map((error, index) => {
                return <span key={index} className="invalid">{error}</span>
            });
        }
    }

    render() {
        return (
            <BaseLayout>
                <div id='add-form' className="mt-3">
                    <fieldset>
                        <legend>Add a New Trivia Question</legend>
                        <div className="flex space-between">
                            <form
                                className='form-view'
                                id='add-question-form'
                                onSubmit={this.submitQuestion}
                            >
                                <div className={`form-group ${this.state.violations.question && 'has-error'}`}>
                                    <label htmlFor='question'>Question:</label>
                                    <input
                                        type='text'
                                        name='question'
                                        id='question'
                                        onFocus={() => this.clearInputErrors('question')}
                                        onChange={this.handleChange}/>
                                    {this.displayErrors('question')}

                                </div>
                                <div className={`form-group ${this.state.violations.answer && 'has-error'}`}>
                                    <label htmlFor='answer'>Answer:</label>
                                    <input
                                        type='text'
                                        name='answer'
                                        id='answer'
                                        onFocus={() => this.clearInputErrors('answer')}
                                        onChange={this.handleChange}/>
                                    {this.displayErrors('answer')}
                                </div>
                                <div className={`form-group ${this.state.violations.difficulty && 'has-error'}`}>
                                    <label htmlFor='difficulty'>Difficulty:</label>
                                    <select
                                        name='difficulty'
                                        id='difficulty'
                                        onChange={this.handleChange}>
                                        <option value='1'>1</option>
                                        <option value='2'>2</option>
                                        <option value='3'>3</option>
                                        <option value='4'>4</option>
                                        <option value='5'>5</option>
                                    </select>
                                    {this.displayErrors('difficulty')}
                                </div>
                                <div className={`form-group ${this.state.violations.category && 'has-error'}`}>
                                    <label htmlFor='category'>Category:</label>
                                    <select name='category' id='category' onChange={this.handleChange}>
                                        {Object.keys(this.state.categories).map((id) => {
                                            return (<option key={id} value={id}>{this.state.categories[id]}</option>);
                                        })}
                                    </select>
                                    {this.displayErrors('category')}

                                </div>
                                <div className="flex mt-3">
                                    <button type='submit' className='primary outline'>
                                        Submit
                                    </button>
                                </div>
                            </form>
                            <div className="flash-messages">
                                <div className={`success ${this.state.successMessage.length > 0 ? 'show' : ''}`}>
                                    <div className="flex gap-2">
                                    <span>
                                        {this.state.successMessage}
                                    </span>
                                        <span className="close" onClick={() => this.setState({successMessage: ''})}>
                                        &times;
                                    </span>
                                    </div>
                                </div>
                                <div className={`error ${this.state.errorMessage.length > 0 ? 'show' : ''}`}>
                                    <div className="flex gap-2">
                                    <span>
                                        {this.state.errorMessage}
                                    </span>
                                        <span className="close" onClick={() => this.setState({errorMessage: ''})}>
                                        &times;
                                    </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </fieldset>
                </div>
            </BaseLayout>
        );
    }
}

export default FormView;
