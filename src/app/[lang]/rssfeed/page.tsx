import Rssfeed from './rssfeed';

export const metadata = {
  title: 'PeoplePlus - Rss Feed for Website Use and Services',
  description: 'Review the rss feed for using PeoplePlus.',
  openGraph: {
    title: 'PeoplePlus - Rss Feed for Website Use and Services',
  description: 'Review the rss feed for using PeoplePlus.',
    images: [{ url: "https://peoplepluspress.s3.amazonaws.com/image/string/pppp.jpg"}],
  },
};

export default function AboutPage() {
  return (
    <div>
      <Rssfeed />
    </div>
  );
}
