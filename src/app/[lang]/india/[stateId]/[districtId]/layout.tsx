import type { Metadata } from 'next';
import { ReactNode } from 'react';
 

const formatStateId = (districtId: string) => {
    return districtId
      .split('-') // Split the string by hyphens
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()) // Capitalize the first letter of each word and lowercase the rest
      .join(' '); // Join the words with spaces
  };
 
// Function to fetch and generate metadata
export async function generateMetadata({ params }: any): Promise<Metadata> {
  //const { districtId } = params;
  const districtId = (await params).districtId
  const formattedDistrict = formatStateId(districtId);
 
  try {
    const groupResponse = await fetch(`https://s1jota6yr2.execute-api.ap-south-1.amazonaws.com/default/List_api_tables?table_name=City`);
    const groupData: any = await groupResponse.json();
    const states = groupData.Data
    const groups = states.find((state: any) => state.city == formattedDistrict)

    return {
      title: groups.metatitle,
      description: groups.metadescription,
      keywords: groups.metakeyword,
      openGraph: {
        title: groups.metatitle,
        description: groups.metadescription,
        images: [{ url: "https://peoplepluspress.s3.amazonaws.com/image/string/pppp.jpg" }],
      },
    };
  } catch (error) {
    console.error("Failed to fetch data", error);
    return {
      title: "PeoplePlus - Latest Indian News, Trends, and Insights",
      description: "Get the latest Indian news, trends, and insights from PeoplePlus Press. Stay informed on politics, business, technology, and more.",
    };
  }
}
 
// Layout component
export default function Layout({ children }: any) {
  return <div>{children}</div>;
}