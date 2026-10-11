import json
import os
import urllib.request
from datetime import datetime, timezone
from zoneinfo import ZoneInfo

import buoy_parsing_functions as bpf

STATION = '41009'
URL = f'https://www.ndbc.noaa.gov/data/realtime2/{STATION}.spec'
RAW_PATH = f'data/{STATION}.spec'
JSON_PATH = 'output/buoy.json'
HISTORY_COUNT = 48  # wave readings every 30 min x 48 = last 24 hours
EASTERN = ZoneInfo('America/New_York')

MISSING = {'MM', 'N/A', '-'}
COMPASS = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE',
           'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW']


def download_raw(url, path):
    """Download the raw NDBC file, save a copy, and return its lines."""
    request = urllib.request.Request(url, headers={'User-Agent': 'harbourboyz-buoy-bot'})
    with urllib.request.urlopen(request, timeout=30) as response:
        text = response.read().decode('utf-8')
    with open(path, 'w') as f:
        f.write(text)
    return text.splitlines()


def to_number(value):
    """'1.4' -> 1.4, missing markers -> None."""
    if value in MISSING:
        return None
    return float(value)


def to_text(value):
    """'ENE' -> 'ENE', missing markers -> None."""
    if value in MISSING:
        return None
    return value


def compass_to_degrees(label):
    """'SSE' -> 157.5, so the frontend can rotate the arrow. None if unknown."""
    if label not in COMPASS:
        return None
    return COMPASS.index(label) * 22.5


def parse_reading(line):
    """Turn one raw .spec line into a dict for the site. None for headers/bad lines.

    .spec columns:
    0-4 YY MM DD hh mm | 5 WVHT | 6 SwH | 7 SwP | 8 WWH | 9 WWP |
    10 SwD | 11 WWD | 12 STEEPNESS | 13 APD | 14 MWD
    """
    if bpf.is_header_line(line) or not line.strip():
        return None

    values = bpf.split_line_into_values(bpf.strip_line(line))
    if len(values) < 12:
        return None

    utc_time = datetime(int(values[0]), int(values[1]), int(values[2]),
                        int(values[3]), int(values[4]), tzinfo=timezone.utc)

    total_ft = bpf.meters_to_feet(to_number(values[5]))
    swell_ft = bpf.meters_to_feet(to_number(values[6]))
    swell_period = to_number(values[7])
    wind_ft = bpf.meters_to_feet(to_number(values[8]))
    wind_period = to_number(values[9])
    swell_dir = to_text(values[10])
    wind_dir = to_text(values[11])

    # Main line uses whichever component is bigger (swell vs. wind waves)
    if (swell_ft or 0) >= (wind_ft or 0):
        main_dir, main_period = swell_dir, swell_period
    else:
        main_dir, main_period = wind_dir, wind_period

    return {
        'time': utc_time.astimezone(EASTERN).isoformat(),
        'height_ft': total_ft,
        'period_s': main_period,
        'direction': main_dir,
        'direction_deg': compass_to_degrees(main_dir),
        'swell': {
            'height_ft': swell_ft,
            'period_s': swell_period,
            'direction': swell_dir,
        },
        'wind_waves': {
            'height_ft': wind_ft,
            'period_s': wind_period,
            'direction': wind_dir,
        },
    }


def build_site_data(lines):
    """Build the JSON: newest complete reading plus recent history."""
    readings = [r for r in (parse_reading(line) for line in lines) if r is not None]
    complete = [r for r in readings
                if r['height_ft'] is not None and r['period_s'] is not None]
    return {
        'station': STATION,
        'generated_at': datetime.now(EASTERN).isoformat(),
        'current': complete[0] if complete else None,
        'history': complete[:HISTORY_COUNT],
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