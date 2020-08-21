import React from "react";

import {
    PdfLoader,
    PdfHighlighter,
    Tip,
    Highlight,
    Popup,
    AreaHighlight,
} from "react-pdf-highlighter";

const resetHash = () => {
    document.location.hash = "";
};

const parseIdFromHash = () =>
    document.location.hash.slice("#highlight-".length);

const HighlightPopup = ({ comment }) =>
    comment.text ? (
        <div className="Highlight__popup">{comment.text}</div>
    ) : null;

const PdfAnnotator = ({ url, highlights, setHighlights }) => {
    const getHighlightById = (id) => {
        return highlights.find((highlight) => highlight.id === id);
    };

    const addHighlight = (highlight) => {
        setHighlights([...highlights, highlight]);
    };

    const updateHighlight = (highlightId, position, content) => {
        setHighlights(
            highlights.map((h) => {
                return h.id === highlightId
                    ? {
                          ...h,
                          position: { ...h.position, ...position },
                          content: { ...h.content, ...content },
                      }
                    : h;
            })
        );
    };

    let scrollViewerTo = () => {};

    const scrollToHighlightFromHash = () => {
        const highlight = getHighlightById(parseIdFromHash());

        if (highlight) {
            scrollViewerTo(highlight);
        }
    };

    return (
        <div>
            <div
                style={{
                    height: "100vh",
                    width: "75vw",
                    overflowY: "scroll",
                    position: "relative",
                }}
            >
                <PdfLoader url={url} beforeLoad={<p>Loading</p>}>
                    {(pdfDocument) => (
                        <PdfHighlighter
                            pdfDocument={pdfDocument}
                            enableAreaSelection={(event) => event.altKey}
                            onScrollChange={resetHash}
                            scrollRef={(scrollTo) => {
                                scrollViewerTo = scrollTo;
                                scrollToHighlightFromHash();
                            }}
                            onSelectionFinished={(
                                position,
                                content,
                                hideTipAndSelection,
                                transformSelection
                            ) => (
                                <Tip
                                    onOpen={transformSelection}
                                    onConfirm={(comment) => {
                                        addHighlight({
                                            content,
                                            position,
                                            comment,
                                        });

                                        hideTipAndSelection();
                                    }}
                                />
                            )}
                            highlightTransform={(
                                highlight,
                                index,
                                setTip,
                                hideTip,
                                viewportToScaled,
                                screenshot,
                                isScrolledTo
                            ) => {
                                const isTextHighlight = !(
                                    highlight.content && highlight.content.image
                                );

                                const component = isTextHighlight ? (
                                    <Highlight
                                        isScrolledTo={isScrolledTo}
                                        position={highlight.position}
                                        comment={highlight.comment}
                                    />
                                ) : (
                                    <AreaHighlight
                                        highlight={highlight}
                                        onChange={(boundingRect) => {
                                            updateHighlight(
                                                highlight.id,
                                                {
                                                    boundingRect: viewportToScaled(
                                                        boundingRect
                                                    ),
                                                },
                                                {
                                                    image: screenshot(
                                                        boundingRect
                                                    ),
                                                }
                                            );
                                        }}
                                    />
                                );

                                return (
                                    <Popup
                                        popupContent={
                                            <HighlightPopup {...highlight} />
                                        }
                                        onMouseOver={(popupContent) =>
                                            setTip(
                                                highlight,
                                                (highlight) => popupContent
                                            )
                                        }
                                        onMouseOut={hideTip}
                                        key={index}
                                        children={component}
                                    />
                                );
                            }}
                            highlights={highlights}
                        />
                    )}
                </PdfLoader>
            </div>
        </div>
    );
};

export default PdfAnnotator;
