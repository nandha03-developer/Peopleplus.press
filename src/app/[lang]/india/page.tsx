import IndiaCountry from './indiaCountry';

export const metadata = {
  title: 'PeoplePlus - Latest Indian News, Politics, and Business Trends',
  description: 'Stay updated with PeoplePlus Press on the latest Indian news, politics, business trends, and insights. Explore in-depth articles and analysis.',
  openGraph: {
    title: 'PeoplePlus - Latest Indian News, Politics, and Business Trends',
  description: 'Stay updated with PeoplePlus Press on the latest Indian news, politics, business trends, and insights. Explore in-depth articles and analysis.',
    images: [{ url: "https://peoplepluspress.s3.amazonaws.com/image/string/pppp.jpg"}],
  },
};

export default function UnionPage() {
  return (
    <div>
      <IndiaCountry />
    </div>
  );
}
