import React from 'react';
import { Container, Menu, Image } from 'semantic-ui-react';

function NavBar() {
  return (
    <Menu>
      <Container text>
        <Menu.Item>
          <i className='phone icon'></i>
        </Menu.Item>
        <Menu.Item header>Call Center</Menu.Item>
        <Menu.Item position='right'>
          <Image
            src='https://react.semantic-ui.com/images/avatar/large/chris.jpg'
            avatar
          />
        </Menu.Item>
        <Menu.Item>Chris</Menu.Item>
      </Container>
    </Menu>
  );
}

export default NavBar;
