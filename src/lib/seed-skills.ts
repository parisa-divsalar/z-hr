import { db } from './db';

const SKILLS_BY_CATEGORY: Record<string, string[]> = {
    'Web Frameworks': ['ASP.NET Core', 'React', 'Angular', 'Vue.js', 'Node.js', 'Django', 'Flask', 'Spring Boot'],
    'Programming Languages': ['JavaScript', 'TypeScript', 'Python', 'Java', 'C#', 'C++', 'Go', 'Rust', 'PHP'],
    Database: ['MySQL', 'PostgreSQL', 'MongoDB', 'Redis', 'SQLite', 'SQL Server'],
    DevOps: ['CI/CD', 'Docker', 'Kubernetes', 'Terraform', 'GitHub Actions', 'Jenkins'],
    Other: ['Problem Solving', 'Communication', 'Teamwork', 'Leadership', 'Time Management'],
};

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

