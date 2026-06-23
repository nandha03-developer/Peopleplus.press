import { Dialog } from "@mui/material";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import LoginModal from "./login-modal/login-modal";
import { toast } from "react-toastify";
import Image from "next/image";
import ReCAPTCHA from "react-google-recaptcha";
import DeleteIcon from '@mui/icons-material/Delete';

const CommentsForm = ({ newsItems }: any) => {
  const [commentMessage, setCommentMessage] = useState("");
  const [comments, setComments] = useState<any>([]);
  const [replyMessage, setReplyMessage] = useState(""); // For reply messages
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyCommentData, setReplyCommentData] = useState<any>([]);
  const [errorComment, setErrorComment] = useState("");
  const [errorReply, setErrorReply] = useState("");
  const [open, setOpen] = useState(false);
  const [capKey, setCapKey] = useState(null); // Google reCAPTCHA key
const [comentId, setComentId] = useState()
  const customerId: any = localStorage.getItem("cusId");
  const userId = JSON.parse(customerId);

  const handleMessageChange = (e: any) => {    //Comment OnChange
    setCommentMessage(e.target.value);
    setErrorComment("");
  };

  const hasFetched = useRef(false);   //Fetch Comments

  useEffect(() => {
    if (newsItems?.id && !hasFetched.current) {
      fetchComments(newsItems?.id);
      hasFetched.current = true; // Set to true after fetching
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [newsItems?.id]);

  const fetchComments = async (newsId: any) => {
    try {
      const response = await axios.get(
        `/List_api_tables?table_name=Comments&newsid_eq=${newsId}&sort_by=commentdatetime&order=desc&limit=3`
      );
      if (response.status === 200) {
        const commentsData = response.data.Data;
        const commentsWithCustomers = await Promise.all(
          commentsData.map(async (comment: any) => {
            const customerData = await fetchCustomerData(comment.customerid); // Fetch customer data
            return {
              ...comment,
              customer: customerData, // Add customer data to the comment
            };
          })
        );
        setComments(commentsWithCustomers);
        await Promise.all(
          commentsData.map((comment: any) => fetchReplyComments(comment.id))
        );
      }
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  };

  const fetchCustomerData = async (customerId: any) => {      // Function to fetch customer data by customer ID
    try {
      const response = await axios.get(
        `/List_api_tables?table_name=Customer&id_eq=${customerId}`
      );
      return response.data.Data[0]; // Return the first customer object
    } catch (error) {
      console.error("Error fetching customer data:", error);
      return null; // Return null if there's an error
    }
  };

  const handleClose = () => setOpen(false);

  const handleSubmitComment = async (e: any) => {     // Comment Submit
    e.preventDefault();
    // recaptchaRef.current?.execute();
    const customerId: any = localStorage.getItem("cusId");
    const userId = JSON.parse(customerId);
    if (!userId) {
      setOpen(true);
      return;
    }

    if (!commentMessage.trim()) {
      setErrorComment("Comment cannot be empty."); // Set the error message
      return; // Prevent submission
    } else {
      setErrorComment(""); // Clear error if validation passes
    }

    const currentDateTime = new Date().toISOString();

    const body = {
      comment: commentMessage,
      commentdatetime: currentDateTime,
      customerid: userId,
      newsid: newsItems?.id,
      status: true,
    };

    try {
      const response = await axios.post("/api/comments", body, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.status == 200) {
        toast.success("Data added successfully!");
        setCommentMessage("");
        fetchComments(newsItems?.id);
      } else {
        toast.error("Failed to add data.");
      }
    } catch (error: any) {
      console.error("Error adding data:", error);
      toast.error("Failed to add data.");
    }
  };

  const fetchReplyComments = async (commentId: any) => {
    // setComentId(commentId)
    const requestOptions: RequestInit = {
      method: "GET",
      redirect: "follow",
    };
    try {
      const response = await fetch(
        `/List_api_tables?table_name=CommentReply&commentid_eq=${commentId}&sort_by=dateandtime&order=desc&limit=3`,
        requestOptions
      );
      if (response.ok) {
        const result = await response.json(); // Assuming the response is JSON
        const repliesWithCustomers = await Promise.all(
          result.Data.map(async (reply: any) => {
            const customerData = await fetchCustomerData(reply.customerid); // Fetch customer data
            return {
              ...reply,
              customer: customerData, // Add customer data to the reply
            };
          })
        );
        setReplyCommentData((prevData: any) => ({
          ...prevData,
          [commentId]: repliesWithCustomers, // Store replies with customer data
        }));
        setComentId(commentId)
      } else {
        console.error("Error fetching replies:", response.statusText);
      }
    } catch (error) {
      console.error("Error fetching replies:", error);
    }
  };

  const handleReply = (commentId: any) => {   //Comment reply onchange
    setReplyingTo(commentId); // Set the comment ID we are replying to
  };

  const handleSubmitReply = async (e: any, commentId: any) => {     //Comment reply submit
   
    e.preventDefault();
    // recaptchaRef.current?.execute();
    const customerId: any = localStorage.getItem("cusId");
    const userId = JSON.parse(customerId);
    if (!userId) {
      setOpen(true);
      return;
    }
    if (!replyMessage.trim()) {
      setErrorReply("Comment cannot be empty."); // Set the error message
      return; // Prevent submission
    } else {
      setErrorReply(""); // Clear error if validation passes
    }
    const currentDateTime = new Date().toISOString();
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    const raw = JSON.stringify({
      commentid: commentId,
      commentmessage: replyMessage,
      customerid: userId,
      newsid: newsItems?.id,
      status: true,
      dateandtime: currentDateTime,
    });
    const requestOptions: RequestInit = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };
    try {
      const response = await fetch("/api/commentreply", requestOptions);
      if (response.ok) {
        toast.success("Reply submitted successfully!");
        setReplyMessage("");
        fetchReplyComments(commentId);
      } else {
        toast.error("Failed to submit reply."); // Optional: handle error response
      }
    } catch (error) {
      console.error(error);
      toast.error("An error occurred. Please try again."); // Optional: handle fetch error
    }
  };

  const handleDeleteComment = async (commentId: any) => {
    const response = await axios.delete(`/api/comments/${commentId}`, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (response.status === 200) {
      toast.success("Comment deleted successfully!");
      fetchComments(newsItems?.id);
    }
  }

  const handleDeleteCommentReply = async (commentReplyId: any, comentId: any) => {
    const response = await axios.delete(`/api/commentreply/${commentReplyId}`, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (response.status === 200) {
      toast.success("Comment deleted successfully!");
      fetchReplyComments(comentId);
    }
  }

    return (
      <div>
        {/* START COMMENT */}
        <div className="comments-container">
          {/* <h3 style={{ textAlign: 'center' }}>No Comments</h3> */}
          <ul className="comments-list">
            {Array.isArray(comments) && comments.length > 0 ? (
              comments.map((comment: any) => (
                <li key={comment.id}>
                  <div className="comment-main-level">
                    <div className="comment-avatar">
                      <Image
                        priority
                        // unoptimized={true}
                        quality={100}
                        objectFit="cover"
                        src={comment.customer.profileimage}
                        alt="profile image"
                        width={20}
                        height={20}
                      />
                      {/* <img src="assets/images/avatar-1.jpg" alt="" /> */}
                    </div>
                    <div className="comment-box">
                      <div className="comment-content">
                        <div className="comment-header">
                          <cite className="comment-author">
                            - {comment.customer.firstname}
                          </cite>
                          <time
                            dateTime={comment.commentdatetime}
                            className="comment-datetime"
                          >
                            {new Date(
                              comment.commentdatetime
                            ).toLocaleString()}
                          </time>
                          {userId == comment.customerid && (
                            <span onClick={() => handleDeleteComment(comment.id)}><DeleteIcon style={{fontSize: '16px', cursor: 'pointer', marginLeft:'5px'}} /></span>
                          )}
                        </div>
                        <p>{comment.comment}</p>
                        {userId !== comment.customerid && (
                          <button
                            onClick={() => handleReply(comment.id)}
                            className="btn btn-news"
                          >
                            Reply
                          </button>
                        )}
                      </div>
                      {/* Reply input field */}
                      {replyingTo === comment.id && (
                        <div className="reply-form comment-form">
                          <div className="form-group">
                            <div className="form-group">
                              <input
                                type="text"
                                className="form-control"
                                id={`reply-${comment.id}`}
                                value={replyMessage}
                                onChange={(e) =>
                                  setReplyMessage(e.target.value)
                                }
                                name="replyMessage"
                                placeholder=" Comment"
                                autoComplete="reply coment"
                                style={{
                                  textAlign: "left", // Keep text left-aligned for user input
                                  paddingLeft: "15px", // Add padding to the left to move placeholder text to the right
                                }}
                                onFocus={(e) => {
                                  e.target.placeholder =
                                    "Enter Your Name"; // Clear placeholder on focus
                                }}
                                onBlur={(e) => {
                                  e.target.placeholder =
                                    " Enter Your Name"; // Restore placeholder on blur
                                }}
                              />
                              {errorReply && (
                                <div className="text-danger">
                                  {errorReply}
                                </div>
                              )}
                            </div>
                            <button
                              className="btn btn-news"
                              onClick={(e) =>
                                handleSubmitReply(e, comment.id)
                              }
                            >
                              {""}
                              Submit Reply
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* If you want to show replies, you could add a nested comments list here */}
                  {replyCommentData[comment.id] &&
                    replyCommentData[comment.id].length > 0 && (
                      <ul className="comments-list reply-list">
                        {replyCommentData[comment.id]?.map(
                          (reply: any) => (
                            <li key={reply.id}>
                              {" "}
                              {/* Use a unique key from your reply object */}
                              <div className="comment-avatar">
                                <Image
                                  priority
                                  // unoptimized={true}
                                  quality={100}
                                  objectFit="cover"
                                  src={reply.customer.profileimage}
                                  alt="profile image"
                                  width={20}
                                  height={20}
                                />
                              </div>
                              <div className="comment-box">
                                <div className="comment-content">
                                  <div className="comment-header">
                                    <cite className="comment-author">
                                      - {reply.customer.firstname}{" "}
                                      {/* Assuming authorName is a field in your reply data */}
                                    </cite>
                                    <time
                                      dateTime={reply.dateandtime}
                                      className="comment-datetime"
                                    >
                                      {new Date(
                                        reply.dateandtime
                                      ).toLocaleString()}{" "}
                                      {/* Format date as needed */}
                                    </time>
                                    {userId == reply.customerid && (
                                      <span onClick={() => handleDeleteCommentReply(reply.id, comentId)}><DeleteIcon style={{fontSize: '16px', cursor: 'pointer', marginLeft:'5px'}} /></span>
                                    )}
                                    
                                  </div>
                                  <p>
                                    {reply.commentmessage}{" "}
                                    {/* Assuming commentMessage is a field in your reply data */}
                                  </p>
                                  {/* <Link href="#" className="btn btn-news">
                Reply
              </Link> */}
                                </div>
                              </div>
                            </li>
                          )
                        )}
                      </ul>
                    )}
                </li>
              ))
            ) : (
              <li>No comments available.</li> // Fallback message when no comments
            )}
          </ul>
        </div>
        {/* END OF /. COMMENT */}
        {/* START COMMENTS FORMS */}
        <form className="comment-form" action="#" method="post">
          <h3>
            <strong>Leave</strong> a Comment
          </h3>

          <div className="form-group">
            <label htmlFor="message">Comment*</label>
            <textarea
              className="form-control"
              id="message"
              name="message"
              placeholder="Your Comment ..."
              rows={5}
              // defaultValue={""}
              value={commentMessage}
              autoComplete="message"
              onChange={handleMessageChange}
              style={{
                textAlign: "left", // Keep text left-aligned for user input
                padding: "10px", // Add padding to move placeholder text to the right
              }}
              onFocus={(e) => {
                e.target.placeholder = "Your Comment"; // Clear placeholder on focus
              }}
              onBlur={(e) => {
                e.target.placeholder = "Your Comment"; // Restore placeholder on blur
              }}
            />
            {errorComment && (
              <div className="text-danger">{errorComment}</div>
            )}
          </div>

          <button
            onClick={handleSubmitComment}
            className="btn btn-news"
          >
            {" "}
            Submit
          </button>
          <ReCAPTCHA
            // ref={recaptchaRef}
            sitekey="6LdcJGMqAAAAAKlGl1L6Lp2Fb5PCrhW8oQ_w_Lwl"
            size="invisible"
            onChange={(value: any) => setCapKey(value)}
          />
        </form>
        {/* END OF /. COMMENTS FORMS */}
        <Dialog
          open={open}
          onClose={handleClose}
          PaperProps={{
            style: {
              width: "400px",
              height: "auto",
              borderRadius: "15px",
            },
          }}
        >
          <LoginModal onClose={handleClose} />
        </Dialog>
      </div>
    )
  }
  export default CommentsForm;