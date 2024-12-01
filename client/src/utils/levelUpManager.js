/**
 * Calculate the level-up based on contributions and current level.
 * @param {number} currentLevel - The current level of the Sunfish.
 * @param {number} totalContributions - Total contributions made today.
 * @returns {object} Updated level and stage.
 */
export const calculateLevelUp = (currentLevel, totalContributions) => {
    // 하루 최대 레벨업 제한
    const maxLevelUp = 4;
    const levelUp = Math.min(maxLevelUp, totalContributions);

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
