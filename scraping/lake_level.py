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

year = '15'
csv_filename = os.path.join(_APPDATA, 'veeranam' + year + '.csv')


def scrape():
    link = 'http://www.chennaimetrowater.tn.nic.in/veeranam%20' + year + '.htm'
    response = requests.get(link)  # get page data from server, block redirects
    sourceCode = response.content  # get string of source code from response
    htmlElem = html.document_fromstring(sourceCode)  # make HTML element object


    colNames = ['Date', 'Storage', 'Inflow', 'Discharge']  # column titles

    csspath = 'body > div > div:nth-child(5) > table > tr > td'

    tdElems = htmlElem.cssselect(csspath)  # list of all td elems

    with open(csv_filename, newline='', encoding='utf-8', mode='w') as csvfile:
        csv_writer = csv.writer(csvfile, delimiter=',')
        csv_writer.writerow(colNames)

        for index, elem in enumerate(tdElems):
            if index % 4 != 0:
                continue
            date = elem.text_content().strip()
            storage = tdElems[index+1].text_content().strip()
            infuse = tdElems[index+2].text_content().strip()
            discharge = tdElems[index+3].text_content().strip()

            csv_writer.writerow([date, storage, infuse, discharge])
    
    log.info('CSV data created %s', csv_filename)


def main():
    '''Main program. Sets up logging & scrapes'''
    logging.basicConfig(stream=sys.stderr, level=logging.DEBUG,
                        format='%(name)s (%(levelname)s): %(message)s')
    scrape()

if __name__ == '__main__':
    sys.exit(main())