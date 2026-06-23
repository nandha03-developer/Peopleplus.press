import type { Metadata } from 'next';

export async function generateMetadata({ params }: any): Promise<Metadata> {
  const subgroupdetail = (await params).subgroupdetail

  try {
    const groupResponse = await fetch(`https://s1jota6yr2.execute-api.ap-south-1.amazonaws.com/default/List_api_tables?table_name=News&url_contains=${subgroupdetail}`);

    const groupData: any = await groupResponse.json();
    const newsData: any = groupData.Data.find((post: any) => post.url === subgroupdetail);

    const imageResponse = await fetch(`https://od71gzxpvb.execute-api.ap-south-1.amazonaws.com/default/ogimage?id=${newsData.id}`);
    const imageData = await imageResponse.text();

    const imageUrl = newsData.images;
    if (!imageUrl) {
      throw new Error('Image URL not found');
    }

    const imagesArray = newsData.mainimages
      ? newsData.mainimages.split(",").map((img: any) => img.trim())
      : [];
    const ogImage = imagesArray.length > 0 ? imagesArray[0] : null;

    return {
      title: newsData.title,
      description: newsData.shortcontent,
      keywords: newsData.tags,
      openGraph: {
        title: newsData.title,
        description: newsData.shortcontent,
        images: [{ url: ogImage }],
      },
    };
  } catch (error) {
    console.error("Failed to fetch data", error);
    return {
      title: "People Plus - Latest News and Insights on Global Trends",
      description: "Stay updated with People Plus on the latest global news, insights, and trends in technology, business, and culture. Your go-to source for in-depth analysis and expert opinions.",
      openGraph: {
        title: "People Plus - Latest News and Insights on Global Trends",
        description: "Stay updated with People Plus on the latest global news, insights, and trends in technology, business, and culture. Your go-to source for in-depth analysis and expert opinions.",
        images: [{ url: "https://peoplepluspress.s3.amazonaws.com/image/string/pppp.jpg" }],
      },
    };
  }
}

export default async function Layout({ children, params }: any) {
  const subgroupdetail = (await params).subgroupdetail
  const groupResponse = await fetch(
    `https://s1jota6yr2.execute-api.ap-south-1.amazonaws.com/default/List_api_tables?table_name=News&url_contains=${subgroupdetail}`
  );

  const groupData: any = await groupResponse.json();
  const newsData: any = groupData.Data.find((post: any) => post.url === subgroupdetail);
  const ogImage = newsData?.mainimages ? newsData.mainimages.split(',')[0].trim() : null;

  return <>
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "NewsArticle",
          "headline": newsData?.title,
          "datePublished": newsData?.newsdatetime,
          "dateModified": newsData?.newsdatetime || newsData?.newsdatetime,
          "author": {
            "@type": "Person",
            "name": newsData?.reporter
          },
          "publisher": {
            "@type": "Organization",
            "name": "People Plus",
            "logo": {
              "@type": "ImageObject",
              "url": "https://peoplepluspress.s3.amazonaws.com/image/string/pppp.jpg",
              "width": 600,
              "height": 60
            }
          },
          "image": ogImage,
          "description": newsData?.shortcontent
        }),
      }}
    /> <div>{children}</div>;</>
}