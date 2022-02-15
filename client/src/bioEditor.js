import { Component } from "react";

export default class BioEditor extends Component {
    constructor(props) {
        super(props);
        this.state = {
            draftBio: "",
            textAreaVisible: false,
        };
        this.openTextArea = this.openTextArea.bind(this);
        this.keyCheck = this.keyCheck.bind(this);
        this.submitBio = this.submitBio.bind(this);
    }
    componentDidMount() {
        console.log("props mounting bioEditor", this.props);
    }
    openTextArea() {
        this.setState({ textAreaVisible: true });
    }
    closeTextArea() {
        this.setState({ textAreaVisible: false });
    }

    keyCheck(e) {
        if (e.key === "Enter") {
            e.preventDefault();
            this.submitBio();
        }

        this.setState({
            draftBio: e.target.value,
        });
    }

    submitBio() {
        const bio = this.state.draftBio;
        fetch("/user/updatebio.json", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ bio }),
        })
            .then((res) => res.json())
            .then((data) => {
                console.log("dadaatata: ", data);
                this.props.updateBio(data);
                this.setState({ textAreaVisible: false });
            })
            .catch((error) => console.log("error in submit bio", error));
    }

    render() {
        return (
            <div>
                {!this.props.bio && (
                    <h2 className="editBioBtn" onClick={this.openTextArea}>
                        add bio
                    </h2>
                )}
                {this.state.textAreaVisible && (
                    <>
                        <textarea
                            defaultValue={this.props.bio}
                            onKeyDown={this.keyCheck}
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
                        <h2 className="editBioBtn" onClick={this.openTextArea}>
                            edit bio
                        </h2>
                    </>
                )}
            </div>
        );
    }
}
