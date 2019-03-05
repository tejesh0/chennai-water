import os
import csv
import logging
import gramex.data
import gramex.cache
from dateutil import parser
from datetime import datetime
from gramex.config import str_utf8
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy import Column, String, Integer, Date


logging.basicConfig(level=logging.INFO)
log = logging.getLogger(__file__)

# Merge all years files to single file
# Create direct schema of datasets obtained


DB_STRING = 'sqlite:///scraping/data/app.fov.db'

engine = gramex.data.create_engine(DB_STRING, encoding=str_utf8)

Session = sessionmaker(bind=engine)

Base = declarative_base()

session = Session()


class Rainfall(Base):
    __tablename__ = 'rainfall'

    date = Column(String, primary_key=True)
    unix_time = Column(Date, primary_key=True)
    rainfall = Column(Integer, primary_key=True)
    lake = Column(String, primary_key=True)

    def __init__(self, date, unix_time, rainfall, lake):
        self.date = date
        self.unix_time = unix_time
        self.rainfall = rainfall
        self.lake = lake

    def __repr__(self):
        return '%s - %s' % (self.unix_time, self.lake)


class Veeranam(Base):
    __tablename__ = 'veeranam'

    date = Column(String, primary_key=True)
    unix_time = Column(Date, primary_key=True)
    storage = Column(Integer, primary_key=True)
    inflow = Column(Integer, primary_key=True)
    lake = Column(String, primary_key=True, default="VEERANAM")
    discharge = Column(String, primary_key=True)

    def __init__(self, date, unix_time, storage, inflow, discharge):
        self.date = date
        self.unix_time = unix_time
        self.storage = storage
        self.inflow = inflow
        self.discharge = discharge

    def __repr__(self):
        return '%s - %s' % (self.unix_time, self.lake)


Base.metadata.create_all(engine)

_DIR = os.path.dirname(os.path.abspath(__file__))

with open(os.path.join(_DIR, 'scraping/data/ultimate_rainfall.csv'), mode='r') as csvfile:
    reader = csv.DictReader(csvfile)
    for dict_row in reader:
        for key, value in dict_row.items():
            if key not in ['DATE', 'UNIX_TIME', 'Year', 'Month']:
                date = datetime.fromtimestamp(float(dict_row['UNIX_TIME'])/1000)
                # print([dict_row['DATE'], date, value, key])
                rainfall = Rainfall(dict_row['DATE'], date, value, key)
                try:
                    session.add(rainfall)
                    session.commit()
                except Exception as e:
                    session.rollback()
                    log.info('%s', e)
                    pass

for year in range(14, 20):
    file_name = os.path.join(_DIR, 'scraping/data/veeranam' + str(year) + '.csv')
    with open(file_name, mode='r') as csvfile:
        reader = csv.DictReader(csvfile)
        reader = csv.DictReader(csvfile)
        for dict_row in reader:
            date = parser.parse(dict_row['DATE'])

            lake_veeranam = Veeranam(dict_row['DATE'],
                                     date,
                                     dict_row['Storage in Mcft'],
                                     dict_row['inflow in cusec'],
                                     dict_row['Discharge in cusec'])
            try:
                session.add(lake_veeranam)
                session.commit()
            except Exception as e:
                log.info('%s', e)
                session.rollback()
                pass

session.close()
