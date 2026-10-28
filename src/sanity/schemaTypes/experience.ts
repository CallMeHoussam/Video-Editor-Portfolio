export const experienceSchema = {
  name: 'experience',
  title: 'Work Experience',
  type: 'document',
  fields: [
    {
      name: 'company',
      title: 'Company / Organization',
      type: 'string',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'titleEn',
      title: 'Job Title (English)',
      type: 'string',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'titleFr',
      title: 'Job Title (French)',
      type: 'string',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'location',
      title: 'Location',
      type: 'string',
      initialValue: 'Casablanca, Morocco',
    },
    {
      name: 'period',
      title: 'Period (e.g., 07/2026 – Present)',
      type: 'string',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'responsibilitiesEn',
      title: 'Responsibilities & Projects (English)',
      type: 'array',
      of: [{ type: 'string' }],
    },
    {
      name: 'responsibilitiesFr',
      title: 'Responsibilities & Projects (French)',
      type: 'array',
      of: [{ type: 'string' }],
    },
    {
      name: 'verifiedAchievementEn',
      title: 'Verified Achievement (English)',
      type: 'string',
    },
    {
      name: 'verifiedAchievementFr',
      title: 'Verified Achievement (French)',
      type: 'string',
    },
    {
      name: 'order',
      title: 'Display Order',
      type: 'number',
      initialValue: 1,
    },
  ],
};
