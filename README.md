#  RIDEWAVE PROJECT <span style="font-size:120px">:bus:</span>
## 10/19/2024 ~ 10/20/2024
## 1. Introduction
### Purpose
* This project aims to develop a web-based shared bus service for individuals in rural or underserved areas who face transportation challenges due to the lack of public transit options.
### Goal
* In this service, users input their departure and destination locations and specify their maximum wait time. 
* The system then optimizes routes by coordinating with other users' requests, minimizing wait times, and calculating the most efficient routes to ensure effective bus operations.

## 2. Algorithm

**Active Request Check:** Periodically checks all active ride requests.

**Request Grouping:** Groups requests based on proximity and travel direction using spatial indexing.

**Route Generation:** Creates possible pickup and drop-off routes, ensuring the pickup-before-drop-off rule is followed.

**Efficiency Calculation:** Uses Google Maps API to calculate travel time and distance for each route.

**Route Selection:** Selects the most efficient route and assigns it to an available bus, considering capacity and current location.

**Real-Time Updates:** Updates routes based on new requests and changes in bus location.

## 3. Calculation Method

**Wait Time Calculation:** Calculates how long the user has been waiting since the request was submitted. The longer the wait, the higher the priority.

**Max Wait Time Consideration:** Takes into account the maximum wait time specified by the user. Requests with shorter maximum wait times are prioritized.

**Route Efficiency Impact:** Evaluates how much the request affects overall route efficiency. Requests that don't significantly reduce efficiency are prioritized.

**Travel Distance:** Considers the total travel distance between the pickup and drop-off points. Shorter distances are given higher priority.

**Final Efficiency Score:** Combines all these factors into a final efficiency score, which is used to determine the priority of each request.

</div>

## 4. Installation

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.


<div align="center">

## Registration

![Registration Box](your-image-path)

</div>

<div align="center">

## Home

![Registration Box](your-image-path)

</div>


<div align="center">

## Queue

![Loading Box](your-image-path)

</div>

## Implemented Functions

- **Redux-toolkit을 이용하여 전역 상태관리**
- **Firebase Authentication을 이용해 로그인, 회원가입 구현**
- **PrivateRoute를 통해 로그인상태에 따라 Route 지정**
- **Firestore를 이용해 예매 정보 저장 후 아이디 마다 티켓정보 저장**
- **use-http (custom hook)을 이용하여 fetch해서 data받아오는 코드 재사용성있게 구현**
- **Styled-Component - ThemeProvider를 이용해 주요 색상 및 폰트 크기 변수로 만들어 사용**
