import os
import csv
import sys
import logging
import requests
from lxml import html


logging.basicConfig(level=logging.INFO)
log = logging.getLogger(__file__)

_DIR = os.path.dirname(os.path.abspath(__file__))
_APPDATA = os.path.join(_DIR, 'data')


def scrape(year, csv_filename, link, csspath, col_header=[]):
    response = requests.get(link)  # get page data from server, block redirects
    sourceCode = response.content  # get string of source code from response
    htmlElem = html.document_fromstring(sourceCode)  # make HTML element object

    total_columns = len(htmlElem.cssselect(csspath + ':nth-child(1) > td'))
    tdElems = htmlElem.cssselect(csspath + ' > td')  # list of all td elems

    with open(csv_filename, newline='', encoding='utf-8', mode='w') as csvfile:
        csv_writer = csv.writer(csvfile, delimiter=',')
        if col_header:
            csv_writer.writerow(col_header)
        for index in range(len(tdElems)):
            if index % total_columns != 0:
                continue
            row = []
            for i in range(total_columns):
                row.append(tdElems[index+i].text_content().strip())
            if (index != 0 and row[0] == 'DATE'):
                # rainfall data tables contain Header in b/t rows
                continue
            log.info('row: %s', row)
            csv_writer.writerow(row)

    log.info('CSV data created: %s', csv_filename)


def main():
    '''Main program. Sets up logging & scrapes'''
    logging.basicConfig(stream=sys.stderr, level=logging.DEBUG,
                        format='%(name)s (%(levelname)s): %(message)s')

    for year in range(14, 20):
        year = str(year).zfill(2)
        scrape(year, os.path.join(_APPDATA, 'veeranam' + year + '.csv'),
               'http://www.chennaimetrowater.tn.nic.in/veeranam%20' + year + '.htm',
               'body > div > div:nth-child(5) > table > tr',
               ['DATE', 'Storage in Mcft', 'inflow in cusec', 'Discharge in cusec'])

    for year in range(8, 20):
        year = str(year).zfill(2)
        scrape(year,
               os.path.join(_APPDATA, 'rainfall' + year + '.csv'),
               'http://www.chennaimetrowater.tn.nic.in/dailyrain' + year + '.htm',
               'body > div > div > table > tr')


if __name__ == '__main__':
    sys.exit(main())
