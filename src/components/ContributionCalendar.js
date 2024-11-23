import React, { useEffect, useState } from 'react';
import '../css/ContributionCalendar.css';
import { CONTRIBUTION_QUERY } from '../queries/githubQueries';

function ContributionCalendar() {
    const [contributions, setContributions] = useState([]); // 기여 데이터
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
                console.log('GraphQL API Response:', responseData);

                const weeks =
                    responseData.data.user.contributionsCollection.contributionCalendar.weeks;

                if (!weeks || weeks.length === 0) {
                    throw new Error('No contribution data available');
                }

                // 주 단위 데이터를 평탄화하여 모든 날짜 데이터로 변환
                const contributionDays = weeks.flatMap((week) =>
                    week.contributionDays.map((day) => ({
                        date: day.date,
                        commits: day.contributionCount,
                        level: (() => {
                            const count = day.contributionCount;
                            if (count === 0) return 0;
                            if (count <= 3) return 1;
                            if (count <= 9) return 2;
                            if (count <= 19) return 3;
                            return 4;
                        })(),
                    }))
                );

                console.log('Parsed Contribution Days:', contributionDays);
                setContributions(contributionDays);
            } catch (err) {
                console.error('Error fetching contributions:', err.message);
                setError(err.message);
            }
        }

        fetchGitHubContributions();
    }, []);

    // 데이터를 주 단위로 분리
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
                <div className="calendar-grid">
                    {weeks.map((week, weekIndex) => (
                        <div key={weekIndex} className="week-column">
                            {week.map((day, dayIndex) => (
                                <div
                                    key={dayIndex}
                                    className={`day-cell level-${day.level}`} // `level-X` 클래스를 추가
                                    title={`${day.date}: ${day.commits || 0} contributions`}
                                ></div>
                            ))}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default ContributionCalendar;
