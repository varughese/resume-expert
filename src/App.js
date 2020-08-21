import React from "react";
import "./index.css";
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Redirect,
} from "react-router-dom";
import { Resume, Home, Landing, SignIn, SignUp, ROUTES } from "./pages";
import { withFirebase, withAuthentication } from "./components/firebase";

function App({ firebase }) {
    const isLoggedIn = firebase.getUserId();
    return (
        <Router>
            <div>
                <Switch>
                    <Route exact path={ROUTES.LANDING} component={Landing}>
                        {isLoggedIn && <Redirect from="/" to={ROUTES.HOME} />}
                    </Route>
                    <Route path={ROUTES.SIGNIN} component={SignIn} />
                    <Route path={ROUTES.SIGNUP} component={SignUp} />
                    <Route path={ROUTES.HOME} component={Home} />
                    <Route path={ROUTES.RESUME} component={Resume} />
                </Switch>
            </div>
        </Router>
    );
}

export default withAuthentication(withFirebase(App));
