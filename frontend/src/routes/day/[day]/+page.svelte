<script lang="ts">
  import type { PageData } from './$types';
  import MealCard from '$lib/components/MealCard.svelte';

  export let data: PageData;
</script>

<svelte:head>
  <title>Giorno {data.day} — BabyMeal Planner</title>
</svelte:head>

<div class="day-detail">
  <a href="/" class="back-link">← Calendario</a>
  <h1 class="day-title">Giorno {data.day}</h1>
  <div class="meals">
    <MealCard meal={data.planDay.lunch} label="Pranzo" />
    <MealCard meal={data.planDay.dinner} label="Cena" />
  </div>
</div>

<style>
  .day-detail {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-lg);
  }

  .back-link {
    color: var(--color-primary);
    font-size: var(--font-size-sm);
    align-self: flex-start;
  }

  .back-link:hover {
    text-decoration: underline;
  }

  .day-title {
    font-size: var(--font-size-xl);
  }

  .meals {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-lg);
  }

  @media (min-width: 600px) {
    .meals {
      flex-direction: row;
    }

    .meals > :global(*) {
      flex: 1;
    }
  }
</style>
