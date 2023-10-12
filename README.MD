2023.08.04 : 1.인스타크론 백엔드 셋업
nodemon - > 실시간 수정사항 변경해서 업로드 해주는거 (만약 nodemon 설치 하지 않으면 변경사항 서버에 변화 x)
type : module을 바꾸는 이유는 nodemon이 import로 바꾼걸 알지 못해서 type을 설정해주는 것 -> 이런거 하지 않을려고 바벨을 설치
바벨은 모든 것을 최신 코드로 변화해 줄 거임
3.3 Prisma를 통해 graphQl 영화 api만듬
2.babel 설치 node 버전이 사람마다 다르기 때문에 type: module 대신 babel을 이용 3.
