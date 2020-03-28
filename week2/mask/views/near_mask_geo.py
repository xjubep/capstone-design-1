import requests
import json
import folium
from folium import plugins
from apscheduler.schedulers.blocking import BlockingScheduler
import geocoder

col = {
    'plenty': 'green',
    'some': 'orange',
    'few': 'red',
    'empty': 'gray',
    'break': 'darkblue',
    'error': 'black'
}

amount = {
    'plenty': '100 ~',
    'some': '30 ~ 99',
    'few': '2 ~ 29',
    'empty': '0 ~ 1',
    'break': '판매 중지',
    'error': '정보 없음'
}

baseUrl = 'https://8oi9s0nnth.apigw.ntruss.com/corona19-masks/v1'
storeGeoUrl = baseUrl + '/storesByGeo/json'

lat = 37.5348945    # 조회하려는 위치의 위도
lng = 126.9016023   # 조회하려는 위치의 경도
dis = 5000          # 조회하려는 반경의 크기 (m)

url = storeGeoUrl + "?lat=" + str(lat) + "&lng=" + str(lng) + "&m=" + str(dis)
def job_function():
    req = requests.get(url)
    json_data = req.json()
    store_list = json_data["stores"]

    names = []
    addrs = []
    lats = []
    lngs = []
    stock_ats = []
    remain_stats = []
    created_ats = []

    for i in range(len(store_list)):
        if len(store_list[i]) != 9:
            continue

        if store_list[i]["name"] is None:
            names.append("name error")
        else:
            names.append(store_list[i]["name"])        

        if store_list[i]["addr"] is None:
            addrs.append("addr error")
        else:
            addrs.append(store_list[i]["addr"])
        
        if store_list[i]["lat"] is None:
            lats.append(0)
        else:
            lats.append(store_list[i]["lat"])    

        if store_list[i]["lng"] is None:        
            lngs.append(0)
        else:
            lngs.append(store_list[i]["lng"])    

        if store_list[i]["stock_at"] is None:
            stock_ats.append("NULL")
        else:
            stock_ats.append(store_list[i]["stock_at"][5:16]) 

        if store_list[i]["remain_stat"] is None:
            remain_stats.append("error")
        else:
            remain_stats.append(store_list[i]["remain_stat"])

        if store_list[i]["created_at"] is None:
            created_ats.append("NULL")
        else:
            created_ats.append(store_list[i]["created_at"][5:16])    

    mp = folium.Map((lat, lng), zoom_start = 13)

    plugins.LocateControl(
        drawCircle = False,
        strings = {
            "title": "현재위치"
        }
    ).add_to(mp)

    for i in range(len(lats)):
        folium.Circle(
            location = [lats[i], lngs[i]],
            popup = folium.Popup('<strong>' + names[i]+'</strong><br>'+
                                '마스크 수량: ' + amount[remain_stats[i]] + '<br>' +
                                '입고 시간: ' + stock_ats[i] + '<br>' +
                                '업데이트 시간: ' + created_ats[i], 
                                max_width = 300),
            radius = 20,
            color = col[remain_stats[i]],
            fill_color = col[remain_stats[i]]       
        ).add_to(mp)

    mp.save("./near_mask_by_geo.html")

sched = BlockingScheduler()
sched.add_job(job_function, 'interval', minutes=10)
sched.start()