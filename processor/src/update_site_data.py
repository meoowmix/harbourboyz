import json
import os
import urllib.request
from datetime import datetime, timezone
from zoneinfo import ZoneInfo

import buoy_parsing_functions as bpf

STATION = '41009'
URL = f'https://www.ndbc.noaa.gov/data/realtime2/{STATION}.txt'
RAW_PATH = f'data/{STATION}.txt'
JSON_PATH = 'output/buoy.json'
HISTORY_COUNT = 48  # 48 readings x 30 min = last 24 hours
EASTERN = ZoneInfo('America/New_York')


def download_raw(url, path):
    """Download the raw NDBC file, save a copy, and return its lines."""
    request = urllib.request.Request(url, headers={'User-Agent': 'harbourboyz-buoy-bot'})
    with urllib.request.urlopen(request, timeout=30) as response:
        text = response.read().decode('utf-8')
    with open(path, 'w') as f:
        f.write(text)
    return text.splitlines()


def parse_reading(line):
    """Turn one raw line into a dict for the site. Returns None for headers/blank lines."""
    if bpf.is_header_line(line) or not line.strip():
        return None

    values = bpf.split_line_into_values(bpf.strip_line(line))
    utc_time = datetime(int(values[0]), int(values[1]), int(values[2]),
                        int(values[3]), int(values[4]), tzinfo=timezone.utc)

    fields = bpf.extract_values(values)
    direction_deg = bpf.readability_conversion(fields['swell_direction'])

    return {
        'time': utc_time.astimezone(EASTERN).isoformat(),
        'height_ft': bpf.meters_to_feet(bpf.readability_conversion(fields['swell_meters'])),
        'period_s': bpf.readability_conversion(fields['swell_period']),
        'direction_deg': direction_deg,
        'direction': bpf.degrees_to_compass(direction_deg),
        'water_temp_f': bpf.c_to_f(bpf.readability_conversion(fields['water_temp'])),
    }


def build_site_data(lines):
    """Build the JSON structure: newest complete wave reading plus recent history."""
    readings = [r for r in (parse_reading(line) for line in lines) if r is not None]
    wave_readings = [r for r in readings
                     if r['height_ft'] is not None and r['period_s'] is not None]
    return {
        'station': STATION,
        'generated_at': datetime.now(EASTERN).isoformat(),
        'current': wave_readings[0] if wave_readings else None,
        'history': wave_readings[:HISTORY_COUNT],
    }


if __name__ == '__main__':
    os.makedirs('data', exist_ok=True)
    os.makedirs('output', exist_ok=True)

    lines = download_raw(URL, RAW_PATH)
    site_data = build_site_data(lines)

    with open(JSON_PATH, 'w') as f:
        json.dump(site_data, f, indent=2)

    print(f"Current: {site_data['current']}")
    print(f"Wrote {len(site_data['history'])} history readings to {JSON_PATH}")