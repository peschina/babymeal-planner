<script lang="ts">
  import type { Meal } from '$lib/types.js';

  export let meal: Meal;
  export let label: string;
</script>

<article class="meal-card">
  <h2 class="meal-label">{label}</h2>
  <ul class="ingredient-list">
    <li class="ingredient">
      <span class="ingredient-name">{meal.protein.name}</span>
      <span class="ingredient-qty">{meal.protein.quantityG}g</span>
    </li>
    <li class="ingredient">
      <span class="ingredient-name">{meal.cereal.name}</span>
      <span class="ingredient-qty">{meal.cereal.quantityG}g</span>
    </li>
    {#each meal.vegetables as veg}
      <li class="ingredient">
        <span class="ingredient-name">{veg.name}</span>
        <span class="ingredient-qty">{veg.quantityG}g</span>
      </li>
    {/each}
    <li class="ingredient">
      <span class="ingredient-name">Olio d'oliva</span>
      <span class="ingredient-qty">{meal.oliveOil.quantityG}g</span>
    </li>
    <li class="ingredient">
      <span class="ingredient-name">Brodo</span>
      <span class="ingredient-qty">{meal.broth.quantityMl}ml</span>
    </li>
  </ul>
</article>

<style>
  .meal-card {
    background: var(--color-surface);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-lg);
    padding: var(--spacing-lg);
  }

  .meal-label {
    font-size: var(--font-size-lg);
    color: var(--color-primary);
    margin-bottom: var(--spacing-md);
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .ingredient-list {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: var(--spacing-sm);
  }

  .ingredient {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: var(--spacing-xs) 0;
    border-bottom: 1px solid var(--color-border);
  }

  .ingredient:last-child {
    border-bottom: none;
  }

  .ingredient-name {
    color: var(--color-text);
  }

  .ingredient-qty {
    font-weight: 600;
    color: var(--color-text-muted);
    font-size: var(--font-size-sm);
  }
</style>
