import Link from "next/link";
import TimeDisplay from "./timeDisplay";

const MostViewPopular = ({ mostViewed, popularNews, handleNewsDetails }: any) => {
    return (
        <div>
            <div className="tabs-wrapper">
                <ul className="nav nav-tabs" id="myTab" role="tablist">
                    <li className="nav-item" role="presentation">
                        <button
                            className="nav-link border-0 active"
                            id="most-viewed"
                            data-bs-toggle="tab"
                            data-bs-target="#most-viewed-pane"
                            type="button"
                            role="tab"
                            aria-controls="most-viewed-pane"
                            aria-selected="true"
                        >
                            Most Viewed
                        </button>
                    </li>
                    <li className="nav-item" role="presentation">
                        <button
                            className="nav-link border-0"
                            id="popular-news"
                            data-bs-toggle="tab"
                            data-bs-target="#popular-news-pane"
                            type="button"
                            role="tab"
                            aria-controls="popular-news-pane"
                            aria-selected="false"
                        >
                            Popular news
                        </button>
                    </li>
                </ul>
                <div className="tab-content" id="myTabContent">
                    <div
                        className="tab-pane fade show active"
                        id="most-viewed-pane"
                        role="tabpanel"
                        aria-labelledby="most-viewed"
                        tabIndex={0}
                    >
                        <div className="most-viewed">
                            <ul id="most-today" className="content tabs-content">
                                {mostViewed.map((item: any, index: any) => (
                                    <li key={item.id}>
                                        <span className="count">
                                            {String(index + 1).padStart(2, "0")}
                                        </span>
                                        <div
                                            className="text"
                                            style={{ fontSize: "15px" }}
                                        >
                                            <Link href={`${item.url}`}>
                                                {item.title}
                                            </Link>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                    <div
                        className="tab-pane fade"
                        id="popular-news-pane"
                        role="tabpanel"
                        aria-labelledby="popular-news"
                        tabIndex={0}
                    >
                        <div className="most-viewed">
                            {popularNews && popularNews.length > 0 ? (
                                <ul
                                    id="most-today"
                                    className="content tabs-content"
                                >
                                    {popularNews.map((item: any, index: any) => (
                                        <div key={item.id} className="p-post">
                                            <h4 style={{ textAlign: "center" }}>
                                                <a
                                                    onClick={() => handleNewsDetails(item)}
                                                    style={{
                                                        color: "black",
                                                        cursor: "pointer",
                                                    }}
                                                >
                                                    {item.title}
                                                </a>
                                            </h4>
                                            <ul
                                                className="authar-info d-flex flex-wrap justify-content-center"
                                                style={{
                                                    marginTop: "-15px",
                                                    marginBottom: "-15px",
                                                }}
                                            >
                                                <li className="date d-flex">
                                                    <i
                                                        className="ti ti-timer "
                                                        style={{ marginRight: "5px" }}
                                                    />
                                                    <TimeDisplay
                                                        dateTime={item?.newsdatetime}
                                                    />
                                                </li>
                                                {/* <li className="like">
                                         <a href="#">
                                             <i className="ti ti-thumb-up" />
                                             15 likes
                                         </a>
                                     </li> */}
                                            </ul>
                                        </div>
                                    ))}
                                </ul>
                            ) : (
                                <p style={{ textAlign: "center" }}>
                                    No popular news
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default MostViewPopular;