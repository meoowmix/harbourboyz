# Created a real functional script to import NOAA buoy data for my personal surf website.
# I had previously tried to fetch the NOAA buoy text files directly with react but got CORS errors
# Didn't know how to fix it so I found a swell model API which wasnt accurate at all, this fixes that
# Plan to incorporate this with the webapp later now that I have the clean real time data

def strip_line(line):
    return line.strip()
    # removes whitespace, new line

def is_header_line(line):
    return line.startswith('#')
    # gives True for header

def split_line_into_values(line):
    return line.split()
    # converts to list

def extract_values(values):
    return {"timestamp": f"{values[1]}/{values[2]} {values[3]}:{values[4]}", 
            "swell_direction": values[11], 
            "swell_meters": values[8], 
            "swell_period": values[9],
            "water_temp": values[14]
            }
    # data cleaning, extracts needed values, assigns keys (surfers only need time, swell direction/height/period to know if there's waves)

def readability_conversion(value):
    if value == "MM":
        return None
    return float(value)
    # removes MM strings and adds floats to all numbers

def meters_to_feet(swell_meters):
    if swell_meters is None:
        return None
    return round(swell_meters * 3.28084, 1)
    # converts swell height from euro to freedom units

def c_to_f(temp_celsius):
    if temp_celsius is None:
        return None
    return round(temp_celsius * (9/5) + 32, 1)

def degrees_to_compass(degrees):
    if degrees is None:
        return None
    directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE',
                  'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW']
    index = int(round(degrees / 22.5)) % 16
    return directions[index]
    # returns cardinal direction from degrees

def convert_to_csv(values):
    cleaned = ['' if v is None else str(v) for v in values]
    return ','.join(cleaned)
    # adds commas, removes Nones

def line_cleaner(line):
    if is_header_line(line):
        return None

    stripped = strip_line(line)
    values = split_line_into_values(stripped)
    fields = extract_values(values)

    direction_deg = readability_conversion(fields['swell_direction'])
    direction = degrees_to_compass(direction_deg)
    height = meters_to_feet(readability_conversion(fields['swell_meters']))
    period = readability_conversion(fields['swell_period'])
    water_temp = c_to_f(readability_conversion(fields['water_temp']))

    row = [fields['timestamp'], direction_deg, direction, height, period, water_temp]
    return convert_to_csv(row)

    #steps through each function, calls convert_to_csv for final output

if __name__ == '__main__':
    header = '#YY  MM DD hh mm WDIR WSPD GST  WVHT   DPD   APD MWD   PRES  ATMP  WTMP  DEWP  VIS PTDY  TIDE\n'
    test_line = '2026 10 09 15 26  MM   MM   MM   0.7     4   3.7  98     MM    MM  27.5    MM   MM   MM    MM\n'

    print(line_cleaner(header))
    print(line_cleaner(test_line))


