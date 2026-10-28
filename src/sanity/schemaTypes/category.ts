export const categorySchema = {
  name: 'category',
  title: 'Category',
  type: 'document',
  fields: [
    {
      name: 'nameEn',
      title: 'Category Name (English)',
      type: 'string',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'nameFr',
      title: 'Category Name (French)',
      type: 'string',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'nameEn' },
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'order',
      title: 'Sort Order',
      type: 'number',
    },
  ],
};
