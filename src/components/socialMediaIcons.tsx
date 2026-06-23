const SocialMediaIcons = () => {
    return (
      <div>
  <div className="align-items-center d-flex fs-6 justify-content-center mb-1 text-center social-counter-total" >
                    <i className="fa-solid fa-heart text-primary me-1" style={{ fontSize: '1.5rem', fontWeight: 'bold' }} />
                    <span style={{ fontWeight: 'bold' }}>FOLLOW US ON</span>
                  </div>
     
        <div className="social-media-inner mb-2">
        <ul className="g-1 row social-media">
          <li className="col-3">
            <a
              target="_blank"
              href="https://www.facebook.com/profile.php?id=61569346928265&mibextid=ZbWKwL"
              className="fb"
            >
              <i className="fab fa-facebook-f" />
              {/* <div>3,794</div>
                <p>Followers</p> */}
            </a>
          </li>
          <li className="col-3">
            <a
              target="_blank"
              href="https://www.instagram.com/peoplepluspress_news/profilecard/?igsh=MWdyMW9mc2lxOXlieg"
              className="insta"
            >
              <i className="fab fa-instagram" />
              {/* <div>941</div>
                <p>Followers</p> */}
            </a>
          </li>
          <li className="col-3">
            <a
              target="_blank"
              href="https://youtube.com/@peoplepluspress?si=nW-cBjQmVvVkftnD"
              className="you_tube"
            >
              <i className="fab fa-youtube" />
              {/* <div>7,820</div>
                <p>Subscribers</p> */}
            </a>
          </li>
          <li className="col-3">
            <a
              target="_blank"
              href="https://x.com/Peoplepluspres?t=RSgtZa3rJ4ZksyPXvwt5Ig&s=09"
              className="twitter"
            >
              <i className="fa-brands fa-x-twitter" />
              {/* <div>1,562</div>
                <p>Followers</p> */}
            </a>
          </li>
          <li className="col-3">
            <a
              target="_blank"
              href="https://in.linkedin.com/"
              className="rss"
            >
              <i className="fa-brands fa-linkedin" />
              {/* <div>2,035</div>
                <p>Followers</p> */}
            </a>
          </li>
          <li className="col-3">
            <a
              target="_blank"
              href="https://in.pinterest.com/peopleplusp/"
              className="pint"
            >
              <i className="fa-brands fa-pinterest" />
              {/* <div>1,310</div>
                <p>Followers</p> */}
            </a>
          </li>
          <li className="col-3">
            <a
              target="_blank"
              href="https://t.me/peoplepluspress"
              className="rss"
            >
             <i className="fab fa-telegram-plane"></i>
              {/* <div>2,035</div>
                <p>Followers</p> */}
            </a>
          </li>
          <li className="col-3">
            <a
              target="_blank"
              href="https://whatsapp.com/channel/0029Vax7KlR11ulIc4MrKK25"
              className="whatsapp"
            >
            <i className="fab fa-whatsapp"></i>
              {/* <div>1,310</div>
                <p>Followers</p> */}
            </a>
          </li>
        </ul>{" "}
        {/* /.social icon */}
      </div>
      </div>
    )
}
export default SocialMediaIcons;