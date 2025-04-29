import React from 'react';
import { Box, Flex, Text, Input } from '@chakra-ui/react';

const Navbar = () => (
  <Box bg="green.700" px={6} py={3} borderRadius="lg" mb={6}>
    <Flex align="center" justify="space-between">
      <Flex align="center">
        <Box bg="white" color="green.700" fontWeight="bold" borderRadius="md" px={2} py={1} mr={3}>IMG</Box>
        <Text fontSize="xl" fontWeight="bold" color="white">Newlands Tea Factory</Text>
      </Flex>
      <Input
        placeholder="Search..."
        width="300px"
        bg="green.600"
        color="white"
        border="none"
        _placeholder={{ color: 'whiteAlpha.700' }}
        borderRadius="md"
      />
    </Flex>
  </Box>
);

export default Navbar;
