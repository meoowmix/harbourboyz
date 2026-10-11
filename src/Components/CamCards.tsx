import React from 'react';
import { SimpleGrid, Box, Badge, AspectRatio, Link, Text, Button } from '@chakra-ui/react';
import { ExternalLinkIcon } from '@chakra-ui/icons';
import { centralCams, type Cam } from '../assets/cams.tsx';
import './CamCards.css';

const CamCard: React.FC<{ cam: Cam }> = ({ cam }) => (
  <Box width="100%">
    <Badge margin="2" fontSize="1em" variant="outline" colorScheme="teal">
      {cam.title}
    </Badge>

    {cam.embed ? (
      <AspectRatio ratio={16 / 9}>
        <iframe
          src={cam.src}
          title={cam.title}
          allow="autoplay; fullscreen"
          allowFullScreen
          style={{ border: 0 }}
        />
      </AspectRatio>
    ) : (
      <AspectRatio ratio={16 / 9}>
        <Box display="flex" alignItems="center" justifyContent="center" bg="gray.700" borderRadius="md">
          <Button
            as="a"
            href={cam.src}
            target="_blank"
            rel="noopener noreferrer"
            colorScheme="teal"
            rightIcon={<ExternalLinkIcon />}
          >
            Watch on {cam.credit}
          </Button>
        </Box>
      </AspectRatio>
    )}

    <Text fontSize="xs" color="gray.500" mt={1} ml={2}>
      Cam:{' '}
      <Link href={cam.creditUrl} isExternal color="teal.400">
        {cam.credit}
      </Link>
    </Text>
  </Box>
);

export default function CamCards() {
  return (
    <SimpleGrid spacing={25} columns={{ base: 1, md: 2 }}>
      {centralCams.map((cam) => (
        <CamCard key={cam.title} cam={cam} />
      ))}
    </SimpleGrid>
  );
}