<script lang="ts">
  import type { PageData } from './$types';

  export let data: PageData;
</script>

<svelte:head>
  <title>BabyMeal Planner</title>
</svelte:head>

<h1>BabyMeal Planner</h1>
<p class="subtitle">30-day meal plan — {data.plan.totalDays} days generated</p>

<section class="calendar">
  {#each data.plan.days as day}
    <a href="/day/{day.day}" class="day-cell">
      <span class="day-number">{day.day}</span>
      <span class="meal-preview">{day.lunch.protein.name}</span>
    </a>
  {/each}
</section>

<style>
  h1 {
    font-size: var(--font-size-xl);
    margin-bottom: var(--spacing-sm);
  }

  .subtitle {
    color: var(--color-text-muted);
    margin-bottom: var(--spacing-lg);
  }

  .calendar {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
    gap: var(--spacing-sm);
  }

  .day-cell {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: var(--spacing-sm);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-md);
    background: var(--color-surface);
    transition: background 0.15s;
    cursor: pointer;
  }

  .day-cell:hover {
    background: var(--color-primary);
    color: #fff;
    border-color: var(--color-primary);
  }

  .day-number {
    font-weight: 600;
    font-size: var(--font-size-sm);
  }

  .meal-preview {
    font-size: 0.75rem;
    color: var(--color-text-muted);
    margin-top: var(--spacing-xs);
    text-align: center;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    max-width: 100%;
  }

  .day-cell:hover .meal-preview {
    color: rgba(255, 255, 255, 0.85);
  }
</style>
