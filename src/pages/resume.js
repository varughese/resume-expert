import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { withFirebase } from "../components/firebase";
import PdfAnnotator from "../components/pdf-annotator";
import HighlightsListing from "../components/highlights-listing";
import * as ROUTES from "./routes";

const ResumeBase = ({ firebase, match }) => {
    const resumeId = match.params.id;
    const [resumeUrl, setResumeUrl] = useState(null);
    const [highlights, setHighlights] = useState([]);

    useEffect(() => {
        const getResume = async () => {
            const resumeUrl = await firebase.getResume(resumeId);
            setResumeUrl(resumeUrl);
        };
        const getHighlights = async () => {
            const firebaseHighlights = await firebase.getResumeHighlights(
                resumeId
            );
            if (
                firebaseHighlights &&
                highlights.length !== firebaseHighlights.length
            ) {
                setHighlights(firebaseHighlights);
            }
        };
        if (!resumeUrl) {
            getResume();
        }
        if (highlights.length === 0) {
            getHighlights();
        }
    }, [resumeUrl, firebase, resumeId, highlights]);

    const setHighlightsAndFirebase = (highlights) => {
        firebase.setResumeHighlights(resumeId, highlights);
        setHighlights(highlights);
    };

    return (
        <div className="flex vh100">
            <div className="resume-sidebar vh100" style={{ width: "25vw" }}>
                <Link to={ROUTES.HOME}>Home</Link>
                <HighlightsListing
                    highlights={highlights}
                    resetHighlights={() => setHighlightsAndFirebase([])}
                />
            </div>
            <PdfAnnotator
                url={resumeUrl}
                highlights={highlights}
                setHighlights={setHighlightsAndFirebase}
            />
        </div>
    );
};

const Resume = withFirebase(ResumeBase);

export default Resume;
