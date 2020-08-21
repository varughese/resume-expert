import { FirebaseContext, AuthUserContext, withFirebase } from "./context";
import Firebase from "./firebase";
import { withAuthentication } from "./withAuthentication";

export default Firebase;

export { FirebaseContext, AuthUserContext, withAuthentication, withFirebase };
