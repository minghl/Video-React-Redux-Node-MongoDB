import React from 'react';
import styled from 'styled-components';
const Text = styled.div`
display: flex;
  color: ${({ theme }) => theme.text};
  margin: 0 auto;
  justify-content:center;
  align-item:center;
`;

const Undev = () => {
    return (
        <Text style={{ color: `${({ theme }) => theme.text}` }}>Sorry, this page is not develped. Let's look forward to future work :)</Text>
    )
}

export default Undev;