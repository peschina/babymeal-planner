<script lang="ts">
  import '../app.css';
  import type { LayoutData } from './$types';

  export let data: LayoutData;
</script>

<header>
  <a href="/" class="brand">BabyMeal Planner</a>
</header>

<main>
  <slot />
</main>

<style>
  header {
    display: flex;
    align-items: center;
    padding: var(--spacing-md) var(--spacing-lg);
    background-color: var(--color-primary);
    color: #fff;
  }

  .brand {
    font-size: var(--font-size-lg);
    font-weight: 700;
    color: #fff;
  }

  main {
    padding: var(--spacing-lg);
    max-width: 960px;
    margin: 0 auto;
  }
</style>
