export const siteSettingsSchema = {
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  fields: [
    {
      name: 'brandName',
      title: 'Brand Name',
      type: 'string',
      initialValue: 'Evoless',
    },
    {
      name: 'editorName',
      title: 'Editor Name',
      type: 'string',
      initialValue: 'Houssam Elmsafer',
    },
    {
      name: 'whatsappNumber',
      title: 'WhatsApp Number (Digits only)',
      type: 'string',
      initialValue: '212774288879',
    },
    {
      name: 'phone',
      title: 'Display Phone Number',
      type: 'string',
      initialValue: '+212 774-288879',
    },
    {
      name: 'contactEmail',
      title: 'Contact Email',
      type: 'string',
      initialValue: 'elmsaferhoussam@gmail.com',
    },
    {
      name: 'linkedInUrl',
      title: 'LinkedIn URL',
      type: 'url',
    },
    {
      name: 'instagramUrl',
      title: 'Instagram URL',
      type: 'url',
    },
  ],
};
