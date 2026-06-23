import MetroCities from './metrocities';

export const metadata = {
  title: 'Metro Cities in India - News, Trends & Insights | People Plus Press',
  description: 'Explore the latest news and trends in India\'s metro cities. Stay updated with insights on urban development and lifestyle at People Plus Press.',
  openGraph: {
    title: 'Metro Cities in India - News, Trends & Insights | People Plus Press',
  description: 'Explore the latest news and trends in India\'s metro cities. Stay updated with insights on urban development and lifestyle at People Plus Press.',
    images: [{ url: "https://peoplepluspress.s3.amazonaws.com/image/string/pppp.jpg"}],
  },
};

export default function MetroPage() {
  return (
    <div>
      <MetroCities />
    </div>
  );
}
