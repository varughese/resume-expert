import React from "react";
import { withRouter, Link } from "react-router-dom";
import { withFirebase } from "../components/firebase";
import * as ROUTES from "./routes";

class SignInBase extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            email: "",
            password: "",
            error: null,
        };
    }

    onSubmit = (event) => {
        const { email, password } = this.state;

        event.preventDefault();

        this.props.firebase
            .doSignInWithEmailAndPassword(email, password)
            .then(() => {
                this.setState({ email: "", password: "", error: null });
                this.props.history.push(ROUTES.LANDING);
            })
            .catch((error) => {
                this.setState({ error });
            });
    };

    onChange = (event) => {
        const { name, value } = event.target;
        this.setState({ [name]: value });
    };

    render() {
        const { email, password, error } = this.state;

        const isInvalid = password === "" || email === "";

        return (
            <div className="center">
                <div>
                    <h2>Sign in</h2>
                    <form className="box" onSubmit={this.onSubmit}>
                        <div className="form-group">
                            <label>Email Address</label>
                            <input
                                name="email"
                                value={email}
                                onChange={this.onChange}
                                type="text"
                                placeholder="Email Address"
                            />
                        </div>
                        <div className="form-group">
                            <label>Password</label>
                            <input
                                name="password"
                                value={password}
                                onChange={this.onChange}
                                type="password"
                                placeholder="Password"
                            />
                        </div>
                        <div>
                            <div>
                                <button className="btn" disabled={isInvalid}>
                                    Sign In
                                </button>
                            </div>
                            <div>
                                <p className="text-right">
                                    Don't have an account? Sign up{" "}
                                    <Link to={ROUTES.SIGNUP}>here.</Link>
                                </p>
                            </div>
                        </div>

                        {error && <p className="error">{error.message}</p>}
                    </form>
                </div>
            </div>
        );
    }
}

const SignIn = withRouter(withFirebase(SignInBase));

export default SignIn;
