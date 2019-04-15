import React from 'react';
import { Header } from 'react-native-elements';

const MainHeader = () => {
  return (
    <Header
      containerStyle={{
        backgroundColor: '#F0F3F4',
        justifyContent: 'space-around',
      }}
      leftComponent={{ icon: 'menu', color: 'black' }}
      centerComponent={{ text: 'BONIFY', style: { color: 'black', fontStyle: 'italic' } }}
    />
  );
};

export default MainHeader;
