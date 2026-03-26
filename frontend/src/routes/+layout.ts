import type { LayoutLoad } from './$types';
import { getPlan } from '$lib/api';

export const load: LayoutLoad = async ({ fetch }) => {
  const plan = await getPlan(fetch);
  return { plan };
};
