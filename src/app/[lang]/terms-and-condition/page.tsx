import TermsAndConditions from './termsAndConditions';

export const metadata = {
  title: 'PeoplePlus - Terms and Conditions for Website Use and Services',
  description: 'Review the terms and conditions for using PeoplePlus. Learn about our policies, user rights, and responsibilities to ensure a safe experience.',
  openGraph: {
    title: 'PeoplePlus - Terms and Conditions for Website Use and Services',
  description: 'Review the terms and conditions for using PeoplePlus. Learn about our policies, user rights, and responsibilities to ensure a safe experience.',
    images: [{ url: "https://peoplepluspress.s3.amazonaws.com/image/string/pppp.jpg"}],
  },
};

export default function AboutPage() {
  return (
    <div>
      <TermsAndConditions />
    </div>
  );
}
