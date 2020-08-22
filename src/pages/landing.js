import React from "react";
import { Link, withRouter } from "react-router-dom";
import { useDropzone } from "react-dropzone";
import { ROUTES } from ".";

const LandingBase = () => {
    const { getRootProps, getInputProps, acceptedFiles } = useDropzone();
    const fileInfo = acceptedFiles[0] ? (
        <span>{acceptedFiles[0].path}</span>
    ) : null;
    return (
        <div className="container mt">
            <h1>Resume Expert</h1>
            <div className="box">
                <div className="dropzone" {...getRootProps()}>
                    <input {...getInputProps()} />
                    <div>
                        <ol>
                            <li>
                                Drag your resume here (or click to upload it)
                            </li>
                            <li>Get a custom link to send to a reviewer</li>
                            <li>
                                Your reviewer can easily leave comments, and
                                then you can land your dream job
                            </li>
                        </ol>
                    </div>
                </div>
                {fileInfo && (
                    <div>
                        <p>
                            Uploaded <code>{fileInfo}</code>
                        </p>
                        <Link
                            className="btn"
                            to={{
                                pathname: ROUTES.SIGNUP,
                                data: acceptedFiles[0],
                            }}
                        >
                            Get it reviewed
                        </Link>
                    </div>
                )}
            </div>
            <p className="gray">
                Already have an account? <Link to="/signin">Sign in</Link>
            </p>
        </div>
    );
};

const Landing = withRouter(LandingBase);

export default Landing;
