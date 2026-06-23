import Contact from './contact';

export const metadata = {
  title: 'Contact Us - People Plus Press | Reach Out Today',
  description: ' Get in touch with People Plus Press for inquiries, feedback, or support. We’re here to help and answer your questions. Contact us today!',
  openGraph: {
    title: "Contact Us - People Plus Press | Reach Out Today",
    description: " Get in touch with People Plus Press for inquiries, feedback, or support. We’re here to help and answer your questions. Contact us today!",
    images: [{ url: "https://peoplepluspress.s3.amazonaws.com/image/string/pppp.jpg"}],
  },
};

export default function AboutPage() {
  return (
    <div>
      <Contact />
    </div>
  );
}
