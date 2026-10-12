import React, { useEffect, useRef, useState } from 'react';
import { SimpleGrid, Box, Badge, AspectRatio, Link, Text, Spinner } from '@chakra-ui/react';
import Hls from 'hls.js';
import { type Cam, IFRAME_CAMS } from '../assets/cams.tsx';
import './CamCards.css';

const CAMS_URL =
  'https://raw.githubusercontent.com/meoowmix/harbourboyz/main/processor/output/cams.json';

const CamCard: React.FC<{ cam: Cam; streamUrl: string | null; loading: boolean }> = ({
  cam,
  streamUrl,
  loading,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const isIframe = cam.camKey.startsWith('_iframe_');
  const iframeSrc = isIframe ? IFRAME_CAMS[cam.camKey] : null;

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

    if (loading || !streamUrl) {
      return (
        <Box display="flex" alignItems="center" justifyContent="center" bg="gray.800">
          <Spinner color="teal" />
        </Box>
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
  const [streams, setStreams] = useState<Record<string, string | null>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${CAMS_URL}?t=${Date.now()}`)
      .then((r) => r.json())
      .then((data) => setStreams(data))
      .catch((err) => console.error('Failed to fetch cam streams:', err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <SimpleGrid spacing={25} columns={{ base: 1, md: 2 }}>
      {cams.map((cam) => (
        <CamCard
          key={cam.title}
          cam={cam}
          streamUrl={streams[cam.camKey] ?? null}
          loading={loading}
        />
      ))}
    </SimpleGrid>
  );
}