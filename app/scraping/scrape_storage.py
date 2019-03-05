import os
import csv
import sys
import logging
import requests
import gramex.data
from lxml import html
from dateutil import parser
from gramex.config import str_utf8
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy import Column, String, Integer, Date


logging.basicConfig(level=logging.INFO)
log = logging.getLogger(__file__)

_DIR = os.path.dirname(os.path.abspath(__file__))
_APPDATA = os.path.join(_DIR, 'data')


DB_STRING = 'sqlite:///scraping/data/app.fov.db'

engine = gramex.data.create_engine(DB_STRING, encoding=str_utf8)

Session = sessionmaker(bind=engine)

Base = declarative_base()

session = Session()


class LakeStorage(Base):
    __tablename__ = 'lake_storage'

    date = Column(Date, primary_key=True)
    lake = Column(String, primary_key=True)
    year = Column(Integer, primary_key=True)
    month = Column(String, primary_key=True)
    storage_level = Column(Integer, primary_key=True)

    def __init__(self, date, lake, year, month, storage_level):
        self.date = date
        self.lake = lake
        self.year = year
        self.month = month
        self.storage_level = storage_level

    def __repr__(self):
        return '%s - %s' % (self.unix_time, self.lake)


Base.metadata.create_all(engine)
_DIR = os.path.dirname(os.path.abspath(__file__))

# delete all rows
session.query(LakeStorage).delete()


def scrape(link, csv_filename):
    response = requests.get(link)  # get page data from server, block redirects
    sourceCode = response.content  # get string of source code from response
    htmlElem = html.document_fromstring(sourceCode)  # make HTML element object

    tbody = htmlElem.cssselect('body > div > div > table')
    print(tbody)

    lakes = [
        'POONDI',
        'CHOLA VARAM',
        'RED HILLS',
        'CHEMBARAM BAKKAM',
        'VEERANAM'
    ]
    # lakes = ['POONDI', 'CHOLAVARAM', 'REDHILLS', 'CHEMBARAMBAKKAM', 'VEERANAM']
    with open(csv_filename, newline='', encoding='utf-8', mode='w') as csvfile:
        csv_writer = csv.writer(csvfile, delimiter=',')
        col_header = ['Lake', 'Year', 'Jan', 'Feb', 'Mar', 'Apr', 'May',
                      'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
        csv_writer.writerow(col_header)
        # Get all tables tbody

        for i, body in enumerate(tbody):
            lake = lakes[i]
            trElems = body.cssselect('tr')
            for index, trElem in enumerate(trElems):
                if index < 3:
                    continue
                row = [lake]
                row.extend([s.strip() for s in trElem.text_content().split('\r\n') if s.strip()])
                log.info('row: %s', row)
                csv_writer.writerow(row)
                for row_index in range(2, 12):
                    date = parser.parse(row[1]+'-'+col_header[row_index]+'-01')
                    lake_storage = LakeStorage(date,
                                               lake,
                                               row[1],
                                               col_header[row_index],
                                               row[row_index])
                    try:
                        session.add(lake_storage)
                        session.commit()
                    except Exception as e:
                        log.info('%s', e)
                        session.rollback()
                        pass

    log.info('CSV data created: %s', csv_filename)


def main():
    '''Main program. Sets up logging & scrapes'''
    logging.basicConfig(stream=sys.stderr, level=logging.DEBUG,
                        format='%(name)s (%(levelname)s): %(message)s')

    scrape('http://www.chennaimetrowater.tn.nic.in/oldfirstday03.htm',
           os.path.join(_DIR, 'data/storage.csv'))


if __name__ == '__main__':
    sys.exit(main())
