import React, { useEffect, useState } from "react";
import styled from "styled-components";
import ThumbUpOutlinedIcon from "@mui/icons-material/ThumbUpOutlined";
import ThumbDownOffAltOutlinedIcon from "@mui/icons-material/ThumbDownOffAltOutlined";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ThumbDownIcon from "@mui/icons-material/ThumbDown";
import ReplyOutlinedIcon from "@mui/icons-material/ReplyOutlined";
import AddTaskOutlinedIcon from "@mui/icons-material/AddTaskOutlined";
import Comments from "../components/Comments.jsx";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import newRequest from "../utils/newRequest";
import { dislike, fetchSuccess, like } from "../redux/videoSlice";
import { format } from "timeago.js";
import { subscription } from "../redux/userSlice";
import { Recommendation } from "../components/Recommendation.jsx";
import _ from 'lodash';

const Container = styled.div`
  display: flex;
  gap: 24px;
`;

const Content = styled.div`
  flex: 5;
`;
const VideoWrapper = styled.div``;

const Title = styled.h1`
  font-size: 18px;
  font-weight: 400;
  margin-top: 20px;
  margin-bottom: 10px;
  color: ${({ theme }) => theme.text};
`;

const Details = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Info = styled.span`
  color: ${({ theme }) => theme.textSoft};
`;

const Buttons = styled.div`
  display: flex;
  gap: 20px;
  color: ${({ theme }) => theme.text};
`;

const Button = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
  cursor: pointer;
`;

const Hr = styled.hr`
  margin: 15px 0px;
  border: 0.5px solid ${({ theme }) => theme.soft};
`;


const Channel = styled.div`
  display: flex;
  justify-content: space-between;
`;

const ChannelInfo = styled.div`
  display: flex;
  gap: 20px;
`;

const Image = styled.img`
  width: 50px;
  height: 50px;
  border-radius: 50%;
`;

const ChannelDetail = styled.div`
  display: flex;
  flex-direction: column;
  color: ${({ theme }) => theme.text};
`;

const ChannelName = styled.span`
  font-weight: 500;
`;

const ChannelCounter = styled.span`
  margin-top: 5px;
  margin-bottom: 20px;
  color: ${({ theme }) => theme.textSoft};
  font-size: 12px;
`;

const Description = styled.p`
  font-size: 14px;
`;

const Subscribe = styled.button`
  background-color: #cc1a00;
  font-weight: 500;
  color: white;
  border: none;
  border-radius: 3px;
  height: max-content;
  padding: 10px 20px;
  cursor: pointer;
`;

const VideoFrame = styled.video`
  max-height: 720px;
  width: 100%;
  object-fit: cover;
`;

const Video = () => {
  const { currentUser } = useSelector((state) => state.user);
  // const { currentVideo } = useSelector((state) => state.video);
  const dispatch = useDispatch();

  const path = useLocation().pathname.split("/")[2];
  const [channel, setChannel] = useState({});
  const [video, setVideo] = useState({});
  const [samepeople, setSamePeople] = useState(false);
  const debounce = _.debounce(async () => {
    try {
      await newRequest.put(`videos/view/${path}`);
    } catch (err) {
    }
  }, 500)

  useEffect(() => {
    // console.log(currentVideo, 'cv');
    const fetchData = async () => {
      try {
        const videoRes = await newRequest.get(`videos/find/${path}`);
        const channelRes = await newRequest.get(`/users/find/${videoRes.data.userId}`);
        setVideo(videoRes.data)
        setChannel(channelRes.data);
        dispatch(fetchSuccess(videoRes.data));
        currentUser._id === videoRes.data.userId ? setSamePeople(true) : setSamePeople(false);
        // console.log('video', video);
      } catch (err) { }
    }
    fetchData();
  }, [path, dispatch, currentUser, video])

  useEffect(() => {
    // 防抖防止渲染两次useEffect
    debounce();
  }, [])

  const handleLike = async () => {
    await newRequest.put(`/users/like/${video._id}`);
    // dispatch的作用就是实时更新页面，改变state
    dispatch(like(currentUser._id));
  }

  const handleDislike = async () => {
    await newRequest.put(`/users/dislike/${video._id}`);
    dispatch(dislike(currentUser._id));
  }

  const handleSub = async () => {
    currentUser.subscribedUsers.includes(channel?._id)
      ? await newRequest.put(`/users/unsub/${channel._id}`)
      : await newRequest.put(`/users/sub/${channel._id}`);
    dispatch(subscription(channel._id));
  }
  return (
    <Container>
      <Content>
        <VideoWrapper>
          <VideoFrame src={video && video.videoUrl} controls />
        </VideoWrapper>
        <Title>{video && video.title}</Title>
        <Details>
          <Info>{video && video.views} views • {video && format(video.createdAt)}</Info>
          <Buttons>
            <Button onClick={handleLike}>
              {/* 这里放？是因为可以最开始没有装载 */}
              {video && video.likes?.includes(currentUser?._id) ? (
                <ThumbUpIcon />
              ) : (
                <ThumbUpOutlinedIcon />
              )}{" "}
              {video && video.likes?.length}
            </Button>
            <Button onClick={handleDislike}>
              {video && video.dislikes?.includes(currentUser?._id) ? (
                <ThumbDownIcon />
              ) : (
                <ThumbDownOffAltOutlinedIcon />
              )}{" "} Dislike
            </Button>
            <Button>
              <ReplyOutlinedIcon /> Share
            </Button>
            <Button>
              <AddTaskOutlinedIcon /> Save
            </Button>
          </Buttons>
        </Details>
        <Hr />
        <Channel>
          <ChannelInfo>
            <Image src={channel && channel.img} />
            <ChannelDetail>
              <ChannelName>{channel && channel.name}</ChannelName>
              <ChannelCounter>{channel && channel.subscribers} subscribers</ChannelCounter>
              <Description>
                {video && video.desc}
              </Description>
            </ChannelDetail>
          </ChannelInfo>

          {currentUser && channel && currentUser.subscribedUsers?.includes(channel._id)
            ? (
              <Subscribe onClick={handleSub} style={{ backgroundColor: "grey" }} disabled={samepeople}>SUBSCRIBED
              </Subscribe>
            ) : (
              <Subscribe onClick={handleSub} disabled={samepeople} >SUBSCRIBE
              </Subscribe>
            )
          }

        </Channel>
        <Hr />
        <Comments videoId={video && video._id} />
      </Content>
      <Recommendation tags={video && video.tags} />
    </Container>
  );
};

export default Video;
