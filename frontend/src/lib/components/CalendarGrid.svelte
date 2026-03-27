<script lang="ts">
  import type { CalendarData } from '$lib/utils.js';
  import DayCell from './DayCell.svelte';

  export let calendar: CalendarData;
</script>

<div class="calendar-wrapper">
  <h2 class="calendar-title">{calendar.title}</h2>

  <div class="calendar" role="grid" aria-label="Piano pasti mensile">
    <!-- Weekday header row -->
    <div class="week-row header-row" role="row">
      {#each calendar.weekdayLabels as label}
        <div class="weekday-label" role="columnheader">{label}</div>
      {/each}
    </div>

    <!-- Week rows -->
    {#each calendar.weeks as week}
      {#if week.monthLabel}
        <div class="month-label" aria-hidden="true">{week.monthLabel}</div>
      {/if}
      <div class="week-row" role="row">
        {#each week.cells as cell}
          {#if cell === null}
            <div class="empty-cell" role="gridcell" aria-hidden="true"></div>
          {:else if cell.planDay === null}
            <div class="day-cell inactive" role="gridcell" aria-hidden="true">
              <span class="day-number">{cell.dayOfMonth}</span>
            </div>
          {:else}
            <DayCell day={cell.planDay} dateLabel={cell.dayOfMonth} isToday={cell.isToday} />
          {/if}
        {/each}
      </div>
    {/each}
  </div>
</div>

<style>
  .calendar-wrapper {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-md);
  }

  .calendar-title {
    font-size: var(--font-size-lg);
    color: var(--color-text-muted);
    font-weight: 600;
  }

  .calendar {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  .week-row {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    gap: 4px;
  }

  .header-row {
    margin-bottom: var(--spacing-xs);
  }

  .weekday-label {
    text-align: center;
    font-size: 0.75rem;
    font-weight: 700;
    color: var(--color-text-muted);
    padding: var(--spacing-xs) 0;
    text-transform: uppercase;
    letter-spacing: 0.04em;
  }

  .month-label {
    font-size: 0.75rem;
    font-weight: 600;
    color: var(--color-primary);
    padding: var(--spacing-xs) 0;
    margin-top: var(--spacing-sm);
    text-transform: uppercase;
    letter-spacing: 0.04em;
  }

  .empty-cell {
    min-height: 44px;
    min-width: 44px;
  }

  .day-cell.inactive {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 44px;
    min-width: 44px;
    border-radius: var(--radius-md);
    background: transparent;
    opacity: 0.3;
  }

  .day-number {
    font-size: var(--font-size-sm);
    color: var(--color-text-muted);
  }
</style>

