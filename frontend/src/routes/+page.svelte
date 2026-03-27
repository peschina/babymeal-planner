<script lang="ts">
  import type { PageData } from './$types';
  import CalendarGrid from '$lib/components/CalendarGrid.svelte';

  export let data: PageData;
</script>

<svelte:head>
  <title>BabyMeal Planner</title>
</svelte:head>

<h1>BabyMeal Planner</h1>
<p class="subtitle">Piano pasti 30 giorni</p>

<CalendarGrid days={data.plan.days} today={1} />

<style>
  h1 {
    font-size: var(--font-size-xl);
    margin-bottom: var(--spacing-sm);
  }

  .subtitle {
    color: var(--color-text-muted);
    margin-bottom: var(--spacing-lg);
  }


</style>
