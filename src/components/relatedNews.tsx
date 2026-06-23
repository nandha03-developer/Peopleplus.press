import { Box, Skeleton } from "@mui/material";
import Link from "next/link";
import { useContext, useState } from "react";
import TimeDisplay from "./timeDisplay";
import Image from "next/image";
import RelatedArticles from "./ltr/related-articles/related-articles";
import { GroupSubGroupContext } from "@/context/allGroupContext";

const RelatedNews = ({relatedArticles, loadingSkeleton, handleTags, newsItems}: any) => {
  const { setCurrentNews } = useContext(GroupSubGroupContext);

    const [currentPage, setCurrentPage] = useState(1);
    const articlesPerPage = 3;
  
    // Calculate total pages
    const totalPages = Math.ceil(relatedArticles?.length / articlesPerPage);
    const [activeButton, setActiveButton] = useState<string | null>(null);
  
    // Get the articles to display on the current page
    const indexOfLastArticle = currentPage * articlesPerPage;
    const indexOfFirstArticle = indexOfLastArticle - articlesPerPage;
    const selectedArticles = relatedArticles?.slice(
      indexOfFirstArticle,
      indexOfLastArticle
    );

    const handleNextPage = () => {
        if (currentPage < totalPages) {
          setCurrentPage(currentPage + 1);
          setActiveButton("next");
        }
      };

    const handlePreviousPage = () => {
        if (currentPage > 1) {
          setCurrentPage(currentPage - 1);
          setActiveButton("previous");
          setTimeout(() => setActiveButton(null), 500); // Reset after 2 seconds
        }
      };

    return (
      <div className="post-inner post-inner-2">
      {/*post header*/}
      <div
        className="post-head"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginTop: "20px",
        }}
      >
        <h2 className="title">
          <strong>Related </strong> News
        </h2>
        <div
          className="pagination-buttons"
          style={{ display: "flex" }}
        >
          <div
            style={{ marginRight: "10px" }}
            onClick={handlePreviousPage}
            className="pagination-button"
          >
            <a
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "35px",
                height: "35px",
                borderRadius: "50%",
                backgroundColor:
                  activeButton === "previous"
                    ? "#eb0254"
                    : "#fff",
                color:
                  activeButton === "previous" ? "#fff" : "black",
                textDecoration: "none",
                transition: "all 0.3s ease",
                cursor: "pointer",
                border: "2px solid grey",
                boxShadow:
                  activeButton === "previous"
                    ? "0px 0px 10px rgba(0, 0, 0, 0.2)"
                    : "none",
                margin: 0, // Remove any margin
                padding: 0, // Remove any padding
              }}
              className="page-link"
            >
              <span
                style={{ fontSize: "26px", marginBottom: "7px" }}
              >
                &#171;
              </span>
            </a>
          </div>

          <div
            onClick={handleNextPage}
            className="pagination-button"
          >
            <a
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "35px",
                height: "35px",
                borderRadius: "50%",
                backgroundColor:
                  activeButton === "next" ? "#eb0254" : "#fff",
                color: activeButton === "next" ? "#fff" : "black",
                textDecoration: "none",
                transition: "all 0.3s ease",
                cursor: "pointer",
                border: "2px solid grey",
                boxShadow:
                  activeButton === "next"
                    ? "0px 0px 10px rgba(0, 0, 0, 0.2)"
                    : "none",
                margin: 0, // Remove any margin
                padding: 0, // Remove any padding
              }}
              className="page-link"
            >
              <span
                style={{ fontSize: "26px", marginBottom: "7px" }}
              >
                &#187;
              </span>
            </a>
          </div>
        </div>
      </div>
      {/* post body */}
      <div className="post-body">
        <div className="row">
          {selectedArticles.map((article: any) => {
            const images = article.mainimages.split(",");
            const firstImage =
              images[0]?.trim() || "/path/to/fallback-image.jpg";

            return (
              <div
                key={article.id}
                className="col-xs-6 col-sm-4 col-md-4 col-padding"
              >
                <div
                  className="grid-item"
                  onClick={() => setCurrentNews({ ...article })}
                >
                  <div
                    className="grid-item-img"
                    style={{
                      position: "relative",
                      width: "100%",
                      height: "135px", // Set height for the container
                    }}
                  >
                    <Link
                      href={article.url}
                      className="thumb"
                      passHref

                    >
                      {loadingSkeleton && (
                        <Skeleton
                          variant="rectangular"
                          width="100%"
                          height="135px"
                        />
                      )}

                      <Image
                        src={firstImage}
                        alt={article.title}
                        layout="fill" // Use fill to allow image to cover the div
                        objectFit="cover" // Maintain aspect ratio
                        className="img-fluid" // Existing Bootstrap class
                        style={{ borderRadius: "6px" }} // Inline style for border radius
                      // onLoadingComplete={() => setLoadingImg(false)} // Hide skeleton once image is loaded
                      />
                    </Link>
                  </div>
                  {loadingSkeleton ? (
                    <Box sx={{ pt: 0.5 }}>
                      <Skeleton />
                      <Skeleton width="60%" />
                    </Box>
                  ) : (
                    <h5
                      className="title"
                      style={{
                        fontSize: "12px",
                        color: "black",
                        fontWeight: "bold",
                      }}
                    >
                      <Link href={`${article.url}`}>
                        {" "}
                        {article.title}
                      </Link>
                    </h5>
                  )}

                  {loadingSkeleton ? (
                    <Box sx={{ pt: 0.5 }}>
                      <Skeleton />
                      <Skeleton width="60%" />
                    </Box>
                  ) : (
                    <div style={{ display: "flex", justifyContent: "flex-start", alignItems: "center", gap: "7px" }}>
                      <span
                        style={{
                          cursor: "pointer",
                          fontSize: "9px",
                        }}
                        onClick={() => handleTags(newsItems)}
                        className="post-category"
                      >
                        {article?.tags}
                      </span>
                      <div
                        className="date"
                        style={{
                          fontSize: "13px",
                          color: "black",
                          top: "-3px",
                          position: "relative",
                        }}
                      >
                        <TimeDisplay dateTime={article?.newsdatetime} />
                      </div>
                    </div>

                  )}

                </div>
              </div>
            );
          })}
        </div>
        <RelatedArticles />
      </div>
    </div>
    )
}
export default RelatedNews;