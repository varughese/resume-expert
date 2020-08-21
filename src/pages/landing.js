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
        <div>
            <h1>Landing</h1>
            <p>Get your resume reviewed!</p>
            <div className="dropzone" {...getRootProps()}>
                <input {...getInputProps()} />
                <p>Drag 'n' drop some files here, or click to select files</p>
            </div>
            <p>{fileInfo}</p>
            {fileInfo && (
                <Link
                    to={{
                        pathname: ROUTES.SIGNUP,
                        data: acceptedFiles[0],
                    }}
                >
                    Get it reviewed
                </Link>
            )}
            <div>Click here to upload or drag here</div>
            <Link to="/signin">Sign in</Link>
        </div>
    );
};

const Landing = withRouter(LandingBase);

export default Landing;
