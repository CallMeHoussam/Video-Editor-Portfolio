import { projectSchema } from './project';
import { categorySchema } from './category';
import { serviceSchema } from './service';
import { experienceSchema } from './experience';
import { educationSchema } from './education';
import { skillGroupSchema } from './skillGroup';
import { siteSettingsSchema } from './siteSettings';

export const schemaTypes = [
  projectSchema,
  categorySchema,
  serviceSchema,
  experienceSchema,
  educationSchema,
  skillGroupSchema,
  siteSettingsSchema,
];
