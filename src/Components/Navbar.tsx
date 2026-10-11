import { Tab, Tabs, TabList, Heading } from '@chakra-ui/react';
import { useNavigate, useLocation } from 'react-router-dom';

const routes = ['/', '/north', '/shhh', '/south'];

export default function Navbar() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const index = Math.max(routes.indexOf(pathname), 0);

  return (
    <Tabs size="lg" align="end" colorScheme="teal" index={index} onChange={(i) => navigate(routes[i])}>
      <TabList mb="1em" justifyContent="space-between" display="flex" alignItems="center">
        <Heading size="lg" color="teal">HBZ</Heading>
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Tab _selected={{ color: 'white', bg: 'teal.500' }} color="teal">Home</Tab>
          <Tab _selected={{ color: 'white', bg: 'teal.500' }} color="teal">North</Tab>
          <Tab _selected={{ color: 'white', bg: 'teal.500' }} color="teal">Central</Tab>
          <Tab _selected={{ color: 'white', bg: 'teal.500' }} color="teal">South</Tab>
        </div>
      </TabList>
    </Tabs>
  );
}