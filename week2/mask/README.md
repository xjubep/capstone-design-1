<h2>공적 마스크 판매 현황 조회 api (data.go.kr)</h2>

<p>
기존의 GET/POST 실습 과제로 만든 server.js을 수정함<br>
express에서 html 파일 load를 위해 ejs 모듈 사용
</p>

<p>
'/mask_geo'<br>
당산역 주변 5km 이내의 마스크 판매 현황을 지도에 표시 (storesByGeo/json)<br>
10분 단위로 업데이트 (apscheduler)
</p>

<p>
'/mask_addr'<br>
서울시 전체의 마스크 판매 현황을 지도에 표시 (storesByAddr/json)<br>
재고 정보가 '판매 중지'이거나 '정보 없음'인 경우는 표시하지 않음<br>
30분 단위로 업데이트 (apscheduler)
</p>
