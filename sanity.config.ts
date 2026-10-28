import { schemaTypes } from './src/sanity/schemaTypes';

export default {
  name: 'default',
  title: 'Evoless Video Portfolio Studio',
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'dummy-project-id',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  schema: {
    types: schemaTypes,
  },
};
