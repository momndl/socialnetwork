import { Component } from "react";

export default class BioEditor extends Component {
    constructor(props) {
        super(props);
        this.state = {
            draftBio: "",
            textAreaVisible: false,
        };
        this.openTextArea = this.openTextArea.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.submitBio = this.submitBio.bind(this);
    }
    componentDidMount() {
        console.log("props mounting bioEditor", this.props);
    }
    openTextArea() {
        console.log("ok", this.state);
        this.setState({ textAreaVisible: true });
    }
    closeTextArea() {
        this.setState({ textAreaVisible: false });
    }
    handleChange({ target }) {
        // console.log("someone is typing in an input field");
        // console.log("target.name", target.name);
        console.log("target.value", this.state);
        // add these values to the component's state
        this.setState({
            draftBio: target.value,
        });
    }

    submitBio() {
        console.log("test bio", this.state.draftBio);
        fetch("/user/updatebio.json", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(this.state),
        })
            .then((res) => res.json())
            .then((data) => {
                console.log("data after submitBio fetch", data);
                this.props.updateBio(data);
                this.setState({ textAreaVisible: false });
            })
            .catch((error) => console.log("error in submit bio", error));
        // 1. make a fetch POST request with the draftBio that the user typed!
        // grab the draftBio from bioEditor's state and send it along with the request!
        // make sure you get back the newly added bio (from the database)
        // 2. set the new official bio (the one you just got back from the db) in the state of APP
        // the bio that lives in App's state is the official one ✅
        // you can do something like -> this.props.setBio(yourOfficialBio)
    }

    render() {
        return (
            <div>
                <p>bio editor component</p>

                {!this.props.bio && (
                    <h2 onClick={this.openTextArea}> add bio</h2>
                )}
                {this.state.textAreaVisible && (
                    <>
                        <textarea
                            onChange={this.handleChange}
                            name="bio"
                            id="bio"
                            cols="30"
                            rows="10"
                        ></textarea>
                        <button onClick={this.submitBio}>update bio</button>
                    </>
                )}
                {this.props.bio && (
                    <>
                        <h2> {this.props.bio}</h2>
                        <h2 onClick={this.openTextArea}> edit bio</h2>
                    </>
                )}
                {/* Do your rendering logic in here!

                <p>{this.props.bio}</p>

                It all depends on whether you are on edit more or not.
                Whenever they click on the add or edit button, you are on edit mode - show the text area!

                If showTextArea is true, then render the text area with a button that says save / submit
                If you're not adding or editing a bio, then you should NOT see the text area 
                If you're NOT in edit mode, THEN check to see if there is a bio! 

                if there is a bio, allow them to EDIT a bio! 
                if there is NO bio, allow them to ADD a bio! */}
            </div>
        );
    }
}

// this.state = {
//     showTextArea: false,
//     draftBio: "",
// };

// //store textarea input via onchange event in draftBio. once, store butten is pushed. store bio in database

// // pass submit bio function so offical bio can live inside state of app

// submitBio() {

//     this.PaymentResponse.setBio(yourOfficialBio)
// }

// // down here code from encounter
// // check conditional rendering
