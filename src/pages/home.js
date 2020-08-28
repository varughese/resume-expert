import React, { useEffect, useState, useCallback } from "react";
import { Link, useHistory } from "react-router-dom";
import { withFirebase, withAuthentication } from "../components/firebase";
import { useDropzone } from "react-dropzone";

const toDate = (date) => {
    if (date.toDate) {
        return date.toDate();
    } else if (date instanceof Date) {
        return date;
    } else {
        return null;
    }
};

const ResumeListing = ({ resumes, deleteResume }) => {
    const resumeIds = Object.keys(resumes);
    let validResumes = 0;

    const values = resumeIds.reverse().map((id) => {
        if (!resumes[id]) return null;
        const date = toDate(resumes[id]);
        if (!date) return null;
        validResumes++;
        return (
            <tr key={id}>
                <td>{date.toDateString()}</td>
                <td>
                    <Link to={`/resume/${id}`}>View Comments</Link>
                </td>
                <td>
                    <button
                        className="btn red"
                        onClick={() => deleteResume(id)}
                    >
                        Delete
                    </button>
                </td>
            </tr>
        );
    });
    return validResumes > 0 ? (
        <table className="listing">
            <thead>
                <tr>
                    <td>Date Uploaded</td>
                    <td>Review</td>
                    <td></td>
                </tr>
            </thead>
            <tbody>{values}</tbody>
        </table>
    ) : (
        <p>No resumes, upload a new one by clicking below!</p>
    );
};

const HomeBase = ({ firebase }) => {
    const [user, setUser] = useState("");
    const [uploading, setUploading] = useState("NOT_UPLOADED");
    const [resumes, setResumes] = useState({});
    const [loading, setLoading] = useState(true);
    const history = useHistory();

    const onDrop = useCallback(
        async (acceptedFiles) => {
            setUploading("UPLOADING");
            const file = acceptedFiles[0];
            const resume = await firebase.uploadResume(file);
            const oldResumes = { ...resumes, ...resume };
            setResumes(oldResumes);
            setUploading("UPLOADED");
        },
        [firebase, resumes]
    );

    const { getRootProps, getInputProps } = useDropzone({ onDrop });

    const getUser = async () => {
        setLoading(true);
        const userData = (await firebase.user_ref().get()).data();
        setUser(userData);
        const oldResumes = { ...resumes, ...userData.resumes };
        setResumes(oldResumes);
        setLoading(false);
    };

    const signOut = async () => {
        await firebase.signOut();
        history.push("/");
    };

    useEffect(() => {
        if (!user && firebase.getUser() !== null) {
            getUser();
        }
    });

    return (
        <div className="container">
            <h1>Home</h1>
            <button className="btn" onClick={() => signOut()}>
                Sign out
            </button>
            <div className="box mt">
                {loading ? (
                    <p>Loading...</p>
                ) : (
                    <div>
                        <p>
                            Here are a list of your uploaded resumes. To send to
                            reviewers, click "View Comments" and send the link
                            to who you want to review it.
                        </p>
                        <ResumeListing
                            resumes={resumes}
                            deleteResume={(id) => {
                                setResumes({ ...resumes, ...{ [id]: false } });
                                firebase.deleteResume(id);
                            }}
                        />
                    </div>
                )}
            </div>
            <div className="gray">
                {uploading === "NOT_UPLOADED" && (
                    <div {...getRootProps()}>
                        <input {...getInputProps()} />
                        <p>Click here to upload a new resume.</p>
                    </div>
                )}
                {uploading === "UPLOADING" && <p>Uploading</p>}
            </div>
        </div>
    );
};

const Home = withAuthentication(withFirebase(HomeBase));

export default Home;
