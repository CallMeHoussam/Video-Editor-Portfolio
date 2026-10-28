export const skillGroupSchema = {
  name: 'skillGroup',
  title: 'Skill Group & Tools',
  type: 'document',
  fields: [
    {
      name: 'titleEn',
      title: 'Group Title (English)',
      type: 'string',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'titleFr',
      title: 'Group Title (French)',
      type: 'string',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'skills',
      title: 'Skills List',
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
