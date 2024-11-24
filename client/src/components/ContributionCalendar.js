import React, { useEffect, useState } from 'react';
import '../css/ContributionCalendar.css';

function ContributionCalendar() {
    const [contributions, setContributions] = useState([]); // 초기값
    const [loading, setLoading] = useState(true); // 로딩 상태
    const [error, setError] = useState(null); // 에러 상태

    useEffect(() => {
        async function fetchBackendContributions() {
            try {
                const response = await fetch('http://127.0.0.1:8000/api/contributions/'); // 백엔드 API URL
                if (!response.ok) {
                    throw new Error(`Failed to fetch: ${response.status}`);
                }

                const data = await response.json();

                // 기여 데이터를 레벨 계산
                const processedData = data.map((day) => ({
                    date: day.date,
                    count: day.count,
                    level: calculateLevel(day.count), // 기여도에 따라 레벨 설정
                }));

                setContributions(processedData); // 가공된 데이터 저장
                setLoading(false); // 로딩 완료
            } catch (err) {
                console.error('Error fetching contributions:', err.message);
                setError(err.message);
                setLoading(false); // 로딩 완료
            }
        }

        fetchBackendContributions();
    }, []);

    // 기여도에 따라 레벨 계산
    const calculateLevel = (count) => {
        if (count === 0) return 0;
        if (count <= 3) return 1;
        if (count <= 9) return 2;
        if (count <= 19) return 3;
        return 4;
    };

    if (loading) {
        return <div>Loading contributions...</div>;
    }

    if (error) {
        return (
            <div className="error-message">
                <p>Failed to load contributions: {error}</p>
            </div>
        );
    }

    // 데이터를 7일씩 묶어서 주 단위로 처리
    const weeks = [];
    for (let i = 0; i < contributions.length; i += 7) {
        weeks.push(contributions.slice(i, i + 7));
    }

    // 주는 오른쪽에서 왼쪽으로 정렬, 각 주의 날짜는 시간 순으로 위에서 아래로 정렬
    const reversedWeeks = weeks.reverse();

    return (
        <div className="contribution-calendar">
            <div className="calendar-grid">
                {reversedWeeks.map((week, weekIndex) => (
                    <div key={weekIndex} className="week-column">
                        {week.map((day, dayIndex) => (
                            <div
                                key={dayIndex}
                                className={`day-cell level-${day.level}`} // `level-X` 클래스 추가
                                title={`${day.date}: ${day.count || 0} contributions`}
                            ></div>
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default ContributionCalendar;
