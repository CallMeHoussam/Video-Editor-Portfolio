export const serviceSchema = {
  name: 'service',
  title: 'Service & Capability',
  type: 'document',
  fields: [
    {
      name: 'titleEn',
      title: 'Title (English)',
      type: 'string',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'titleFr',
      title: 'Title (French)',
      type: 'string',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'titleEn' },
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'taglineEn',
      title: 'Tagline (English)',
      type: 'string',
    },
    {
      name: 'taglineFr',
      title: 'Tagline (French)',
      type: 'string',
    },
    {
      name: 'descriptionEn',
      title: 'Description (English)',
      type: 'text',
      rows: 3,
    },
    {
      name: 'descriptionFr',
      title: 'Description (French)',
      type: 'text',
      rows: 3,
    },
    {
      name: 'deliverablesEn',
      title: 'Key Deliverables (English)',
      type: 'array',
      of: [{ type: 'string' }],
    },
    {
      name: 'deliverablesFr',
      title: 'Key Deliverables (French)',
      type: 'array',
      of: [{ type: 'string' }],
    },
    {
      name: 'tools',
      title: 'Tools Used',
      type: 'array',
      of: [{ type: 'string' }],
    },
    {
      name: 'highlightEn',
      title: 'Highlight Banner (English)',
      type: 'string',
    },
    {
      name: 'highlightFr',
      title: 'Highlight Banner (French)',
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
