import About from './about';

export const metadata = {
  title: 'About Us - PeoplePlus | Indian News, Trends, and Insights',
  description: 'Stay informed with PeoplePlus Press for the latest Indian news, trends, and insights in politics, business, and technology. ',
  openGraph: {
    title: "About Us - PeoplePlus | Indian News, Trends, and Insights",
    description: "Stay informed with PeoplePlus Press for the latest Indian news, trends, and insights in politics, business, and technology.",
    images: [{ url: "https://peoplepluspress.s3.amazonaws.com/image/string/pppp.jpg"}],
  },
};

export default function AboutPage() {
  return (
    <div>
      <About />
    </div>
  );
}
