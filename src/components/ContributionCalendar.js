import React, { useEffect, useState } from 'react';
import '../css/ContributionCalendar.css';

function ContributionCalendar() {
    const [contributions, setContributions] = useState([]);

    useEffect(() => {
        async function fetchGitHubContributions() {
            const username = 'xeohyun'; // 자신의 GitHub 사용자 이름
            const token = process.env.REACT_APP_GITHUB_TOKEN;

            const response = await fetch(
                `https://api.github.com/users/${username}/events/public`,
                {
                    headers: {
                        Authorization: `token ${token}`, // Authorization 헤더 추가
                    },
                }
            );

            if (!response.ok) {
                console.error('Failed to fetch data', response.status);
                return;
            }

            const data = await response.json();

            const contributionMap = {};
            data.forEach((event) => {
                const date = event.created_at.split('T')[0];
                contributionMap[date] = (contributionMap[date] || 0) + 1; // 날짜별 커밋 수
            });

            const sortedData = Object.entries(contributionMap).map(([date, commits]) => ({
                date,
                commits: Math.min(commits, 4),
            }));

            setContributions(sortedData);
        }

        fetchGitHubContributions();
    }, []);

    return (
        <div className="contribution-calendar">
            <div className="calendar-grid">
                {contributions.map((day, index) => (
                    <div
                        key={index}
                        className={`day-cell level-${day.commits}`}
                        title={`${day.date}: ${day.commits} commits`}
                    ></div>
                ))}
            </div>
        </div>
    );
}

export default ContributionCalendar;
