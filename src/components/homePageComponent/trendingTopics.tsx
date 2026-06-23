import { useLanguage } from "@/context/languageContext";

const TrendingTopics = () => {
    const { langCode } = useLanguage();
  const langu = langCode
    return (
        <div className="panel_inner review-inner">
        <div className="panel_header">
          <h4>
            <strong>Trending</strong> topics
          </h4>
        </div>
        <div className="panel_body">
          {/* Category item */}
          <div
            className="text-center mb-2 card-bg-scale position-relative overflow-hidden bg-dark-overlay bg-img p-3"
            data-image-src="assets/images/masonry/trending/travel.jpg"
            style={{ borderRadius: '6px' }} // Adjust the value as needed

          >
            <a
              href={`/${langu}/india`}
              className="btn-link fs-5 fw-bold stretched-link text-decoration-none text-white"

            >
              India
            </a>
          </div>
          {/* Category item */}
          <div
            className="text-center mb-2 card-bg-scale position-relative overflow-hidden bg-dark-overlay bg-img p-3"
            data-image-src="assets/images/masonry/trending/business.jpg"
            style={{ borderRadius: '6px' }} // Adjust the value as needed

          >
            <a
              href={`/${langu}/business`}
              className="btn-link fs-5 fw-bold stretched-link text-decoration-none text-white"

            >
              Business
            </a>
          </div>
          {/* Category item */}
          <div
            className="text-center mb-2 card-bg-scale position-relative overflow-hidden bg-dark-overlay bg-img p-3"
            data-image-src="assets/images/masonry/trending/marketing.jpg"
            style={{ borderRadius: '6px' }} // Adjust the value as needed
          >
            <a
              href={`/${langu}/business/market`}
              className="btn-link fs-5 fw-bold stretched-link text-decoration-none text-white"
            >
              Market
            </a>
          </div>
          {/* Category item */}
          <div
            className="text-center mb-2 card-bg-scale position-relative overflow-hidden bg-dark-overlay bg-img p-3"
            data-image-src="assets/images/masonry/trending/photography.jpg"
            style={{ borderRadius: '6px' }} // Adjust the value as needed
          >
            <a
              href={`/${langu}/technology`}
              className="btn-link fs-5 fw-bold stretched-link text-decoration-none text-white"
            >
              Technology
            </a>
          </div>
          {/* Category item */}
          <div
            className="text-center mb-2 card-bg-scale position-relative overflow-hidden bg-dark-overlay bg-img p-3"
            data-image-src="assets/images/masonry/trending/sports.jpg"
            style={{ borderRadius: '6px' }} // Adjust the value as needed
          >
            <a
              href={`/${langu}/sports`}
              className="btn-link fs-5 fw-bold stretched-link text-decoration-none text-white"

            >
              Sports
            </a>
          </div>
        </div>
      </div>
    )
}
export default TrendingTopics;