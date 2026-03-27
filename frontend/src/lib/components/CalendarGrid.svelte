<script lang="ts">
  import type { PlanDay } from '$lib/types.js';
  import DayCell from './DayCell.svelte';

  export let days: PlanDay[];
  export let today: number = 1;
</script>

<div class="calendar-grid" role="grid" aria-label="30-day meal calendar">
  {#each days as day (day.day)}
    <DayCell {day} isToday={day.day === today} />
  {/each}
</div>

<style>
  .calendar-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(88px, 1fr));
    gap: var(--spacing-sm);
  }
</style>
