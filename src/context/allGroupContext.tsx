"use client"
import React, { createContext, useState, useEffect, ReactNode, useRef } from 'react';

interface GroupSubGroupContextType {
  allGroups: any;
  allsubGroups: any;
  allInnerSubGroups: any;
  currentNews: any;
  metroCities: any;
  location: any;
  allStates: any;
  allDistricts: any;
  setCurrentNews: React.Dispatch<React.SetStateAction<any>>;
  setAllGroups: React.Dispatch<React.SetStateAction<any>>;
  setAllSubGroups: React.Dispatch<React.SetStateAction<any>>;
  setMetroCities: React.Dispatch<React.SetStateAction<any>>;
  setLocation: React.Dispatch<React.SetStateAction<any>>;
  setAllInnerSubGroups: React.Dispatch<React.SetStateAction<any>>;
  setAllStates: React.Dispatch<React.SetStateAction<any>>;
  setAllDistricts: React.Dispatch<React.SetStateAction<any>>;
}

// Create a context with default values
const GroupSubGroupContext = createContext<GroupSubGroupContextType>({
  allGroups: [],
  allsubGroups: [],
  allInnerSubGroups: [],
  metroCities: [],
  location: [],
  allStates: [],
  allDistricts: [],
  currentNews: {},
  setCurrentNews: () => {},
  setAllGroups: () => {},
  setAllSubGroups: () => {},
  setMetroCities: () => {},
  setLocation: () => {},
  setAllInnerSubGroups: () => {},
  setAllStates: () => {},
  setAllDistricts: () => {},
});

// Create a provider component
const GroupSubGroupProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [allGroups, setAllGroups] = useState<any>([]);
  const [allsubGroups, setAllSubGroups] = useState<any>([]);
  const [allInnerSubGroups, setAllInnerSubGroups] = useState<any>([]);
  const [metroCities, setMetroCities] = useState<any>([]);
  const [location, setLocation] = useState<any>([]);
  const [allStates, setAllStates] = useState<any>([]);
  const [allDistricts, setAllDistricts] = useState<any>([]);
  const [currentNews, setCurrentNews] = useState<any>({});
  const allGroupRef = useRef(false);
  
  useEffect(() => {
    if (!allGroupRef.current) {
    const fetchData = async () => {
      try {
        const groupResponse = await fetch('/List_api_tables?table_name=Group&sort_by=displayorder&order=asc&status_eq=true');
        const groupData: any = await groupResponse.json();
        setAllGroups(groupData.Data);

        const subGroupResponse = await fetch('/List_api_tables?table_name=SubGroup&sort_by=displayorder&order=asc&status_eq=true');
        const subGroupData: any = await subGroupResponse.json();
        setAllSubGroups(subGroupData.Data);

        const innerSubGroupResponse = await fetch('/List_api_tables?table_name=InnerSubGroup&status_eq=true');
        const innerSubGroupData: any = await innerSubGroupResponse.json();
        setAllInnerSubGroups(innerSubGroupData.Data);

        const metroCityResponse = await fetch('/List_api_tables?table_name=location_view&metrocity_eq=true');
        const metroCityData: any = await metroCityResponse.json();
        setMetroCities(metroCityData.Data);

        const location = await fetch('/List_api_tables?table_name=location_view');
        const locationData: any = await location.json();
        setLocation(locationData.Data);

        const stateResponse = await fetch('/List_api_tables?table_name=State&sort_by=id&order=asc&status_eq=true');
        const stateData: any = await stateResponse.json();
        setAllStates(stateData.Data);

        const districtResponse = await fetch('/List_api_tables?table_name=District&sort_by=id&order=asc&status_eq=true');
        const districtData: any = await districtResponse.json();
        setAllDistricts(districtData.Data);

      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
    allGroupRef.current = true; // Set the flag to true after fetching
    }
  }, []);

  return (
    <GroupSubGroupContext.Provider value={{ allGroups, allsubGroups, setAllGroups, setAllSubGroups, allInnerSubGroups, setAllInnerSubGroups, metroCities, setMetroCities, currentNews, setCurrentNews, location, setLocation, allStates, setAllStates, allDistricts, setAllDistricts }}>
      {children}
    </GroupSubGroupContext.Provider>
  );
};

export { GroupSubGroupProvider, GroupSubGroupContext };