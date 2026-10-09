def explore(filepath):
    with open(filepath, 'r') as f:
        lines = f.readlines()

    print(f"Total lines: {len(lines)}")
    print(f"Header lines: {len([l for l in lines if l.startswith('#')])}")
    print("\nFirst 5 lines:")
    for line in lines[:5]:
        print(repr(line))

if __name__ == '__main__':
    explore('data/41113.txt')