import requests
import json
import folium
from folium import plugins
from apscheduler.schedulers.blocking import BlockingScheduler

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
storeAddrUrl = baseUrl + '/storesByAddr/json'

seoul = "서울특별시 "
input_addr = [
    "종로구", "중구", "용산구", "성동구", "광진구", "동대문구", "중랑구",
    "성북구", "강북구", "도봉구", "노원구", "은평구", "서대문구", "마포구",
    "양천구", "강서구", "구로구", "영등포구", "동작구", "관악구", "서초구",
    "강남구", "송파구", "강동구"
    ]

def job_function():
    names = []
    addrs = []
    lats = []
    lngs = []
    stock_ats = []
    remain_stats = []
    created_ats = []

    for idx in range(len(input_addr)):
        url = storeAddrUrl + "?address=" + seoul + input_addr[idx]
        req = requests.get(url)
        json_data = req.json()
        store_list = json_data["stores"]

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

        mp = folium.Map((37.566655, 126.978454), zoom_start = 13)

        plugins.LocateControl(
            drawCircle = False,
            strings = {
                "title": "현재위치"
            }
        ).add_to(mp)

        for i in range(len(lats)):
            if remain_stats[i] == 'error' or remain_stats[i] == 'break':
                continue
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

        mp.save("./near_mask_by_addr.html")

sched = BlockingScheduler()
sched.add_job(job_function, 'interval', minutes=30)
sched.start()