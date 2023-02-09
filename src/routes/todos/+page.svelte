<script lang="ts">
  import { todos } from '../../lib/client/todos';
</script>

<h1 class="text-2xl font-bold">Todos:</h1>

{#each $todos.data as todo}
  <div>{todo.title}</div>
{/each}
