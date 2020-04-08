import pymysql

db = pymysql.connect(
    host='localhost',
    user='me',
    passwd='1234',
    db='mydb',
    charset='utf8'
)

cursor = db.cursor()
sql = 'select * from temps;'
cursor.execute(sql)
res = cursor.fetchall()
for x in res:
    print(x)
db.close()