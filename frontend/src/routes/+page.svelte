<script lang="ts">
  import type { PageData } from './$types';
  import CalendarGrid from '$lib/components/CalendarGrid.svelte';
  import { buildCalendar } from '$lib/utils.js';

  export let data: PageData;

  const calendar = buildCalendar(data.plan.days, new Date());
</script>

<svelte:head>
  <title>BabyMeal Planner</title>
</svelte:head>

<h1>BabyMeal Planner</h1>

<CalendarGrid {calendar} />

<style>
  h1 {
    font-size: var(--font-size-xl);
    margin-bottom: var(--spacing-lg);
  }
</style>
