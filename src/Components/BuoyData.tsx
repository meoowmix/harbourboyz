// components/BuoyData.tsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Box, Text, Stat, StatNumber, Spinner, Icon } from '@chakra-ui/react';
import { ArrowUpIcon } from '@chakra-ui/icons';

const BUOY_URL =
  'https://raw.githubusercontent.com/meoowmix/harbourboyz/main/processor/output/buoy.json';

interface WaveComponent {
  height_ft: number | null;
  period_s: number | null;
  direction: string | null;
}

interface BuoyReading {
  time: string;
  height_ft: number;
  period_s: number;
  direction: string | null;
  direction_deg: number | null;
  swell: WaveComponent;
  wind_waves: WaveComponent;
}

interface BuoyFile {
  station: string;
  generated_at: string;
  current: BuoyReading | null;
  history: BuoyReading[];
}

type Trend = 'up' | 'down' | null;

const average = (nums: number[]) => nums.reduce((a, b) => a + b, 0) / nums.length;

// Total height: avg of newest 3 readings vs. avg of readings ~3 hrs earlier.
// Returns null when steady (change under threshold) or not enough data.
const getTrend = (history: BuoyReading[], threshold = 0.3): Trend => {
  if (history.length < 9) return null;
  const recent = average(history.slice(0, 3).map((r) => r.height_ft));
  const earlier = average(history.slice(6, 9).map((r) => r.height_ft));
  const diff = recent - earlier;
  if (diff > threshold) return 'up';
  if (diff < -threshold) return 'down';
  return null;
};

const formatSwell = (swell: WaveComponent) => {
  if (swell.height_ft === null || swell.period_s === null || swell.height_ft === 0) {
    return 'Swell —';
  }
  return `Swell ${swell.height_ft.toFixed(1)}' @ ${Math.round(swell.period_s)}s ${swell.direction ?? ''}`.trim();
};

const BuoyData: React.FC = () => {
  const [reading, setReading] = useState<BuoyReading | null>(null);
  const [history, setHistory] = useState<BuoyReading[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBuoyData = async () => {
      try {
        const response = await axios.get<BuoyFile>(BUOY_URL);
        if (response.data.current) {
          setReading(response.data.current);
          setHistory(response.data.history);
          setError(null);
        } else {
          setError('No buoy data available at this time.');
        }
      } catch (err) {
        console.error('Error fetching buoy data:', err);
        setError('Error fetching buoy data');
      }
    };

    fetchBuoyData();
    const interval = setInterval(fetchBuoyData, 10 * 60 * 1000); // refresh every 10 min
    return () => clearInterval(interval);
  }, []);

  if (error) {
    return (
      <Box textAlign="center" mt={6}>
        <Text color="red.500" fontSize="lg">{error}</Text>
      </Box>
    );
  }

  if (!reading) {
    return (
      <Box textAlign="center" mt={6}>
        <Spinner size="xl" />
        <Text mt={4}>Loading buoy data...</Text>
      </Box>
    );
  }

  const readingTime = new Date(reading.time).toLocaleTimeString([], {
    hour: 'numeric',
    minute: '2-digit',
  });

  const trend = getTrend(history);

  return (
    <Stat mt={4}>
      <Box display="flex" justifyContent="center" alignItems="center" color="teal">
        {reading.direction_deg !== null && (
          <Icon
            as={ArrowUpIcon}
            w={8}
            h={8}
            transform={`rotate(${(reading.direction_deg + 180) % 360}deg)`}
            mr={2}
          />
        )}
        <StatNumber>
          {reading.direction ?? '—'} {reading.height_ft.toFixed(1)}' @ {Math.round(reading.period_s)}s
        </StatNumber>
      </Box>
      <Text textAlign="center" fontSize="sm" color="gray.500" mt={1}>
        {formatSwell(reading.swell)} ·{' '}
        {trend === 'up' && <Text as="span" color="green.400">▲ · </Text>}
        {trend === 'down' && <Text as="span" color="red.400">▼ · </Text>}
        {readingTime}
      </Text>
    </Stat>
  );
};

export default BuoyData;