import React, { useEffect, useState } from 'react';
import '../css/ContributionCalendar.css';
import { CONTRIBUTION_QUERY } from '../queries/githubQueries';

function ContributionCalendar() {
    const [contributions, setContributions] = useState([]); // 기여 데이터
    const [months, setMonths] = useState([]); // 월 데이터
    const [error, setError] = useState(null); // 에러 상태
    const username = 'xeohyun';
    const token = process.env.REACT_APP_GITHUB_TOKEN;

    useEffect(() => {
        async function fetchGitHubContributions() {
            try {
                const response = await fetch('https://api.github.com/graphql', {
                    method: 'POST',
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        query: CONTRIBUTION_QUERY,
                        variables: { username },
                    }),
                });

                if (!response.ok) {
                    throw new Error(`Failed to fetch: ${response.status}`);
                }

                const responseData = await response.json();
                const weeks =
                    responseData.data.user.contributionsCollection.contributionCalendar.weeks;

                // 1차원 배열로 평탄화 및 월별 데이터 생성
                const contributionDays = weeks.flatMap((week) =>
                    week.contributionDays.map((day) => ({
                        date: day.date,
                        commits: day.contributionCount,
                        color: day.color,
                    }))
                );

                // 월별 데이터 생성
                const uniqueMonths = Array.from(
                    new Set(contributionDays.map((day) => new Date(day.date).getMonth()))
                ).map((month) => new Date(0, month).toLocaleString('en', { month: 'short' })); // 월 이름

                setMonths(uniqueMonths);
                setContributions(contributionDays);
            } catch (err) {
                console.error("Error fetching contributions:", err.message);
                setError(err.message);
            }
        }

        fetchGitHubContributions();
    }, []);

    // 데이터를 주(week) 단위로 분리
    const weeks = Array.from({ length: 53 }, (_, weekIndex) =>
        contributions.slice(weekIndex * 7, weekIndex * 7 + 7)
    );

    return (
        <div className="contribution-calendar">
            {error ? (
                <div className="error-message">
                    <p>Failed to load contributions: {error}</p>
                </div>
            ) : (
                <>
                    {/* 기여도 캘린더 */}
                    <div className="calendar-grid">
                        {weeks.map((week, weekIndex) => (
                            <div key={weekIndex} className="week-column">
                                {week.map((day, dayIndex) => (
                                    <div
                                        key={dayIndex}
                                        className="day-cell"
                                        title={`${day.date}: ${day.commits || 0} contributions`}
                                        style={{
                                            backgroundColor: day.color || 'rgba(235, 237, 240, 0.5)', // 기본 반투명 색상
                                            opacity: day.commits === 0 ? 0.5 : 1, // 기여도가 없으면 반투명 처리
                                        }}
                                    ></div>
                                ))}
                            </div>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}

export default ContributionCalendar;
