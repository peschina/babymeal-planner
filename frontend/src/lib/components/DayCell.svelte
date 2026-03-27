<script lang="ts">
  import type { PlanDay } from '$lib/types.js';

  export let day: PlanDay;
  export let dateLabel: number; // actual day-of-month number to display
  export let isToday: boolean = false;
</script>

<a href="/day/{day.day}" class="day-cell" class:today={isToday} aria-label="Day {day.day}">
  <span class="day-number">{dateLabel}</span>
  <span class="meal-preview">{day.lunch.protein.name}</span>
  <span class="meal-preview">{day.dinner.protein.name}</span>
</a>

<style>
  .day-cell {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--spacing-xs);
    padding: var(--spacing-sm);
    min-height: 44px;
    min-width: 44px;
    border: 1px solid var(--color-border);
    border-radius: var(--radius-md);
    background: var(--color-surface);
    color: var(--color-text);
    transition: background 0.15s;
    cursor: pointer;
  }

  .day-cell:hover {
    background: var(--color-primary);
    color: #fff;
    border-color: var(--color-primary);
  }

  .today {
    border-color: var(--color-primary);
    border-width: 2px;
    background: color-mix(in srgb, var(--color-primary) 10%, white);
  }

  .day-number {
    font-weight: 700;
    font-size: var(--font-size-sm);
  }

  .meal-preview {
    font-size: 0.7rem;
    color: var(--color-text-muted);
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
