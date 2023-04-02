import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Card from "../components/Card";
import newRequest from "../utils/newRequest";

const Container = styled.div`
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
`;

const Text = styled.div`
color: ${({ theme }) => theme.text};
margin: 0 auto;
`


const Home = ({ type }) => {

  const [videos, setVideos] = useState([]);

  // 初次渲染
  // 不能再useEffect那里直接async，所以创建一个async并再拿到
  useEffect(() => {
    const fetchVideo = async () => {
      // 后端跨域，前端package.json()失效proxy，在后端设置cors
      const res = await newRequest.get(`/videos/${type}`);
      setVideos(res.data);

    }
    fetchVideo()
  }, [type])
  return (
    <Container>
      {/* video as props to use in card component */}
      {videos.map((video) => (
        <Card key={video._id} video={video} />
      ))}
      <Text>All materials on this website are for learning purposes. If there is any infringement, please contact me. Thank you very much.</Text>
    </Container>
  );
};

export default Home;
