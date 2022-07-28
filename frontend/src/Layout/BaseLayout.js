import React from "react";
import Header from "../components/Header";

class BaseLayout extends React.Component {
    render() {
        return (<>
            <Header/>
            <div className="container mt-5" style={{marginTop: '100px'}}>
                {this.props.children}
            </div>
        </>);
    }
}

export default BaseLayout