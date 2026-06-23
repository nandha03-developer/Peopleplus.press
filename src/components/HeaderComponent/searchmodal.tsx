import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { Autocomplete, CircularProgress } from '@mui/material';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import { GroupSubGroupContext } from '@/context/allGroupContext';
import { useRouter } from "next/navigation";
import { useLanguage } from '@/context/languageContext';

function Searchmodal() {
  const { langCode } = useLanguage();
  const [isModalOpen, setModalOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [trending, setTrending] = useState<any[]>([]);
  const [searchValue, setSearchValue] = useState(""); // Search value
  const { allGroups, allsubGroups, allInnerSubGroups, setCurrentNews, location } = useContext(GroupSubGroupContext);
  const [dloading, setdLoading] = useState(false);
  const [data, setData] = useState([]); // to store the filtered data to display in options
  const [error, setError] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [popular, setPopular] = useState<any[]>([]);
  const [searchInput, setSearchInput] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const openModal = () => setModalOpen(true);
  const closeModal = () => setModalOpen(false);

  // Fetch trending news 
  useEffect(() => {
    const fetchTrendingNews = async () => {
      try {
        const search = await axios.get('/List_api_tables?table_name=Search_Index');
        const searchedValue = search.data.Data;
        setSearchInput(searchedValue);

        const respontrend = await axios.get('/List_api_tables?table_name=Search_Index&limit=5');
        const trendingNews = respontrend.data.Data;
        setTrending(trendingNews);

        const responpopular = await axios.get('/List_api_tables?table_name=Search_Index&sort_by=Count&order=desc&limit=5');
        const popularNews = responpopular.data.Data;
        setPopular(popularNews);

      } catch (error) {
        console.error('Error fetching trending news:', error);
      }
    };

    if (isModalOpen) {
      fetchTrendingNews();
    }
  }, [isModalOpen]);

  const searchOnChange = async (e: any) => {
    const newSearchValue = e.target.value;
    setSearchValue(newSearchValue);
    if (newSearchValue.trim() === "") {
      setData([]);
      return;
    }
    setdLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `/List_api_tables?table_name=News&Searchparms=${newSearchValue}&limit=800&language_contains=0`
      );
      const result = await response.json();
      setData(result.Data || []);
    } catch (error) {
      console.error("Error fetching data:", error);
      setError("Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };

  // Handle input change for autocomplete
  const handleInputChange = (event: any, value: any) => {
    setSearchValue(value);
    // if (value) {
    //   // Here you can implement your search logic
    // }
  };

  const handleOptionSelect = (event: any, value: any) => {
    let grname = allGroups.find((group: any) => group.uid == value.groupid).groupname.trim().toLowerCase().replace(/\s+/g, '-') || '';
    let subgrname = allsubGroups.find((group: any) => group.uid == value.subgroupid).subgroupname.trim().toLowerCase().replace(/\s+/g, '-') || '';
    let innersubgrpname = allInnerSubGroups.find((group: any) => group.uid == value.innersubgroupid)?.innersubgroupname.trim().toLowerCase().replace(/\s+/g, '-') || ''
    // Check for groupid = 23
    if (value.groupid === 23) {
      // Find state and city names from locationData
      const matchedState = location.find((loc: any) => loc.state_id === value.stateid);
      const matchedCity = location.find((loc: any) => loc.city_id === value.cityid);

      const stateName = matchedState
        ? matchedState.state_name.toLowerCase().replace(/\s+/g, '-')
        : '';
      const cityName = matchedCity
        ? matchedCity.city_name.toLowerCase().replace(/\s+/g, '-')
        : '';
      router.push(`/${langCode}/india/${stateName}/${cityName}/${value.url}`);
    }
    else {
      router.push(`/${langCode}/${grname}/${subgrname}/details/${value.url}`);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Enter") {
      submitSearch(searchValue); // Call submitSearch when Enter is pressed
    }
  };

  const handleSearchIconClick = (value: any) => {
    submitSearch(searchValue); // Call submitSearch when the search icon is clicked
  };

  const submitSearch = async (searchValue: any) => {
    setIsLoading(true);
    try {
      const exists = searchInput.find((item: any) => item.s_name == String(searchValue));
      const body = {
        s_name: String(searchValue),
        created_date: new Date(),
      };
      if (exists) {
        const response = await axios.post(`/searchCount?s_name=${searchValue}`, {
          headers: {
            "Content-Type": "application/json",
          },
        });
      } else {
        const response = await axios.post('/api/search_index', body, {
          headers: {
            'Content-Type': 'application/json',
          },
        });
        setSearchInput(prevState => [...prevState, { s_name: searchValue }]);
      }
      router.push(`/${langCode}/search/${searchValue.replace(/\s+/g, '-').toLowerCase()}`)
    } catch (error) {
      console.error("Error", error)
    } finally {
      setIsLoading(false)
    }
  }

  const [mobileScreen, setMobileScreen] = useState(false);
  window.addEventListener('resize', function () {
    const mobile = window.innerWidth <= 768;
    setMobileScreen(mobile)
  });

  return (
    <>
      <button type="button" className="d-sm-block" onClick={openModal}
        style={{ background: "none", border: "none", padding: 0, cursor: "pointer", marginRight: "10px", }}>
        <i className="fa fa-search" aria-hidden="true" style={{ color: "black" }} />
      </button>

      {isModalOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000,
        }}>
          <div style={{
            border: '1px solid #ccc',
            padding: '40px',
            borderRadius: '10px',
            boxShadow: '0 8px 20px rgba(0, 0, 0, 0.3)', // More pronounced shadow for depth
            width: mobileScreen ? '100%' : '80%',
            height: mobileScreen ? "100%" : '70%',
            overflowY: 'hidden', // Allow vertical scrolling if content exceeds the visible area
            backgroundColor: 'white',
            transform: 'translateY(-20px)', // Moves the card upward
            fontSize: mobileScreen ? "10px" : '16px',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', marginTop: '-20px' }}>
              <button
                onClick={closeModal}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                style={{
                  cursor: 'pointer',
                  border: 'none',
                  backgroundColor: 'transparent',
                  fontSize: '22px',
                  marginRight: 'auto',
                  outline: 'none',
                  transition: 'transform 0.3s', // Adding transition for scale effect
                }}
              >
                <i
                  className="fa-regular fa-circle-xmark"
                  style={{
                    color: isHovered ? '#eb0254' : 'black',
                    transition: 'color 0.3s, transform 0.3s', // Adding color transition
                    transform: isHovered ? 'scale(1.2)' : 'scale(1)' // Scaling effect on hover
                  }}
                />
              </button>
            </div>

            <h2 style={{ margin: '0 0 20px 0', textAlign: 'center', flex: 1 }}>Search News</h2>
            <Autocomplete
              disablePortal
              options={data}
              loading={dloading}
              getOptionLabel={(option: any) => option.title || ""}
              onInputChange={handleInputChange}
              onChange={handleOptionSelect}
              PaperComponent={(props) => (
                <Paper
                  {...props}
                  style={{ zIndex: 1000, position: "absolute", top: "220px", width: "100%" }}
                />
              )}
              renderInput={(params) => (
                <TextField
                  onChange={searchOnChange}
                  {...params}
                  label="Search"
                  variant="outlined"
                  onKeyDown={handleKeyDown}
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton type="submit" aria-label="search" edge="end" onClick={handleSearchIconClick}>
                          {isLoading ? (
                            <CircularProgress size={24} /> // Show loading spinner when loading
                          ) : (
                            <i className="ti ti-search fullscreen-search-icon" /> // Show search icon when not loading
                          )}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              )}
            />

            {/* Trending News */}
            <div style={{ marginTop: '20px' }}>
              <h4>Top Trends</h4>
              <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                {trending.map((trend) => (
                  <span onClick={() => router.push(`/${langCode}/search/${trend.s_name.replace(/\s+/g, '-').toLowerCase()}`)}
                    key={trend.id}
                    style={{
                      margin: '5px',
                      padding: '5px 10px',
                      border: '1px solid #ccc',
                      borderRadius: '15px',
                      cursor: 'pointer',
                      transition: 'background-color 0.3s, color 0.3s', // Transition for smooth effect
                      backgroundColor: 'transparent', // Default background color
                      color: 'black', // Default text color
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#eb0254'; // Change background color on hover
                      e.currentTarget.style.color = 'white'; // Change text color to white on hover
                      e.currentTarget.style.border = 'none'; // Add border on hover
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent'; // Reset background color on leave
                      e.currentTarget.style.color = 'black'; // Reset text color on leave
                      e.currentTarget.style.border = '1px solid #ccc'; // Remove border on leave
                    }}
                  >
                    {trend.s_name}
                  </span>
                ))}
              </div>
            </div>

            <div style={{ marginTop: '20px' }}>
              <h4>Popular Keywords</h4>
              <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                {popular.map((popu) => (
                  <span onClick={() => router.push(`/${langCode}/search/${popu.s_name.replace(/\s+/g, '-').toLowerCase()}`)}
                    key={popu.id}
                    style={{
                      margin: '5px',
                      padding: '5px 10px',
                      border: '1px solid #ccc',
                      borderRadius: '15px',
                      cursor: 'pointer',
                      transition: 'background-color 0.3s, color 0.3s', // Include color transition
                      backgroundColor: 'transparent', // Default background color
                      color: 'black', // Default text color
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#eb0254'; // Set background color on hover
                      e.currentTarget.style.color = 'white'; // Set text color to white on hover
                      e.currentTarget.style.border = 'none'; // Add border on hover
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent'; // Reset background color on leave
                      e.currentTarget.style.color = 'black'; // Reset text color on leave
                      e.currentTarget.style.border = '1px solid #ccc'; // Remove border on leave
                    }}
                  >
                    {popu.s_name}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Searchmodal;
