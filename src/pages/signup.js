import React from "react";
import { Link } from "react-router-dom";
import { withFirebase } from "../components/firebase";
import Dropzone from "react-dropzone";
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
            loading: false,
        };

        this.handleSubmit = this.handleSubmit.bind(this);
    }

    async handleSubmit(event) {
        event.preventDefault();
        this.setState({ loading: true });
        try {
            await this.props.firebase.createUserWithEmailAndPassword(
                this.state.email,
                this.state.password
            );
            this.props.firebase.createUser({
                email: this.state.email,
                username: this.state.username,
            });
            await this.props.firebase.uploadResume(this.state.resume);
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
        const resumeJsx = (
            <div>
                {hasResume && (
                    <div>
                        <code>{this.state.resume.path}</code>
                    </div>
                )}
                <Dropzone
                    onDrop={(acceptedFiles) =>
                        this.setState({ resume: acceptedFiles[0] })
                    }
                >
                    {({ getRootProps, getInputProps }) => (
                        <section className="mt dropzone">
                            <div {...getRootProps()}>
                                <input {...getInputProps()} />
                                <p>
                                    Drag or click to{" "}
                                    {hasResume ? "replace" : "upload"} resume.
                                </p>
                            </div>
                        </section>
                    )}
                </Dropzone>
            </div>
        );
        return (
            <div className="center">
                <div>
                    <h2>Sign up!</h2>
                    <form className="box" onSubmit={this.handleSubmit}>
                        {this.state.loading && "Loading ... "}
                        <div className="form-group">
                            <label>Username</label>
                            <input
                                onChange={(e) => this.handleChange(e)}
                                name="username"
                            ></input>
                        </div>
                        <div className="form-group">
                            <label>Email</label>
                            <input
                                onChange={(e) => this.handleChange(e)}
                                name="email"
                                placeholder="john@gmail.com"
                            ></input>
                        </div>
                        <div className="form-group">
                            <label>Password</label>
                            <input
                                onChange={(e) => this.handleChange(e)}
                                type="password"
                                name="password"
                            ></input>
                        </div>
                        <div className="form-group">
                            <label>Resume</label>
                            <div>{resumeJsx}</div>
                        </div>
                        <button className="btn" type="submit">
                            Sign Up!
                        </button>
                        <p className="error">{this.state.errorMessage}</p>
                        <div>{this.state.error}</div>
                    </form>
                    <p className="gray">
                        Already have an account?{" "}
                        <Link to="/signin">Sign in</Link>
                    </p>
                </div>
            </div>
        );
    }
}

const SignUp = withFirebase(SignUpBase);

export default SignUp;
