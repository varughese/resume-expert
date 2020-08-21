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
            <div>
                <h2>Sign in</h2>
                <form onSubmit={this.onSubmit}>
                    <div>
                        <input
                            name="email"
                            value={email}
                            onChange={this.onChange}
                            type="text"
                            placeholder="Email Address"
                        />
                    </div>
                    <div>
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
                            <button disabled={isInvalid}>Sign In</button>
                        </div>
                        <div>
                            <p className="text-right">
                                Don't have an account? Sign up{" "}
                                <Link to={ROUTES.SIGNUP}>here.</Link>
                            </p>
                        </div>
                    </div>

                    {error && <p>{error.message}</p>}
                </form>
            </div>
        );
    }
}

const SignIn = withRouter(withFirebase(SignInBase));

export default SignIn;
