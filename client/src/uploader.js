import { Component } from "react";

export class Uploader extends Component {
    constructor(props) {
        super(props);
        this.state = {};
        //this.handleChange = this.handleChange.bind(this);
    }
    componentDidMount() {
        console.log("uploader mounted");
    }
    render() {
        // if(!this.state.userId) {
        //     return null;
        // } => dont show anything until data is loaded
        return (
            <div>
                <p>uploader hier ein button label zum pic hochladen</p>
            </div>
        );
    }
}
