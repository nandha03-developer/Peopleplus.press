import React, { useState, useRef, useEffect } from 'react';
import {
  FacebookShareButton,
  TwitterShareButton,
  WhatsappShareButton,
  LinkedinShareButton,
  TelegramShareButton,
} from 'react-share';
import {
  FacebookIcon,
  TwitterIcon,
  WhatsappIcon,
  LinkedinIcon,
  TelegramIcon,
} from 'react-share';
import IconButton from '@mui/material/IconButton';
import Modal from '@mui/material/Modal';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import Button from '@mui/material/Button';
import ShareIcon from '@mui/icons-material/Share';
import CloseIcon from '@mui/icons-material/Close';
import axios from 'axios';

interface ShareButtonsModalProps {
  url: string;
  title: string;
  style: any;
}

const ShareButtonsModal: React.FC<ShareButtonsModalProps> = ({ url, title, style }: any) => {
  const [open, setOpen] = useState(false);
  const shareRef = useRef(null);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(url);
  };

  const [isHovered, setIsHovered] = useState<string | null>(null);

  const NewTwitterIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" width="43" height="43">
      <path d="M64 32C28.7 32 0 60.7 0 96V416c0 35.3 28.7 64 64 64H384c35.3 0 64-28.7 64-64V96c0-35.3-28.7-64-64-64H64zm297.1 84L257.3 234.6 379.4 396H283.8L209 298.1 123.3 396H75.8l111-126.9L69.7 116h98l67.7 89.5L313.6 116h47.5zM323.3 367.6L153.4 142.9H125.1L296.9 367.6h26.3z" />
    </svg>
  );

  const getHoverStyle = (platform: string): React.CSSProperties => ({
    transform: isHovered === platform ? 'scale(1.1)' : 'scale(1)',
  });
  
  const [sharedItems, setSharedItems] = useState<any[]>([]);

  useEffect(() => {
    const fetchSavedItems = async () => {
      const userId = localStorage.getItem('cusId');
      const user = userId ? userId : 0;
      try {
        const response = await axios.get(`/List_api_tables?table_name=Sharednews&userid_eq=${user}`);
        const fetchedItems = response.data.Data;  // Fetch all items for the current user
        setSharedItems(fetchedItems);  // Store the fetched shared items
      } catch (error) {
        console.error('Error fetching saved items:', error);
      }
    };

    fetchSavedItems();
  }, []);

  const handleShare = async () => {
    const userId = localStorage.getItem("cusId"); // Get the user ID from local storage
    const user = userId ? parseInt(userId) : 0;
    const slug = url.split('/').pop();  // Ensure url is defined

    try {
        const newsResponse = await axios.get(`/List_api_tables?table_name=News&url_contains=${slug}`);
        const newsData = newsResponse.data.Data[0];  // Ensure Data exists

        if (newsData) {
            // Find if the user has already shared any news
            const existingShare = sharedItems.find(item => item.userid === user); 
            if (existingShare) {
                let updatedNewsIds = existingShare.newsid.split(',');  
                
                // Check if the news ID already exists in the list
                if (!updatedNewsIds.includes(newsData.id.toString())) {
                    updatedNewsIds.push(newsData.id.toString());
                }
                
                const updatedBody = {
                    status: true,
                    userid: userId ? userId : 0,
                    newsid: updatedNewsIds.join(',')  // Join the updated list into a comma-separated string
                };

                // Update the shared news record
                await axios.put(`/api/sharednews/${existingShare.id}`, updatedBody);
            } else {
                // If the user hasn't shared any news yet, create a new share record
                const newBody = {
                    status: true,
                    userid: userId ? userId : 0,
                    newsid: newsData.id.toString()  // Store the new newsid as a string
                };

                const response = await axios.post("/api/sharednews", newBody, {
                  headers: {
                      "Content-Type": "application/json"
                  }
              });
              setSharedItems(prevItems => [
                ...prevItems,
                { ...newBody, id: response.data.id } // Assuming the API response includes the new ID
            ]);     
            }
        } else {
            console.error("No news data found for this slug");
        }
    } catch (err) {
        console.error("Error during share process:", err);
    }
};

  const modalStyle: React.CSSProperties = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '90%',
    maxWidth: '480px',
    minHeight: '380px',
    backgroundColor: '#fff',
    borderRadius: '8px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
    padding: '20px',
    textAlign: 'center',
    outline: 'none',
    zIndex: 9999, // Ensure modal is above other content
  };

  // Inline styles for background blur
  const backgroundBlurStyle: React.CSSProperties = {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
    backdropFilter: 'blur(5px)', // Apply blur effect
    zIndex: 9998, // Ensure the blur overlay is below the modal
  };

  return (
    <div ref={shareRef}>
      <IconButton onClick={handleOpen} aria-label="share">
        <ShareIcon style={style} />
      </IconButton>
      <Modal open={open} onClose={handleClose}>
        <div>
          {/* Background blur overlay */}
          <div style={backgroundBlurStyle} />
          <div style={modalStyle}>
            <div style={{ marginTop: "50px" }}>
              <div style={{ justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <IconButton
                  onClick={handleClose}
                  sx={{
                    padding: 0,
                    position: 'absolute',
                    top: '24px',
                    left: '24px',
                    fontSize: '24px',
                    transition: 'background-color 0.3s ease',
                    '&:hover': {
                      backgroundColor: 'rgba(0, 0, 0, 0.1)', // Change color on hover
                    },
                  }}
                >
                  <CloseIcon />
                </IconButton>
                <h2 style={{ position: 'relative', top: '-30px' }}>Share Now</h2>
                <hr style={{ width: '100%', margin: '0px auto', borderColor: 'gray', marginTop: "-20px" }} />
              </div>
              <div style={{ textAlign: 'center' }}>
                <p style={{ fontSize: '20px', color: 'black', marginBottom: '20px', textAlign: 'left' }}>
                  Share this link via
                </p>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '24px', margin: '25px 0', flexWrap: 'wrap' }}>
                  <FacebookShareButton onClick={() => handleShare()}
                    url={url}
                    title={title}
                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'transform 0.2s', outline: 'none', cursor: 'pointer', ...getHoverStyle('facebook') }}
                    onMouseEnter={() => setIsHovered('facebook')}
                    onMouseLeave={() => setIsHovered(null)}
                  >
                    <FacebookIcon size={43} round />
                  </FacebookShareButton>
                  <TwitterShareButton onClick={() => handleShare()}
                    url={url}
                    title={title}
                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'transform 0.2s', outline: 'none', cursor: 'pointer', ...getHoverStyle('twitter') }}
                    onMouseEnter={() => setIsHovered('twitter')}
                    onMouseLeave={() => setIsHovered(null)}
                  >
                    <NewTwitterIcon /> {/* Use the new Twitter icon here */}
                  </TwitterShareButton>
                  <WhatsappShareButton onClick={() => handleShare()}
                    url={url}
                    title={title}
                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'transform 0.2s', outline: 'none', cursor: 'pointer', ...getHoverStyle('whatsapp') }}
                    onMouseEnter={() => setIsHovered('whatsapp')}
                    onMouseLeave={() => setIsHovered(null)}
                  >
                    <WhatsappIcon size={43} round />
                  </WhatsappShareButton>
                  <LinkedinShareButton onClick={() => handleShare()}
                    url={url}
                    title={title}
                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'transform 0.2s', outline: 'none', cursor: 'pointer', ...getHoverStyle('linkedin') }}
                    onMouseEnter={() => setIsHovered('linkedin')}
                    onMouseLeave={() => setIsHovered(null)}
                  >
                    <LinkedinIcon size={43} round />
                  </LinkedinShareButton>
                  <TelegramShareButton onClick={() => handleShare()}
                    url={url}
                    title={title}
                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'transform 0.2s', outline: 'none', cursor: 'pointer', ...getHoverStyle('telegram') }}
                    onMouseEnter={() => setIsHovered('telegram')}
                    onMouseLeave={() => setIsHovered(null)}
                  >
                    <TelegramIcon size={43} round />
                  </TelegramShareButton>
                </div>
                <p style={{ fontSize: '20px', color: 'black', margin: '25px 0', textAlign: 'left' }}>
                  Or copy link
                </p>
                <div style={{ display: 'flex', alignItems: 'center', marginTop: '30px' }}>
                  <TextField
                    value={url}
                    InputProps={{
                      readOnly: true,
                      startAdornment: <ShareIcon style={{ color: '#666', marginRight: '8px' }} />,
                      endAdornment: (
                        <InputAdornment position="end">
                          <Button
                            onClick={handleCopyLink}
                            variant="contained"
                            color="primary"
                            style={{ borderRadius: '20px', textTransform: 'none', padding: '5px 15px', backgroundColor: '#eb0254' }}
                          >
                            Copy
                          </Button>
                        </InputAdornment>
                      ),
                    }}
                    variant="outlined"
                    size="small"
                    fullWidth
                    style={{ borderRadius: '8px', backgroundColor: '#fff' }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ShareButtonsModal;
