import React from "react";
import { withFirebase } from "../components/firebase";
import Dropzone from "react-dropzone";
import { Document, Page } from "react-pdf";
import * as ROUTES from "./routes";

class SignUpBase extends React.Component {
    constructor(props) {
        super(props);

        const { data } = this.props.location;

        this.state = {
            email: "",
            password: "",
            firstname: "",
            resume: data,
        };

        this.handleSubmit = this.handleSubmit.bind(this);
    }

    async handleSubmit(event) {
        event.preventDefault();
        try {
            await this.props.firebase.createUserWithEmailAndPassword(
                this.state.email,
                this.state.password
            );
            this.props.firebase.createUser({
                email: this.state.email,
                username: this.state.username,
            });
            this.props.history.push(ROUTES.LANDING);
        } catch (e) {
            this.setState({
                errorMessage: e.message,
            });
            return;
        }
    }

    handleChange = (event) => {
        this.setState({
            [event.target.name]: event.target.value,
            errorMessage: "",
        });
    };

    render() {
        const hasResume = this.state.resume;
        const resumeJsx = hasResume ? (
            <div>
                <Document className="pdfminiviewer" file={this.state.resume}>
                    <Page width="300" pageNumber={1} />
                </Document>
                <p>{this.state.resume.path}</p>
            </div>
        ) : (
            <Dropzone
                onDrop={(acceptedFiles) =>
                    this.setState({ resume: acceptedFiles[0] })
                }
            >
                {({ getRootProps, getInputProps }) => (
                    <section>
                        <div {...getRootProps()}>
                            <input {...getInputProps()} />
                            <p>Drag or click to upload resume.</p>
                        </div>
                    </section>
                )}
            </Dropzone>
        );
        return (
            <div>
                <form onSubmit={this.handleSubmit}>
                    <div>
                        <label>Username</label>
                        <input
                            onChange={(e) => this.handleChange(e)}
                            name="username"
                        ></input>
                    </div>
                    <div>
                        <label>Email</label>
                        <input
                            onChange={(e) => this.handleChange(e)}
                            name="email"
                            placeholder="john@gmail.com"
                        ></input>
                    </div>
                    <div>
                        <label>Password</label>
                        <input
                            onChange={(e) => this.handleChange(e)}
                            type="password"
                            name="password"
                        ></input>
                    </div>
                    <div>{resumeJsx}</div>
                    <button type="submit">Sign Up!</button>
                    <p>{this.state.errorMessage}</p>
                    <div>{this.state.error}</div>
                </form>
            </div>
        );
    }
}

const SignUp = withFirebase(SignUpBase);

export default SignUp;
