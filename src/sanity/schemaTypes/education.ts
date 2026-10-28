export const educationSchema = {
  name: 'education',
  title: 'Education & Training',
  type: 'document',
  fields: [
    {
      name: 'institution',
      title: 'Institution / Academy',
      type: 'string',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'programEn',
      title: 'Program / Degree (English)',
      type: 'string',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'programFr',
      title: 'Program / Degree (French)',
      type: 'string',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'period',
      title: 'Period (e.g., 10/2025 – 05/2026)',
      type: 'string',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'focusAreasEn',
      title: 'Focus Areas & Modules (English)',
      type: 'array',
      of: [{ type: 'string' }],
    },
    {
      name: 'focusAreasFr',
      title: 'Focus Areas & Modules (French)',
      type: 'array',
      of: [{ type: 'string' }],
    },
    {
      name: 'order',
      title: 'Display Order',
      type: 'number',
      initialValue: 1,
    },
  ],
};
