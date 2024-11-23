import React from 'react';
import '../css/OceanSunFish.css'; // CSS 파일 경로 유지
import fishImage from '../img/fish_left.png'; // 정확한 상대 경로로 파일 import

function OceanSunfish() {
    return <img src={fishImage} alt="Fish" className="ocean_sunfish" />;
}

export default OceanSunfish;
