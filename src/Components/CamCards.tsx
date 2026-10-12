import React, { useEffect, useRef } from 'react';
import { SimpleGrid, Box, Badge, AspectRatio, Link, Text } from '@chakra-ui/react';
import Hls from 'hls.js';
import { type Cam, HLS_CAMS, IFRAME_CAMS } from '../assets/cams.tsx';
import './CamCards.css';

const CamCard: React.FC<{ cam: Cam }> = ({ cam }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const isIframe = cam.camKey.startsWith('_iframe_');
  const iframeSrc = isIframe ? IFRAME_CAMS[cam.camKey] : null;
  const streamUrl = isIframe ? null : HLS_CAMS[cam.camKey];

  useEffect(() => {
    if (isIframe || !streamUrl || !videoRef.current) return;

    const video = videoRef.current;
    let hls: Hls | null = null;

    if (Hls.isSupported()) {
      hls = new Hls({ enableWorker: true, lowLatencyMode: true });
      hls.loadSource(streamUrl);
      hls.attachMedia(video);
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = streamUrl;
    }

    return () => {
      hls?.destroy();
    };
  }, [streamUrl, isIframe]);

  const renderPlayer = () => {
    if (isIframe && iframeSrc) {
      return (
        <iframe
          src={iframeSrc}
          title={cam.title}
          allow="fullscreen"
          scrolling="no"
          style={{ border: 0 }}
        />
      );
    }

    return (
      <video
        ref={videoRef}
        controls
        muted
        playsInline
        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
      />
    );
  };

  return (
    <Box width="100%">
      <Badge margin="2" fontSize="1em" variant="outline" colorScheme="teal">
        {cam.title}
      </Badge>
      <AspectRatio ratio={16 / 9}>{renderPlayer()}</AspectRatio>
      <Text fontSize="xs" color="gray.500" mt={1} ml={2}>
        Cam:{' '}
        <Link href={cam.creditUrl} isExternal color="teal.400">
          {cam.credit}
        </Link>
      </Text>
    </Box>
  );
};

export default function CamGrid({ cams }: { cams: Cam[] }) {
  return (
    <SimpleGrid spacing={25} columns={{ base: 1, md: 2 }}>
      {cams.map((cam) => (
        <CamCard key={cam.title} cam={cam} />
      ))}
    </SimpleGrid>
  );
}