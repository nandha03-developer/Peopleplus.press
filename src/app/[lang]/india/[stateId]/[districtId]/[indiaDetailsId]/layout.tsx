import type { Metadata } from 'next';
import { ReactNode } from 'react';
 
 
// Function to fetch and generate metadata
export async function generateMetadata({ params }: any): Promise<Metadata> {
  //const { indiaDetailsId} = params;
  const indiaDetailsId = (await params).indiaDetailsId
  try {
    const groupResponse = await fetch(`https://s1jota6yr2.execute-api.ap-south-1.amazonaws.com/default/List_api_tables?table_name=News&url_contains=${indiaDetailsId}`);
   
    const groupData: any = await groupResponse.json();
    const newsData = groupData.Data.find((post: any) => post.url === indiaDetailsId);
   
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
      // openGraph: {
      //   images: [{ url: newsData.images}],
      // },
    };
  } catch (error) {
    console.error("Failed to fetch data", error);
    return {
      title: "People Plus - Latest News and Insights on Global Trends",
      description: "Stay updated with People Plus on the latest global news, insights, and trends in technology, business, and culture. Your go-to source for in-depth analysis and expert opinions.",
    };
  }
}
 
// Layout component
export default function Layout({ children }: any) {
  return <div>{children}</div>;
}