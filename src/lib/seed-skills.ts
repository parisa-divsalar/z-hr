import { db } from './db';
import { SKILLS_BY_CATEGORY } from './skills-catalog';

export function seedSkills() {
    try {
        const allSkills: any[] = [];

        Object.entries(SKILLS_BY_CATEGORY).forEach(([category, skills]) => {
            skills.forEach((skillName) => {
                allSkills.push({
                    name: skillName,
                    category,
                });
            });
        });

        db.skills.createMany(allSkills);
        return true;
    } catch (error) {
        console.error('Error seeding skills:', error);
        return false;
    }
}

if (require.main === module) {
    seedSkills();
}

