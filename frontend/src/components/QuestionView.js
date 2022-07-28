import React, {Component} from 'react';
import '../stylesheets/App.css';
import Question from './Question';
import Search from './Search';
import $ from 'jquery';
import BaseLayout from "../layout/base-layout";
import {NavLink} from "react-router-dom";
import {config} from "../config/config";

class QuestionView extends Component {
    constructor() {
        super();
        this.state = {
            questions: [],
            page: 1,
            totalQuestions: 0,
            categories: {},
            currentCategory: null,
            errorMessage: '',
        };
    }

    componentDidMount() {
        this.getQuestions();
    }

    getQuestions = () => {
        $.ajax({
            url: `${config.API_BASE_URL}/api/questions?page=${this.state.page}`, //TODO: update request URL
            type: 'GET', success: (result) => {
                this.setState({
                    questions: result.questions,
                    totalQuestions: result.total_questions,
                    categories: result.categories,
                    currentCategory: result.current_category,
                });
                return;
            }, error: (error) => {
                this.setState({
                    errorMessage: 'Unable to load questions. Please try your request again',
                })
                return;
            },
        });
    };

    selectPage(num) {
        this.setState({page: num}, () => this.getQuestions());
    }

    createPagination() {
        let pageNumbers = [];
        let maxPage = Math.ceil(this.state.totalQuestions / 10);
        for (let i = 1; i <= maxPage; i++) {
            pageNumbers.push(<button
                key={i}
                className={`page-num primary outline ${i === this.state.page ? 'active' : ''}`}
                onClick={() => {
                    this.selectPage(i);
                }}
            >
                {i}
            </button>);
        }
        return pageNumbers;
    }

    clearError() {
        this.setState({
            errorMessage: '',
        });
    }

    getByCategory = (id) => {
        $.ajax({
            url: `${config.API_BASE_URL}/api/categories/${id}/questions`, //TODO: update request URL
            type: 'GET', success: (result) => {
                this.setState({
                    questions: result.questions,
                    totalQuestions: result.total_questions,
                    currentCategory: result.current_category,
                });
                return;
            }, error: (error) => {
                this.setState({
                    errorMessage: 'Unable to load questions. Please try your request again',
                })
                return;
            },
        });
    };

    submitSearch = (searchTerm) => {
        this.clearError()

        $.ajax({
            url: `${config.API_BASE_URL}/api/questions/search`, //TODO: update request URL
            type: 'POST',
            dataType: 'json',
            contentType: 'application/json',
            data: JSON.stringify({searchTerm: searchTerm}),
            xhrFields: {
                withCredentials: true,
            },
            crossDomain: true,
            success: (result) => {
                this.setState({
                    questions: result.questions,
                    totalQuestions: result.total_questions,
                    currentCategory: result.current_category,
                });
                return;
            },
            error: (error) => {
                if (error.status === 404) {
                    this.setState({
                        questions: [],
                        totalQuestions: 0,
                        errorMessage: 'No questions found',
                    });
                } else {
                    this.setState({
                        errorMessage: 'Unable to load questions. Please try your request again',
                    })
                }
                return;
            },
        });
    };

    questionAction = (id) => (action) => {
        if (action === 'DELETE') {
            if (window.confirm('are you sure you want to delete the question?')) {
                $.ajax({
                    url: `${config.API_BASE_URL}/api/questions/${id}`, //TODO: update request URL
                    type: 'DELETE', success: (result) => {
                        this.getQuestions();
                    }, error: (error) => {
                        this.setState({
                            errorMessage: 'Unable to delete question. Please try your request again',
                        })
                        return;
                    },
                });
            }
        }
    };

    addCategory = (category) => {
        $.ajax({
            url: `${config.API_BASE_URL}/api/categories`, //TODO: update request URL
            type: 'POST',
            dataType: 'json',
            contentType: 'application/json',
            data: JSON.stringify({type: category}),
            xhrFields: {
                withCredentials: true,
            },
            crossDomain: true,
            success: (result) => {
                this.setState({categories: {...this.state.categories, [result.category.id]: result.category.type}});
                return;
            },
            error: (error) => {
                if (error.status === 404) {
                    this.setState({
                        questions: [],
                        totalQuestions: 0,
                        errorMessage: 'No questions found',
                    });
                } else {
                    this.setState({
                        errorMessage: 'Unable to load questions. Please try your request again',
                    })
                }
                return;
            },
        });

    }


    render() {
        return (
            <BaseLayout>
                <div className='question-view flex items-start gap-2'>
                    <div className='categories-list'>
                        <h2
                            onClick={() => {
                                this.getQuestions();
                            }}
                        >
                            Categories
                        </h2>
                        <div className="flex mb-2 mt-1">
                            <input
                                onClick={e => {
                                    if (e.currentTarget.value.trim().length > 2) {
                                        this.addCategory(e.currentTarget.value.trim())
                                    }
                                }}
                                type="text"
                                placeholder='Add new category...'/>
                        </div>
                        <ul>
                            {Object.keys(this.state.categories).map((id) => (<li
                                key={id}
                                onClick={() => {
                                    this.getByCategory(id);
                                }}
                                className={this.state.currentCategory === Number.parseInt(id, 10) ? 'active' : ''}
                            >
                                <img
                                    className='category'
                                    alt={`${this.state.categories[id].toLowerCase()}`}
                                    src={`${this.state.categories[id].toLowerCase()}.svg`}
                                />
                                {this.state.categories[id]}
                            </li>))}
                        </ul>
                    </div>
                    <div className='questions-list'>
                        <div className="flex space-between items-center mb-2">
                            <h2>Questions</h2>
                            <Search submitSearch={this.submitSearch}/>
                            <NavLink
                                to={'/add'}
                                className="button primary outline">
                                Add Question
                            </NavLink>
                        </div>
                        {this.state.errorMessage.trim().length > 0 && (<div className='flex content-center'>

                            <div className='error show'>
                                <div className="flex space-between">
                                    <span>{this.state.errorMessage}</span>
                                    <span onClick={() => this.clearError()} className="close">
                                        &times;
                                    </span>
                                </div>
                            </div>
                        </div>)}
                        {this.state.questions.map((q, ind) => (<Question
                            key={q.id}
                            question={q.question}
                            answer={q.answer}
                            category={this.state.categories[q.category]}
                            difficulty={q.difficulty}
                            questionAction={this.questionAction(q.id)}
                        />))}
                        <div className='pagination-menu mb-2'>{this.createPagination()}</div>
                    </div>
                </div>
            </BaseLayout>
        );
    }
}

export default QuestionView;
