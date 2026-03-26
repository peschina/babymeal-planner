<script lang="ts">
  import { page } from '$app/stores';
</script>

<svelte:head>
  <title>Error — BabyMeal Planner</title>
</svelte:head>

<div class="error-page">
  <h1>Something went wrong</h1>
  <p class="message">{$page.error?.message ?? 'An unexpected error occurred.'}</p>
  <a href="/" class="back-link">← Back to calendar</a>
</div>

<style>
  .error-page {
    text-align: center;
    padding: var(--spacing-xl);
  }

  h1 {
    font-size: var(--font-size-xl);
    margin-bottom: var(--spacing-md);
  }

  .message {
    color: var(--color-text-muted);
    margin-bottom: var(--spacing-lg);
  }

  .back-link {
    color: var(--color-primary);
    text-decoration: underline;
  }
</style>
