"use client"
import Layout from "@/components/ltr/layout/layout";
import UseRemoveBodyClass from "@/components/ltr/useEffect-hook/useEffect-hook";
import Link from "next/link";
const Page = () => {
    UseRemoveBodyClass(['None'], ['home-seven', 'home-nine','boxed-layout','home-six','home-two']);
    return (
        <Layout>
            {/* *** START PAGE MAIN CONTENT *** */}
           <div>
           <main className="page_main_wrapper">
                {/* START PAGE HEADER */}
                <section
                    className="inner-head bg-img"
                    data-image-src="/assets/images/masonry/faq.png"
                >
                    <div className="container position-relative">
                        <div className="row">
                            <div className="col-sm-12">
                                <h2 className="entry-title" style={{fontFamily:"sans-serif"}}>Frequently Asked Question</h2>
                                <p className="description"  style={{ fontSize: "16px",fontFamily: "Montserrat, sans-serif" }}>
                                At People Plus, we prioritize individuals and communities, fostering meaningful connections and collaboration. Our platform is designed to empower, inform, and enhance lives through shared experiences and opportunities. Together, we build stronger networks and brighter futures.
                                </p>
                                <div className="breadcrumb" style={{
    padding: '10px 15px', // Padding around the breadcrumb
    borderRadius: '5px', // Rounded corners
  }}>
                                    <ul  style={{
      listStyle: 'none', // Remove default list styles
      padding: 0, // Remove default padding
      margin: 0, // Remove default margin
      display: 'flex', // Use flexbox for horizontal alignment
      alignItems: 'center', // Center items vertically
    }}>
                                        <li>
                                            <Link href="/" style={{ textDecoration: 'none', color: 'white' }}>Home</Link>
                                        </li>
                                        <li style={{  color: 'white',marginLeft:"-10px" }}>&#x27A4;</li>
                                        <li className="ib current-page" style={{
        color: 'black', // Color for the current page
        marginLeft:"-10px"     
      }}>F.A.Q</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                {/* END OF /. PAGE HEADER */}
                <section className="faq-inner">
                    <div className="container">
                        <div className="row">
                            <div className="col-md-12 col-sm-12">
                                <div className="panel-group" id="accordion" role="tablist">
                                    <div className="panel">
                                        <div className="panel-heading" role="tab" id="headingOne">
                                            <h4 className="panel-title" style={{ fontSize: "18px",fontFamily: "Montserrat, sans-serif",color:"#2b2121", textAlign: "justify" }}>
                                                <a
                                                    role="button"
                                                    data-bs-toggle="collapse"
                                                    data-parent="#accordion"
                                                    href="#collapseOne"
                                                    aria-controls="collapseOne"
                                                >
                                                    1. What is People Plus Press?  
                                                </a>
                                            </h4>
                                        </div>
                                        <div
                                            id="collapseOne"
                                            className="panel-collapse collapse in"
                                            role="tabpanel"
                                            aria-labelledby="headingOne"
                                        >
                                            <div className="panel-body">
                                                <p style={{ fontSize: "16px",fontFamily: "Montserrat, sans-serif",color:"#2b2121", textAlign: "justify" }}>
                                                People Plus Press is a comprehensive news platform dedicated to delivering accurate and timely news updates across various domains including politics, business, technology, entertainment, sports, and more. 
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    {/* end of panel */}
                                    <div className="panel">
                                        <div className="panel-heading" role="tab" id="headingTwo">
                                            <h4 className="panel-title" style={{ fontSize: "18px",fontFamily: "Montserrat, sans-serif",color:"#2b2121", textAlign: "justify" }}>
                                                <a
                                                    className="collapsed"
                                                    role="button"
                                                    data-bs-toggle="collapse"
                                                    data-parent="#accordion"
                                                    href="#collapseTwo"
                                                    aria-controls="collapseTwo"
                                                >
                                                   2. How can I access People Plus Press?
                                                </a>
                                            </h4>
                                        </div>
                                        <div
                                            id="collapseTwo"
                                            className="panel-collapse collapse"
                                            role="tabpanel"
                                            aria-labelledby="headingTwo"
                                        >
                                            <div className="panel-body">
                                                <p style={{ fontSize: "16px",fontFamily: "Montserrat, sans-serif",color:"#2b2121", textAlign: "justify" }}>
                                                You can access our news through the People Plus Press website at www.peoplepress.com , our mobile app available for iOS and Android, and our e-paper edition. 
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    {/* end of panel */}
                                    <div className="panel">
                                        <div className="panel-heading" role="tab" id="headingThree">
                                            <h4 className="panel-title" style={{ fontSize: "18px",fontFamily: "Montserrat, sans-serif",color:"#2b2121", textAlign: "justify" }}>
                                                <a
                                                    className="collapsed"
                                                    role="button"
                                                    data-bs-toggle="collapse"
                                                    data-parent="#accordion"
                                                    href="#collapseThree"
                                                    aria-controls="collapseThree"
                                                >
                                                3. Is there a subscription fee to access People Plus Press? </a>
                                            </h4>
                                        </div>
                                        <div
                                            id="collapseThree"
                                            className="panel-collapse collapse"
                                            role="tabpanel"
                                            aria-labelledby="headingThree"
                                        >
                                            <div className="panel-body">
                                                <p style={{ fontSize: "16px",fontFamily: "Montserrat, sans-serif",color:"#2b2121", textAlign: "justify" }}>
                                                Currently, People Plus Press offers free access to most of our news articles. We may introduce premium content or subscription plans in the future to enhance your news experience. 
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    {/* end of panel */}
                                    <div className="panel">
                                        <div className="panel-heading" role="tab" id="headingFour">
                                            <h4 className="panel-title" style={{ fontSize: "18px",fontFamily: "Montserrat, sans-serif",color:"#2b2121", textAlign: "justify" }}>
                                                <a
                                                    className="collapsed"
                                                    role="button"
                                                    data-bs-toggle="collapse"
                                                    data-parent="#accordion"
                                                    href="#collapseFour"
                                                    aria-controls="collapseFour"
                                                >
                                                4. How do I advertise on People Plus Press? </a>
                                            </h4>
                                        </div>
                                        <div
                                            id="collapseFour"
                                            className="panel-collapse collapse"
                                            role="tabpanel"
                                            aria-labelledby="headingFour"
                                        >
                                            <div className="panel-body">
                                                <p style={{ fontSize: "16px",fontFamily: "Montserrat, sans-serif",color:"#2b2121", textAlign: "justify" }}>
                                                For advertising opportunities, please visit our &quot;Advertise with Us&quot; page or contact our advertising department at advertising@peoplepluspress.com  
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    {/* end of panel */}
                                    <div className="panel">
                                        <div className="panel-heading" role="tab" id="headingFive">
                                            <h4 className="panel-title" style={{ fontSize: "18px",fontFamily: "Montserrat, sans-serif",color:"#2b2121", textAlign: "justify" }}>
                                                <a
                                                    className="collapsed"
                                                    role="button"
                                                    data-bs-toggle="collapse"
                                                    data-parent="#accordion"
                                                    href="#collapseFive"
                                                    aria-controls="collapseFive"
                                                >
                                                   5.How can I contact People Plus Press? 
                                                </a>
                                            </h4>
                                        </div>
                                        <div
                                            id="collapseFive"
                                            className="panel-collapse collapse"
                                            role="tabpanel"
                                            aria-labelledby="headingFive"
                                        >
                                            <div className="panel-body">
                                                <p style={{ fontSize: "16px",fontFamily: "Montserrat, sans-serif",color:"#2b2121", textAlign: "justify" }}>
                                                For general inquiries, feedback, or suggestions, reach out to us at 
                                         info@peoplepluspress.com. 
                                        For specific departments, please refer to the contact information provided above. </p>
                                            </div>
                                        </div>
                                    </div>
                                    {/* end of panel */}
                                    <div className="panel">
                                        <div className="panel-heading" role="tab" id="headingSix">
                                            <h4 className="panel-title" style={{ fontSize: "18px",fontFamily: "Montserrat, sans-serif",color:"#2b2121", textAlign: "justify" }}>
                                                <a
                                                    className="collapsed"
                                                    role="button"
                                                    data-bs-toggle="collapse"
                                                    data-parent="#accordion"
                                                    href="#collapseSix"
                                                    aria-controls="collapseSix"
                                                >
                                                    6.How do I subscribe to People Plus Press newsletters?  
                                                </a>
                                            </h4>
                                        </div>
                                        <div
                                            id="collapseSix"
                                            className="panel-collapse collapse"
                                            role="tabpanel"
                                            aria-labelledby="headingSix"
                                        >
                                            <div className="panel-body">
                                                <p style={{ fontSize: "16px",fontFamily: "Montserrat, sans-serif",color:"#2b2121", textAlign: "justify" }}>
                                                To subscribe to our newsletters, visit our &quot;Subscribe&quot; page and enter your email address. You&apos;ll receive daily updates, breaking news, and exclusive content directly to your inbox. 
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="panel">
                                        <div className="panel-heading" role="tab" id="headingSeven">
                                            <h4 className="panel-title" style={{ fontSize: "18px",fontFamily: "Montserrat, sans-serif",color:"#2b2121", textAlign: "justify" }}>
                                                <a
                                                    className="collapsed"
                                                    role="button"
                                                    data-bs-toggle="collapse"
                                                    data-parent="#accordion"
                                                    href="#collapseSeven"
                                                    aria-controls="collapseSeven"
                                                >
                                                7. Does People Plus Press have a mobile app?</a>
                                            </h4>
                                        </div>
                                        <div
                                            id="collapseSeven"
                                            className="panel-collapse collapse"
                                            role="tabpanel"
                                            aria-labelledby="headingSeven"
                                        >
                                            <div className="panel-body">
                                                <p style={{ fontSize: "16px",fontFamily: "Montserrat, sans-serif",color:"#2b2121", textAlign: "justify" }}>
                                                Yes, People Plus Press offers a mobile app available for both iOS and Android devices. Download it from the App Store or Google Play Store to access news on the go.                                                 </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="panel">
                                        <div className="panel-heading" role="tab" id="headingEight">
                                            <h4 className="panel-title" style={{ fontSize: "18px",fontFamily: "Montserrat, sans-serif",color:"#2b2121", textAlign: "justify" }}>
                                                <a
                                                    className="collapsed"
                                                    role="button"
                                                    data-bs-toggle="collapse"
                                                    data-parent="#accordion"
                                                    href="#collapseEight"
                                                    aria-controls="collapseEight"
                                                >
                                                8. How can I get the People Plus Press mobile app?</a>
                                            </h4>
                                        </div>
                                        <div
                                            id="collapseEight"
                                            className="panel-collapse collapse"
                                            role="tabpanel"
                                            aria-labelledby="headingEight"
                                        >
                                            <div className="panel-body">
                                                <p style={{ fontSize: "16px",fontFamily: "Montserrat, sans-serif",color:"#2b2121", textAlign: "justify" }}>
                                                The People Plus Press mobile app is available for download on both iOS and Android platforms. Visit the App Store or Google Play Store and search for &quot;People Plus Press&quot; to download the app.                                                 </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="panel">
                                        <div className="panel-heading" role="tab" id="headingNine">
                                            <h4 className="panel-title" style={{ fontSize: "18px",fontFamily: "Montserrat, sans-serif",color:"#2b2121", textAlign: "justify" }} >
                                                <a
                                                    className="collapsed"
                                                    role="button"
                                                    data-bs-toggle="collapse"
                                                    data-parent="#accordion"
                                                    href="#collapseNine"
                                                    aria-controls="collapseNine"
                                                >
                                                    9.How does People Plus Press ensure the credibility of its news?   
                                                </a>
                                            </h4>
                                        </div>
                                        <div
                                            id="collapseNine"
                                            className="panel-collapse collapse"
                                            role="tabpanel"
                                            aria-labelledby="headingNine"
                                        >
                                            <div className="panel-body">
                                                <p style={{ fontSize: "16px",fontFamily: "Montserrat, sans-serif",color:"#2b2121", textAlign: "justify" }}>
                                                We have a team of experienced journalists and correspondents who adhere to strict journalistic standards and ethics. We fact-check all our stories and maintain editorial independence to provide accurate and unbiased news.                                                 </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="panel">
                                        <div className="panel-heading" role="tab" id="headingTen">
                                            <h4 className="panel-title" style={{ fontSize: "18px",fontFamily: "Montserrat, sans-serif",color:"#2b2121", textAlign: "justify" }}>
                                                <a
                                                    className="collapsed"
                                                    role="button"
                                                    data-bs-toggle="collapse"
                                                    data-parent="#accordion"
                                                    href="#collapseTen"
                                                    aria-controls="collapseTen"
                                                >
                                            10.What should I do if I find an error in one of your articles?</a>
                                            </h4>
                                        </div>
                                        <div
                                            id="collapseTen"
                                            className="panel-collapse collapse"
                                            role="tabpanel"
                                            aria-labelledby="headingTen"
                                        >
                                            <div className="panel-body">
                                                <p style={{ fontSize: "16px",fontFamily: "Montserrat, sans-serif",color:"#2b2121", textAlign: "justify" }}>
                                                If you spot an error, please let us know by emailing (****) We take accuracy seriously and will correct any mistakes as soon as possible.                                                 </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
           </div>
            {/* *** END OF /. PAGE MAIN CONTENT *** */}


        </Layout>
    );
};

export default Page;