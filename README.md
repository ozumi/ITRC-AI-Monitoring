# README #

### 개발 개요 ###

본 시스템은 ITRC(대한정보통신연구센터협의회) 에서 지원하는 AI(조류독감) 경로 파악을 위한 센서 개발 과제의 관제 모니터링 프로토타입입니다.
센서가 부착된 새의 이동경로, 센서 수집 시계열 데이터, 센서가 머문 시간에 따른 히트맵, 대한민국 매장/수질/공기 데이터, 이상치 센서 알림 등을 시각화하였습니다.

* 개발 기간 : 2017.11 ~ 2018.1
* 개발 인원 : 단독 개발
* 사용 스택 : python-Django, leaflet.js

### Dataset ###
조류 이동경로 데이터, 센서 데이터, 매장/수질/공기 데이터는 가상의 데이터입니다.

### 데모 영상 ###
![Demo1](https://user-images.githubusercontent.com/8486747/128534482-212b3933-8cfb-495a-be6d-2fb533c4817a.gif)

![Demo2](https://user-images.githubusercontent.com/8486747/128534507-2b0c8152-8813-411f-8690-f304849596b1.gif)

### How to Start ###
<pre>
<code>
pip3 install -r requirements.txt
python3 manage.py makemigrations
python3 manage.py migrate
python3 manage.py shell
    >>> from utils.sensor_import import data_migration
    >>> data_migration
python3 manage.py runserver 0.0.0.0:<port>
</pre>
</code>
