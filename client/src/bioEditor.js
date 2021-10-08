// check conditional rendering

this.state = {
    showTextArea: false,
    draftBio: "",
};

//store textarea input via onchange event in draftBio. once, store butten is pushed. store bio in database

// pass submit bio function so offical bio can live inside state of app

submitBio() {



    this.PaymentResponse.setBio(yourOfficialBio)
}

// down here code from encounter 
import { Component } from "react";

export default class BioEditor extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showTextArea: false,
            draftBio: ""
        };
    }

    handleBioChange(e) {
        // in here, you want to keep track of the bio that the user is typing in the textarea!
        // store whatever that value is in bioEditor's state as the 'draftBio'
    }

    submitBio() {
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
                {/* Do your rendering logic in here!
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