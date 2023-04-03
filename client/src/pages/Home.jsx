import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Card from "../components/Card";
import newRequest from "../utils/newRequest";
import { Spin } from "antd";
import "./index.css";

const Container = styled.div`
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
`;




const Home = ({ type, tag }) => {

  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(false);

  // 初次渲染
  // 不能再useEffect那里直接async，所以创建一个async并再拿到

  useEffect(() => {
    const fetchVideo = async () => {
      // 后端跨域，前端package.json()失效proxy，在后端设置cors
      setLoading(true);
      if (type) {
        const res = await newRequest.get(`/videos/${type}`);
        setVideos(res.data);
        setLoading(false);
      } else {
        const res = await newRequest.get(`/videos/tags?tags=${tag}`);
        setVideos(res.data);
        setLoading(false);
      }
    }
    fetchVideo();

  }, [type, tag])

  return (
    <div className="outter">
      <Spin spinning={loading} wrapperClassName="container"
      >
        <Container>
          {/* video as props to use in card component */}
          {videos.map((video) => (
            <Card key={video._id} video={video} />
          ))}

        </Container>
      </Spin >
    </div>
  );
};

export default Home;
