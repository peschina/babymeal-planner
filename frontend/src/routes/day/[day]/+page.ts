import type { PageLoad } from './$types';
import { error } from '@sveltejs/kit';

export const load: PageLoad = async ({ params, parent }) => {
  const day = parseInt(params.day, 10);
  if (isNaN(day) || day < 1 || day > 30) {
    error(404, `"${params.day}" is not a valid day (must be 1–30)`);
  }
  const { plan } = await parent();
  const planDay = plan.days[day - 1];
  return { planDay, day };
};
