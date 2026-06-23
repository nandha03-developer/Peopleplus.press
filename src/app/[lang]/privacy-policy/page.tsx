import PrivacyPolicy from './privacyPolicy';

export const metadata = {
  title: 'Privacy Policy - People Plus Press | Data Protection & User Rights ',
  description: 'Learn how People Plus Press collects, uses, and protects your personal information. Read our privacy policy to understand your data rights.',
  openGraph: {
    title: 'Privacy Policy - People Plus Press | Data Protection & User Rights ',
  description: 'Learn how People Plus Press collects, uses, and protects your personal information. Read our privacy policy to understand your data rights.',
    images: [{ url: "https://peoplepluspress.s3.amazonaws.com/image/string/pppp.jpg"}],
  },
};

export default function AboutPage() {
  return (
    <div>
      <PrivacyPolicy />
    </div>
  );
}
