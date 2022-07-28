import React, {Component} from 'react';

class Search extends Component {
    state = {
        query: '',
    };

    getInfo = (event) => {
        event.preventDefault();
        this.props.submitSearch(this.state.query);
    };

    handleInputChange = () => {
        this.setState({
            query: this.search.value,
        });
    };

    render() {
        return (
            <form onSubmit={this.getInfo}>
                <div className="flex">
                    <input
                        className="search"
                        placeholder='Search questions...'
                        ref={(input) => (this.search = input)}
                        onChange={this.handleInputChange}
                    />
                    <button type='submit' className='primary outline'>
                        Submit
                    </button>
                </div>
            </form>
        );
    }
}

export default Search;
