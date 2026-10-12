// components/BuoyData.tsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Box, Text, Spinner, Icon, SimpleGrid } from '@chakra-ui/react';
import { ArrowUpIcon } from '@chakra-ui/icons';

const BUOY_URL =
  'https://raw.githubusercontent.com/meoowmix/harbourboyz/main/processor/output/buoy.json';

const COMPASS = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE',
                 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];

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

const compassToDegrees = (label: string | null): number | null => {
  if (!label) return null;
  const index = COMPASS.indexOf(label);
  return index === -1 ? null : index * 22.5;
};

const average = (nums: number[]) => nums.reduce((a, b) => a + b, 0) / nums.length;

// Avg of newest 3 readings vs. avg of readings ~3 hrs earlier (index 6-8).
// Skips missing values. Returns null when steady or not enough data.
const getTrend = (
  history: BuoyReading[],
  pick: (r: BuoyReading) => number | null,
  threshold = 0.3
): Trend => {
  if (history.length < 9) return null;
  const recent = history.slice(0, 3).map(pick).filter((n): n is number => n !== null);
  const earlier = history.slice(6, 9).map(pick).filter((n): n is number => n !== null);
  if (recent.length === 0 || earlier.length === 0) return null;
  const diff = average(recent) - average(earlier);
  if (diff > threshold) return 'up';
  if (diff < -threshold) return 'down';
  return null;
};

const WaveRow: React.FC<{ label: string; wave: WaveComponent; trend: Trend }> = ({
  label,
  wave,
  trend,
}) => {
  const height = wave.height_ft;
  const period = wave.period_s;
  const deg = compassToDegrees(wave.direction);

  return (
    <Box textAlign="center">
      <Text fontSize="sm" color="gray.500">{label}</Text>
      {height === null || period === null || height === 0 ? (
        <Text fontSize="2xl" color="gray.500">—</Text>
      ) : (
        <Box display="flex" alignItems="baseline" justifyContent="center" gap={2} color="teal">
          {deg !== null && (
            <Icon
              as={ArrowUpIcon}
              w={6}
              h={6}
              alignSelf="center"
              transform={`rotate(${(deg + 180) % 360}deg)`}
            />
          )}
          <Text fontSize="2xl" fontWeight="bold">
            {height.toFixed(1)}'
            {trend === 'up' && <Text as="span" fontSize="sm" color="green.400" ml={1}>▲</Text>}
            {trend === 'down' && <Text as="span" fontSize="sm" color="red.400" ml={1}>▼</Text>}
          </Text>
          <Text fontSize="md">{Math.round(period)}s</Text>
          <Text fontSize="xl" fontWeight="bold">{wave.direction ?? ''}</Text>
        </Box>
      )}
    </Box>
  );
};

const BuoyData: React.FC = () => {
  const [reading, setReading] = useState<BuoyReading | null>(null);
  const [history, setHistory] = useState<BuoyReading[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBuoyData = async () => {
      try {
        const response = await axios.get<BuoyFile>(`${BUOY_URL}?t=${Date.now()}`);
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
    const interval = setInterval(fetchBuoyData, 5 * 60 * 1000); // refresh every 5 min
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

  const swellTrend = getTrend(history, (r) => r.swell.height_ft);
  const windTrend = getTrend(history, (r) => r.wind_waves.height_ft);

  return (
    <Box mt={4}>
      <SimpleGrid columns={2} spacing={4}>
        <WaveRow label="swell" wave={reading.swell} trend={swellTrend} />
        <WaveRow label="wind wave" wave={reading.wind_waves} trend={windTrend} />
      </SimpleGrid>
      <Text textAlign="center" fontSize="sm" color="gray.500" mt={2}>
        Cape 20m · 41009 · {readingTime}
      </Text>
    </Box>
  );
};

export default BuoyData;