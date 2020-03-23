import time
import random
import requests

url = 'https://api.thingspeak.com/update?api_key=2R75FHMHYXQH6ELZ&field1='
for i in range(10):
    value = random.randint(1, 100)
    r = requests.get(url + str(value))
    r.encoding = 'utf8'
    print(r.text)
    time.sleep(20)  # 15s 이내에 업데이트 두 번하면 에러 발생
                    # https://community.thingspeak.com/forum/thingspeak-api/return-value0/