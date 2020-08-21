import React, { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { withFirebase, withAuthentication } from "../components/firebase";
import { useDropzone } from "react-dropzone";

const ResumeListing = ({ resumes }) => {
    const resumeIds = Object.keys(resumes);

    const values = resumeIds.map((id) => (
        <li key={id}>
            <Link to={`/resume/${id}`}>View reviews</Link>{" "}
            <a href={resumes[id]}>View PDF</a>
        </li>
    ));
    return <ul>{values}</ul>;
};

const HomeBase = ({ firebase }) => {
    const [user, setUser] = useState("");
    const [uploading, setUploading] = useState("NOT_UPLOADED");
    const [resumes, setResumes] = useState({});

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
        const userData = (await firebase.user_ref().get()).data();
        setUser(userData);
        const oldResumes = { ...resumes, ...userData.resumes };
        setResumes(oldResumes);
    };

    useEffect(() => {
        if (!user && !!firebase.getUser()) {
            getUser();
        }
    });

    if (!firebase.getUser()) {
        return null;
    }
    return (
        <div>
            <h1>Home</h1>
            <button>I want to get paid to review resumes.</button>
            <ResumeListing resumes={resumes} />
            {uploading === "NOT_UPLOADED" && (
                <div className="dropzone" {...getRootProps()}>
                    <input {...getInputProps()} />
                    <p>Click or drag a new resume here.</p>
                </div>
            )}
            {uploading === "UPLOADING" && <p>Uploading</p>}
        </div>
    );
};

const Home = withAuthentication(withFirebase(HomeBase));

export default Home;
