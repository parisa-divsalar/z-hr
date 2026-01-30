/**
 * نوع آیتم دوره در Learning Hub.
 * با ساختار ذخیره در DB (learning_hub_courses) و نمایش در SkillGapCard هماهنگ است.
 */
export type LearningHubCourse = {
  id: number;
  title: string;
  level: string; // "Junior" | "Mid-level" | "Mid-senior" | "Senior"
  price: string; // e.g. "$20" or "Free"
  isFree: boolean;
  source?: string; // e.g. "Udemy", "YouTube"
  source_url?: string; // لینک به دوره (برای dedup در addMany)
  sourceUrl?: string;
  description?: string;
  image_url?: string;
  imageUrl?: string;
  created_at?: string;
  updated_at?: string;
};
