<script lang="ts">
  import { todos } from '@stores';
  import TodoItem from './todoItem.svelte';
  import TodoCreate from './todoCreate.svelte';
  export let editable = false;
</script>

<div class="md:w-80">
  <h1
    class="mb-8 flex items-center justify-between border-b border-b-gray-700 text-2xl font-bold"
  >
    <span>Todos:</span>
    <span class="rounded-box p-2 text-neutral-content">
      <span class="countdown font-mono">
        <span style="--value:{$todos.data.length};" />
      </span>
    </span>
  </h1>

  <div class="flex flex-col gap-3">
    {#each $todos.data as todo (todo.id)}
      <TodoItem {todo} {editable} />
    {/each}

    {#if editable}
      <TodoCreate />
    {:else}
      <a href="/sign-up" class="btn w-48">Sign up to create or modify a todo</a>
    {/if}
  </div>
</div>
