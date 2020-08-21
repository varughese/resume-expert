import React from "react";

const FirebaseContext = React.createContext(null);

export const withFirebase = (Component) => (props) => (
    <FirebaseContext.Consumer>
        {(firebase) => <Component {...props} firebase={firebase} />}
    </FirebaseContext.Consumer>
);

const AuthUserContext = React.createContext(null);

export { FirebaseContext, AuthUserContext };
