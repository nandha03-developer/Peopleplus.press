import type { Metadata, ResolvingMetadata } from 'next';
import { ReactNode } from 'react';

export async function generateMetadata({ params }: any): Promise<Metadata> {
 // const { innergroup }: any = params;
  const innergroup = (await params).innergroup
 
  try {
    const groupResponse = await fetch(`https://s1jota6yr2.execute-api.ap-south-1.amazonaws.com/default/List_api_tables?table_name=InnerSubGroup&innersubgroupname_contains=${innergroup}`);
    const groupData: any = await groupResponse.json();
    const groups = groupData.Data[0]
    
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