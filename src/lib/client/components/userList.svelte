<script lang="ts">
  import { users } from '@stores';
  import UserItem from './userItem.svelte';
</script>

<div class="md:w-80">
  <h1
    class="mb-8 flex items-center justify-between border-b border-b-gray-700 text-2xl font-bold "
  >
    Users:
    <span class="rounded-box p-2 text-neutral-content">
      <span class="countdown font-mono">
        <span style="--value:{$users.data.length};" />
      </span>
    </span>
  </h1>

  <div class="flex flex-col gap-3">
    {#each $users.data as user (user.id)}
      <UserItem {user} />
    {/each}
  </div>
</div>
