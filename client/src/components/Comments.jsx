import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Comment from "./Comment";
import newRequest from "../utils/newRequest.js";
import { useDispatch, useSelector } from "react-redux";
import { sendComment } from "../redux/commentSlice";

const Container = styled.div``;

const NewComment = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const Avatar = styled.img`
  width: 50px;
  height: 50px;
  border-radius: 50%;
`;

const Input = styled.input`
  border: none;
  border-bottom: 1px solid ${({ theme }) => theme.soft};
  color: ${({ theme }) => theme.text};
  background-color: transparent;
  outline: none;
  padding: 5px;
  width: 100%;
`;

const Comments = ({ videoId }) => {
  const { currentUser } = useSelector((state) => state.user);
  const [comments, setComments] = useState([]);
  const [post, setPost] = useState({})
  const dispatch = useDispatch();

  useEffect(() => {

    const fetchComments = async () => {
      try {
        const res = await newRequest.get(`/comments/${videoId}`);
        setComments(res.data);
      } catch (err) {
      }
    };
    fetchComments();
  }, [videoId, post]);


  const handleComment = async (e) => {
    if (e.key === 'Enter' && e.target.value.trim() !== '' && currentUser) {
      console.log(e, 'e');
      const res = await newRequest.post(`/comments`, {
        desc: e.target.value,
        userId: currentUser._id,
        videoId
      });
      const data = {
        userId: res.data.userId,
        videoId: res.data.videoId,
        desc: res.data.desc,
      }
      console.log(data, 'res');
      dispatch(sendComment(data));
      setPost(data);
      e.target.value = "";
    }
  }
  return (
    <Container>
      <NewComment>
        <Avatar src={currentUser && currentUser.img} />
        <Input placeholder="Enter to add a comment..." onKeyDown={handleComment} />
      </NewComment>
      {comments.map(comment => (
        <Comment key={comment._id} comment={comment} uid={currentUser ? currentUser._id : undefined} />
      ))}
    </Container>
  );
};

export default Comments;
