import React, { useEffect, useState } from "react";
import styled from "styled-components";
import newRequest from "../utils/newRequest";

const Container = styled.div`
  display: flex;
  gap: 10px;
  margin: 30px 0px;
  position:relative;
`;

const Avatar = styled.img`
  width: 50px;
  height: 50px;
  border-radius: 50%;
`;

const Details = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  color: ${({ theme }) => theme.text}
`;
const Name = styled.span`
  font-size: 13px;
  font-weight: 500;
`;

const Date = styled.span`
  font-size: 12px;
  font-weight: 400;
  color: ${({ theme }) => theme.textSoft};
  margin-left: 5px;
`;

const Text = styled.span`
  font-size: 14px;
`;

const Delete = styled.span`
  display: flex;
  position: absolute;
  right:0;
  color: ${({ theme }) => theme.text}
`


const Comment = ({ comment, uid }) => {
  // 评论人的comment
  const [channel, setChannel] = useState({});
  const [video, setVideo] = useState({})
  useEffect(() => {
    const fetchComment = async () => {
      const res = await newRequest.get(`/users/find/${comment.userId}`);
      const vinfo = await newRequest.get(`/videos/find/${comment.videoId}`);
      setChannel(res.data)
      setVideo(vinfo.data)
    };
    fetchComment();
  }, [comment.userId, comment.videoId]);
  // 代码没问题，可能是连接数据库太慢了
  return (
    <Container>
      <Avatar src={channel.img} />
      <Details>
        <Name>
          {channel.name} <Date>1 day ago</Date>
        </Name>
        <Text>
          {comment.desc}
        </Text>
      </Details>
      {uid === comment.userId || uid === video.userId ?
        (<Delete>X</Delete>) : (<></>)
      }
    </Container>
  );
};

export default Comment;
