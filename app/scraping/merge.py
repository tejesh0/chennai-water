import os
import csv
import logging
from dateutil import parser

logging.basicConfig(level=logging.INFO)
log = logging.getLogger(__file__)

_DIR = os.path.dirname(os.path.abspath(__file__))
_APPDATA = os.path.join(_DIR, 'data')


def startswith_rainfall(filename):
    return filename.startswith('rainfall')


# read files based on startswith filename in directory
rainfall_datafiles = list(filter(startswith_rainfall, os.listdir(_APPDATA)))

csv_filename = 'ultimate_rainfall.csv'

all_col_header = [
    'DATE',
    'UNIX_TIME',
    'Year',
    'Month',
    'POONDI',
    'CHOLA VARAM',
    'RED HILLS',
    'TAMARAI PAKKAM',
    'CHEMBARAM BAKKAM',
    'KORATTUR ANICUT',
    'VEERANAM',
    'NUNGAM BAKKAM',
    'MEENAM BAKKAM'
]

with open(os.path.join(_APPDATA, csv_filename), newline='', encoding='utf-8', mode='w') as csvfile:
    csv_writer = csv.DictWriter(csvfile, delimiter=',', fieldnames=all_col_header)
    csv_writer.writeheader()
    print(rainfall_datafiles)
    for rainfall_year_file in rainfall_datafiles:
        with open(os.path.join(_APPDATA, rainfall_year_file), newline='') as read_csvfile:
            reader = csv.DictReader(read_csvfile)
            for row in reader:
                dict_row = row
                # Exception handling: RED HILLS column name
                if 'REDHILLS' in row:
                    dict_row['RED HILLS'] = row['REDHILLS']
                    dict_row.pop('REDHILLS')
                for col in all_col_header:
                    if col not in row:
                        dict_row[col] = ''

                date = parser.parse(dict_row['DATE'])
                dict_row['UNIX_TIME'] = date.timestamp() * 1000
                dict_row['Year'], dict_row['Month'] = date.strftime("%Y,%m").split(',')

                csv_writer.writerow(row)

    log.info('CSV data created: %s', csv_filename)

# add empty cell values for columns that dont exist in other files
# Add new column as and when new column is found
# Fill previous data as empty for new column
