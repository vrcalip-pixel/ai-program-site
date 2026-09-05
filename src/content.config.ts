import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// Course pages live in src/content/courses/*.md. Edit the Markdown; the template
// in src/pages/courses/[slug].astro renders it. Frontmatter fields are validated here.
const courses = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/courses' }),
  schema: z.object({
    order: z.number(),
    number: z.string(),               // "AI 40"
    formerly: z.string(),             // "COSA 55" — shown only as "Formerly COSA nn"
    title: z.string(),
    tagline: z.string(),              // one line, used in prev/next and the facts panel
    description: z.string(),          // meta description
    units: z.number().default(3),
    hours: z.string().default('54 lecture'),
    maxStudents: z.number().default(40),
    prerequisites: z.string().default('None'),
    recommendedPreparation: z.string().default('None'),
    recommendedPreparationConfirmed: z.boolean().default(true),
    grading: z.string().default('Student choice'),
    transfer: z.string().default('CSU'),
    capstone: z.boolean().default(false),
    countsToward: z.object({ id: z.string(), name: z.string() }),
    catalogDescription: z.string(),
    outcomes: z.array(z.string()),
    build: z.array(z.object({ title: z.string(), detail: z.string() })).length(3),
    tools: z.array(z.string()),
    toolsConfirmed: z.boolean().default(false),
    video: z.boolean().default(false), // set true once /public/video/<slug>.mp4, .webm and .jpg exist
  }),
});

export const collections = { courses };
