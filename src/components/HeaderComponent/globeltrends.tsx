import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useLanguage } from '@/context/languageContext';
import axios from 'axios';

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(10, 130px);
  margin-top: 20px;

  @media (max-width: 768px) {
    grid-template-columns: repeat(3, 1fr);
  }
`;

const Globeltrends = () => {
  const { langCode } = useLanguage();
  const [globeltrends, setGlobeltrends] = useState<any[]>([]);

  useEffect(() => {
    const fetchGlobeltrends = async () => {
      try {
        const { data } = await axios.get('/List_api_tables?table_name=Search_Index&limit=60');
        
        if (data && data.Data) {
          setGlobeltrends(data.Data);
        } else {
          console.error('No data found in the response.');
        }
      } catch (error) {
        console.error('Error fetching trending news:', error);
      }
    };

    fetchGlobeltrends();
    // Adding an empty dependency array ensures this effect runs only once
  }, []);

  return (
    <div style={{ 
      padding: '20px', 
      borderRadius: '10px', 
      backgroundColor: 'white', 
      width: '100%', 
      maxWidth: '1320px', 
      margin: '-25px auto 20px',
      border: '1px solid #e5e5e5',
    }}>
    <span style={{ fontWeight: 'bold', fontSize: '17px', color: "black" }}>
  Trends in Global
</span>
<hr style={{ margin: '5px 0', width: '100%', maxWidth: '100%' }} />


      <GridContainer>
        {globeltrends.map((item, index) => (
          <div key={index} style={{ display: 'flex', flexDirection: 'column' }}>
            <li
              style={{
                margin: 0,
                padding: '2px 0px',
                cursor: 'pointer',
                position: 'relative',
                display: 'inline-block',
                transition: 'color 0.3s ease',
              }}
              onMouseEnter={(e) => {
                const line = e.currentTarget.querySelector('.hover-line') as HTMLElement;
                if (line) {
                  line.style.transform = 'scaleX(0.4)';
                  e.currentTarget.style.color = '#eb0254';
                }
              }}
              onMouseLeave={(e) => {
                const line = e.currentTarget.querySelector('.hover-line') as HTMLElement;
                if (line) {
                  line.style.transform = 'scaleX(0)';
                  e.currentTarget.style.color = '';
                }
              }}
            >
              <a href={`/${langCode}/search/${item.s_name.toLowerCase().replace(/\s+/g, "-")}`}>
                {item.s_name.charAt(0).toUpperCase() + item.s_name.slice(1).toLowerCase()}
                <span
                  className="hover-line"
                  style={{
                    position: 'absolute',
                    left: 0,
                    bottom: 0,
                    height: '2px',
                    backgroundColor: '#eb0254',
                    transform: 'scaleX(0)',
                    transformOrigin: 'left',
                    transition: 'transform 0.3s ease',
                    width: '100%',
                  }}
                />
              </a>
            </li>
          </div>
        ))}
      </GridContainer>
    </div>
  );
}

export default Globeltrends;