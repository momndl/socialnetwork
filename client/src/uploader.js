import { Component } from "react";

export class Uploader extends Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.handleChange = this.handleChange.bind(this);
    }
    handleChange(e) {
        console.log("changed");
        console.log(e.target.files[0]);
        const fd = new FormData();
        fd.append("file", e.target.files[0]);

        fetch("/upload", {
            method: "POST",
            body: fd,
        })
            .then((response) => response.json())
            .then((result) => {
                const url = result.url;
                this.props.updateImage(url);
            })
            .catch((error) => console.log("error while uploading: ", error));
    }
    componentDidMount() {
        console.log("uploader mounted");
    }
    render() {
        // if(!this.state.userId) {
        //     return null;
        // } => dont show anything until data is loaded
        return (
            <div className="uploadContainer">
                <p onClick={this.props.closeModal}>x</p>
                <form>
                    <input
                        type="file"
                        name="file"
                        accept="image/*"
                        id="fileInput"
                        className="hiddenFile"
                        onChange={this.handleChange}
                    />
                    <label className="picUploadBtn" htmlFor="fileInput">
                        Choose a file
                    </label>
                </form>
            </div>
        );
    }
}
