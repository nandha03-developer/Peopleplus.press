
"use client"
import dynamic from "next/dynamic";
import "owl.carousel/dist/assets/owl.carousel.css";
import "owl.carousel/dist/assets/owl.theme.default.css";
import 'animate.css/animate.css'
import { useRouter } from "next/navigation";
import Link from "next/link";


 if (typeof window !== "undefined") {
  window.$ = window.jQuery = require("jquery");
}
// This is for Next.js. On Rect JS remove this line
const OwlCarousel = dynamic(() => import("react-owl-carousel"), {
    ssr: false,
});



const LeftCarousal = () => {
    const options = {
        loop: true,
        items: 1,
        dots: true,
        animateOut: 'fadeOut',
        animateIn: 'fadeIn',
        autoplay: true,
        autoplayTimeout: 4000, //Set AutoPlay to 4 seconds
        autoplayHoverPause: true,
        nav: true,
        navText: [
            "<i class='ti ti ti-angle-left'></i>",
            "<i class='ti ti ti-angle-right'></i>"
        ]
    
    };

    const router = useRouter();
    const handleClick = (stateNews: any) => {
      router.push(`/indiaNews/${stateNews}`);
    };

    const posts = [
        {
            id: 1,
            category: 'politics',
            title: 'Lok Sabha Speaker: It is expected that the NDA candidate will submit their nomination today, with the election scheduled for June 26th.',
            author: 'People Plus',
            date: 'July, 2024',
            imageSrc: '/assets/images/image_one.jpg',
            link: '/indiaNews/5'
        },
        
        {
            id: 2,
            category: 'another category',
            title: 'Another title',
            author: 'Another author',
            date: 'July, 2024',
            imageSrc: '/assets/images/image_two.jpg',
            link: '/indiaNews/6'
        },
        {
            id: 3,
            category: 'third category',
            title: 'Third title',
            author: 'Third author',
            date: 'July, 2024',
            imageSrc: '/assets/images/image_three.jpg',
            link: '/indiaNews/7'
        },
    ];

    return (
        <OwlCarousel id="owl-slider" className=" owl-theme" {...options}>
            {posts.map(post => (
                <div key={post.id} className="slider-post post-height-1" onClick={() => handleClick(post.id)}>
                   
                    {/* <Link href={post.link} className="news-image">
                       
                        <img
                            src={post.imageSrc}
                            alt="PeoplePlus"
                            className="img-fluid"
                        />
                    </Link> */}

                    <div className="post-text">
                        <span className="post-category">{post.category}</span>
                        <h2>
                            <Link href={post.link}>
                                {post.title}
                            </Link>
                        </h2>
                        <ul className="authar-info d-flex flex-wrap">
                            <li className="authar">
                                <Link href="/indiaNews/3">{post.author}</Link>
                            </li>
                            <li className="date">{post.date}</li>
                            <li className="view">
                                {/* Add views or any other info */}
                            </li>
                        </ul>
                    </div>
                </div>
            ))}
        </OwlCarousel>
    );
};

export default LeftCarousal;