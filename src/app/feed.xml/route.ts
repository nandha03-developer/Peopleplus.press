import axios from "axios";
import RSS from "rss";
import { getPostsMeta } from "../lib/post";

export async function GET(request: any) {
    const url = new URL(request.url);
    const category = url.searchParams.get('rss');
    const lang = url.searchParams.get('lang');
    const { group, groupPosts, subGroup, subGroupPosts, siteUrl } = await getPostsMeta(category, lang);
    const allPosts = [...(groupPosts || []), ...(subGroupPosts || [])];
    const obj = group || subGroup;

    const feed = new RSS({
        title: obj.metatitle || "PeoplePlus - Latest Indian News, Trends, and Insights",
        description: obj.metadescription || "Get the latest Indian news, trends, and insights from PeoplePlus Press. Stay informed on politics, business, technology, and more.",
        feed_url: `https://www.peopleplus.press/en/feed.xml?lang=${lang}&rss=${category}`,
        site_url: siteUrl,
        image_url:'https://peoplepluspress.s3.amazonaws.com/image/string/pppp.jpg',
        copyright: 'Copyright © 2024 PeoplePlus Press [P] Ltd. All Rights Reserved',
        ttl: 60,
    });

    if (Array.isArray(allPosts) && allPosts.length > 0) {
        allPosts.forEach((post) => {

            feed.item({
                title: post.title || "PeoplePlus - Latest Indian News, Trends, and Insights",
                description: post.shortcontent || "Get the latest Indian news, trends, and insights from PeoplePlus Press. Stay informed on politics, business, technology, and more.",
                url: `${siteUrl}/${post.url}`, 
                // guid: {
                //     value: `${siteUrl}${post.url}`,  // Use the full URL as the unique identifier (guid)
                //     isPermaLink: true,  // Set to true if the URL is a permalink (default behavior)
                //   },
                categories: post.tags ? post.tags.split(",") : [], // Split tags into an array if they are comma-separated
                author: post.reporter,
                date: new Date(post.newsdatetime).toUTCString(), // Format the date appropriately
            });

        });
    } else {
        console.error("No valid posts found:", allPosts);
        return new Response("No posts found", { status: 404 });
    }

    return new Response(feed.xml({ indent: true }), {
        headers: {
            'Content-Type': 'application/xml; charset=utf-8',
        },
    });
}
