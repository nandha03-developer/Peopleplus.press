import React, { useState } from 'react';
import { useLanguage } from "@/context/languageContext";

const Tags: React.FC = () => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const { langCode } = useLanguage();

  const tagList = [
    { name: 'Cricket', link:`/${langCode}/sports/cricket` },
    { name: 'Education', link: `/${langCode}/education` },
    { name: 'Technology', link: `/${langCode}/technology` },
    { name: 'Travel', link: `/${langCode}/travel` },
    { name: 'Gadgets', link: `/${langCode}/technology/gadgets` },
    { name: 'Business', link: `/${langCode}/business` },
    { name: 'Culture', link: `/${langCode}/culture` },
    { name: 'Sports', link: `/${langCode}/sports` },
    { name: 'Politics', link: `/${langCode}/politics` },
    { name: 'Entertainment', link: `/${langCode}/entertainment` }
  ];

  const defaultStyle: React.CSSProperties = {
    transition: 'all 0.3s ease',
    padding: '0.5rem 1rem',
    border: '1px solid #e9ebed',
    textDecoration: 'none',
    color: '#000',
    borderRadius: '4px'
  };

  const hoverStyle: React.CSSProperties = {
    backgroundColor: '#eb0254',
    color: 'white',
    transform: 'scale(1.05)'
  };

  return (
    <div className="panel_inner mb-0">
      <div className="panel_header">
        <h4>
          <strong>Tags</strong>
        </h4>
      </div>
      <div className="panel_body">
        <div className="tags-inner d-flex flex-wrap gap-2">
          {tagList.map((tag, index) => (
            <a
              key={index}
              href={tag.link}
              style={{
                ...defaultStyle,
                ...(hoveredIndex === index ? hoverStyle : {})
              }}
              onMouseOver={() => setHoveredIndex(index)}
              onMouseOut={() => setHoveredIndex(null)}
            >
              {tag.name}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Tags;
