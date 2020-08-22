import app from "firebase/app";
import * as firebase from "firebase";
import "firebase/firestore";
import "firebase/auth";

const config = {
    apiKey: "AIzaSyAeqzDo30HEEenRHX9Sq-ZBTNNwSQlgo9E",
    authDomain: "resumeexpert-8be43.firebaseapp.com",
    databaseURL: "https://resumeexpert-8be43.firebaseio.com",
    projectId: "resumeexpert-8be43",
    storageBucket: "resumeexpert-8be43.appspot.com",
    messagingSenderId: "211745586888",
    appId: "1:211745586888:web:51bc23f371fae705056ffd",
};

function uuid() {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (
        c
    ) {
        var r = (Math.random() * 16) | 0,
            v = c === "x" ? r : (r & 0x3) | 0x8;
        return v.toString(16);
    });
}

class Firebase {
    constructor() {
        app.initializeApp(config);

        this.db = app.firestore();
        this.auth = app.auth();
        this.storage = app.storage();
    }

    user_ref = () => {
        const id = this.getUserId();
        return this.db.collection("users").doc(id);
    };

    resume_ref = (id) => {
        return this.db.collection("resumes").doc(id);
    };

    pdfblob_ref = () => {
        return this.storage.ref().child("pdf");
    };

    getUser = () => {
        if (this.auth.currentUser) {
            return this.auth.currentUser;
        } else {
            console.warn("No user. Log in");
            return null;
        }
    };

    signOut = () => {
        localStorage.removeItem("authUser");
        return this.auth.signOut();
    };

    getUserId = () => {
        if (this.auth.currentUser) {
            return this.auth.currentUser.uid;
        }
        const fromLocalStorage = JSON.parse(localStorage.getItem("authUser"));
        if (fromLocalStorage) {
            return fromLocalStorage.uid;
        } else {
            return null;
        }
    };

    uploadResume = async (file) => {
        const resumeId = uuid();
        const snapshot = await this.pdfblob_ref().child(resumeId).put(file);
        const url = await snapshot.ref.getDownloadURL();
        const update = { [resumeId]: new Date() };
        const userId = this.getUserId();
        this.user_ref().set(
            {
                resumes: update,
            },
            { merge: true }
        );
        this.resume_ref(resumeId).set({
            url,
            owner: userId,
            reviewers: {
                [userId]: true,
            },
        });
        return update;
    };

    getResume = async (resumeId) => {
        const resumes = JSON.parse(localStorage.getItem("resumeUrls")) || {};
        if (resumes[resumeId]) {
            return resumes[resumeId];
        }
        const pdfRef = this.pdfblob_ref().child(resumeId);
        const url = await pdfRef.getDownloadURL();
        resumes[resumeId] = url;
        localStorage.setItem("resumeUrls", JSON.stringify(resumes));
        return url;
    };

    deleteResume = async (resumeId) => {
        const pdfRef = this.pdfblob_ref().child(resumeId);
        await pdfRef.delete();
        await this.resume_ref(resumeId).delete();
        this.user_ref().set(
            {
                resumes: {
                    [resumeId]: false,
                },
            },
            { merge: true }
        );
    };

    setResumeHighlights = async (resumeId, highlights) => {
        if (!resumeId) return;
        this.resume_ref(resumeId).update({
            comments: highlights,
        });
    };

    getResumeHighlights = async (resumeId) => {
        if (!resumeId) return;
        const resumeDoc = await this.resume_ref(resumeId).get();
        return resumeDoc.get("comments");
    };

    signOut = () => {
        localStorage.removeItem("authUser");
        return this.auth.signOut();
    };

    async doSignInWithEmailAndPassword(email, password) {
        await this.auth.setPersistence(app.auth.Auth.Persistence.LOCAL);
        return this.auth.signInWithEmailAndPassword(email, password);
    }

    async createUserWithEmailAndPassword(email, password) {
        return this.auth.createUserWithEmailAndPassword(email, password);
    }

    createUser(data) {
        this.user_ref().set(data);
    }

    async authWithGoogle() {
        const provider = new firebase.auth.GoogleAuthProvider();
        provider.addScope("profile");
        provider.addScope("email");

        const user = await this.auth.signInWithPopup(provider);
        return {
            username: user.additionalUserInfo.username,
            email: user.additionalUserInfo.email,
        };
    }

    async authWithGithub() {
        const provider = new firebase.auth.GithubAuthProvider();
        provider.addScope("profile");
        provider.addScope("email");

        const user = await this.auth.signInWithPopup(provider);
        return {
            username: user.additionalUserInfo.username,
            email: user.additionalUserInfo.email,
        };
    }
}

export default Firebase;
