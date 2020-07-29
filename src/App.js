import React from 'react';
import styled from 'styled-components';

function App() {
  return (
    <Root>
      <Container>Hello, world.</Container>
    </Root>
  );
}

const Container = styled.main`
  width: 100%;
  max-width: 640px;
`;

const Root = styled.div`
  width: 100%;

  display: flex;
  justify-content: center;
`;

export default App;
