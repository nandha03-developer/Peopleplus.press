import axios from 'axios';

export async function getPostsMeta(category: any, lang: any) {
    let langIndex;
    switch (lang) {
        case 'en':
            langIndex = 0;
            break;
        case 'ta':
            langIndex = 1;
            break;
        case 'hi':
            langIndex = 2;
            break;
        default:
            langIndex = 0;
    }

    // Calculate weekly dates 
    const today = new Date();
    const dayOfWeek = today.getDay(); // 0 (Sunday) to 6 (Saturday)
    const weekStart = new Date(today);
    weekStart.setDate(today.getDate() - dayOfWeek); // Go back to the most recent Sunday
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6); // Add 6 days to get to Saturday
    const formatDate = (date: any) => date.toISOString().split('T')[0];

    const startDate = formatDate(weekStart);
    const endDate = formatDate(weekEnd);

    // Fetch groups 
    const groupResponse = await fetch('https://s1jota6yr2.execute-api.ap-south-1.amazonaws.com/default/List_api_tables?table_name=Group&sort_by=displayorder&order=asc&status_eq=true');
    const groupData = await groupResponse.json();

    // Normalize category input
    const normalizedCategory = category.toLowerCase().replace(/-/g, " ");

    // Check for group match
    const groupObj = groupData.Data.find((item: any) => item.groupname.toLowerCase() === normalizedCategory);
    let groupPostsData = [];
    let subGroupPostsData = [];
    let subGroupObj = null;

    if (groupObj) {
        try {
            const response = await axios.get(
                `https://s1jota6yr2.execute-api.ap-south-1.amazonaws.com/default/List_api_tables?table_name=News&status_eq=true&groupid_eq=${groupObj.uid}&language_contains=${langIndex}&limit=25`
            );

            if (response && response.data) {
                groupPostsData = Array.isArray(response.data.Data) ? response.data.Data : [];
            }
        } catch (error) {
            console.error("Error fetching group posts:", error);
        }
    }

    // Check for subgroup match
    const subGroupResponse = await fetch(`https://s1jota6yr2.execute-api.ap-south-1.amazonaws.com/default/List_api_tables?table_name=SubGroup&sort_by=displayorder&order=asc&status_eq=true&subgroupname_contains=${normalizedCategory}`);
    const subGroupData = await subGroupResponse.json();

    subGroupObj = subGroupData.Data[0];

    if (subGroupObj) {
        try {
            const response = await axios.get(
                `https://s1jota6yr2.execute-api.ap-south-1.amazonaws.com/default/List_api_tables?table_name=News&status_eq=true&subgroupid_eq=${subGroupObj.uid}&language_contains=${langIndex}&limit=25`
            );

            if (response && response.data) {
                subGroupPostsData = Array.isArray(response.data.Data) ? response.data.Data : [];
            }

        } catch (error) {
            console.error("Error fetching subgroup posts:", error);
        }
    }


    let siteUrl = `https://www.peopleplus.press/${lang}`;
    if (subGroupObj) {
        if (subGroupObj.groupid === 23) {
            siteUrl = `https://www.peopleplus.press/${lang}/india/${category}`;
        } else {
            const grpName: any = groupData.Data.find((item: any) => item.uid == subGroupObj.groupid);
            const groupName = grpName.groupname.toLowerCase().replace(/ /g, '-');
            siteUrl = `https://www.peopleplus.press/${lang}/${groupName}/${category}`;
        }
    } else {
        siteUrl = `https://www.peopleplus.press/${lang}/${category}`;
    }
    
    return { group: groupObj, groupPosts: groupPostsData, subGroup: subGroupObj, subGroupPosts: subGroupPostsData, siteUrl: siteUrl };
}
