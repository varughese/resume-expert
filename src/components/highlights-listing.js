import React from "react";

const updateHash = (highlight) => {
    document.location.hash = `highlight-${highlight.id}`;
};

// Basically Stolen from https://github.com/agentcooper/react-pdf-highlighter

function HighlightsListing({ highlights, resetHighlights }) {
    return (
        <div>
            <div className="description" style={{ padding: "1rem" }}>
                <p>
                    <small>
                        To create area highlight hold ⌥ Option key (Alt), then
                        click and drag.
                    </small>
                </p>
            </div>

            <ul className="sidebar__highlights">
                {highlights.map((highlight, index) => (
                    <li
                        key={index}
                        className="sidebar__highlight"
                        onClick={() => {
                            updateHash(highlight);
                        }}
                    >
                        <div>
                            <strong>{highlight.comment.text}</strong>
                            {highlight.content.text ? (
                                <blockquote style={{ marginTop: "0.5rem" }}>
                                    {`${highlight.content.text
                                        .slice(0, 90)
                                        .trim()}…`}
                                </blockquote>
                            ) : null}
                            {highlight.content.image ? (
                                <div
                                    className="highlight__image"
                                    style={{ marginTop: "0.5rem" }}
                                >
                                    <img
                                        src={highlight.content.image}
                                        alt={"Screenshot"}
                                    />
                                </div>
                            ) : null}
                        </div>
                    </li>
                ))}
            </ul>
            {highlights.length > 0 ? (
                <div style={{ padding: "1rem" }}>
                    <button className="btn" onClick={resetHighlights}>
                        Reset highlights
                    </button>
                </div>
            ) : null}
        </div>
    );
}

export default HighlightsListing;
