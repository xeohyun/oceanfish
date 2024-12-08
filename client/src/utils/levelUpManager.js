/**
 * Calculate the level-up based on contributions and current level.
 * @param {number} currentLevel - The current level of the Sunfish.
 * @param {number} todayContributions - Contributions made today.
 * @param {number} lastLevelUpContributions - Contributions already counted for level-up.
 * @returns {object} Updated level and stage.
 */
export const calculateLevelUp = (currentLevel, todayContributions, lastLevelUpContributions) => {
    // 이미 레벨업에 반영된 기여도 제거
    const remainingContributions = todayContributions - lastLevelUpContributions;

    if (remainingContributions <= 0) {
        return {
            level: currentLevel,
            stage: getStage(currentLevel),
        };
    }

    // 하루 최대 레벨업 제한
    const maxLevelUp = 4;
    const levelUp = Math.min(maxLevelUp, remainingContributions);

    // 새로운 레벨 계산
    const updatedLevel = currentLevel + levelUp;

    // 단계(stage) 계산
    const getStage = (level) => {
        if (level >= 1 && level <= 3) {
            return 'dust';
        } else if (level >= 4 && level <= 10) {
            return 'baby';
        } else if (level >= 11 && level <= 30) {
            return 'adult';
        } else if (level >= 31 && level <= 50) {
            return 'king';
        }
        return 'dust'; // 기본값
    };

    return {
        level: updatedLevel,
        stage: getStage(updatedLevel),
    };
};
