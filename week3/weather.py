import requests
import json
import datetime
import pymysql
from apscheduler.schedulers.blocking import BlockingScheduler

base_url = 'http://api.openweathermap.org/data/2.5/weather?appid='
API_key = 'd4926f1a80a64ede994d8566857f5b75'
url = base_url + API_key
url += '&q=seoul'
url += '&units=metric'  # default: Kelvin -> Celsius

def job_function():
    db = pymysql.connect(
        host='localhost',
        user='me',
        passwd='1234',
        db='mydb',
        charset='utf8'
    )

    res = requests.get(url)
    json_data = res.json()

    KST = datetime.timezone(datetime.timedelta(hours=9))
    now = datetime.datetime.now(KST)
    now_fmt = now.strftime('%Y-%m-%d %H:%M')

    temp = json_data['main']['temp']
    feels_like = json_data['main']['feels_like']

    cursor = db.cursor()
    sql = '''
        insert into weather(time, temp, feels)
        values (%s, %s, %s);
        '''
    cursor.execute(sql, (now_fmt, temp, feels_like))
    db.commit()
    db.close()

sched = BlockingScheduler()
sched.add_job(job_function, 'interval', minutes=10)
sched.start()