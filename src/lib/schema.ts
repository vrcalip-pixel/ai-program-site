// JSON-LD builders. Every value comes from program.json or a course file, so the structured data
// can never say something the visible page does not. Rendered by Base.astro (the `jsonLd` prop).
import program from '../data/program.json';

type Course = {
  id: string;
  data: { number: string; title: string; description: string; catalogDescription: string; units: number; formerly: string; capstone?: boolean };
};

const site = () => (import.meta.env.SITE || 'https://aifordigitaltransformation.org').replace(/\/$/, '');
const abs = (path: string) => site() + (path.startsWith('/') ? path : `/${path}`);

export const college = () => ({
  '@type': 'CollegeOrUniversity',
  '@id': program.collegeUrl,
  name: program.college,
  url: program.collegeUrl,
});

export const website = () => ({
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': abs('/#website'),
  name: program.name,
  alternateName: program.degree,
  url: abs('/'),
  inLanguage: 'en',
});

export const courseSchema = (c: Course, opts: { context?: boolean } = { context: true }) => ({
  ...(opts.context ? { '@context': 'https://schema.org' } : {}),
  '@type': 'Course',
  '@id': abs(`/courses/${c.id}`),
  url: abs(`/courses/${c.id}`),
  name: c.data.title,
  courseCode: c.data.number,
  alternateName: `${c.data.number} (formerly ${c.data.formerly})`,
  description: c.data.catalogDescription,
  provider: college(),
  isPartOf: { '@id': abs('/pathway#program') },
  numberOfCredits: { '@type': 'StructuredValue', value: c.data.units, unitText: 'semester units' },
  educationalLevel: 'Undergraduate',
  inLanguage: 'en',
});

export const programSchema = (courses: Course[]) => ({
  '@context': 'https://schema.org',
  '@type': 'EducationalOccupationalProgram',
  '@id': abs('/pathway#program'),
  name: program.degree,
  url: abs('/pathway'),
  provider: college(),
  programType: 'Associate degree',
  educationalCredentialAwarded: program.ladder.map(r => ({
    '@type': 'EducationalOccupationalCredential',
    name: `${r.name} (${r.kind}, ${r.units} units)`,
    credentialCategory: r.kind,
    description: `${r.status}. ${r.summary}`,
    url: abs(`/pathway#${r.id}`),
  })),
  hasCourse: courses.map(c => courseSchema(c, { context: false })),
  inLanguage: 'en',
});

export const breadcrumbs = (items: { name: string; path: string }[]) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [{ name: program.name, path: '/' }, ...items].map((it, i) => ({
    '@type': 'ListItem',
    position: i + 1,
    name: it.name,
    item: abs(it.path),
  })),
});
