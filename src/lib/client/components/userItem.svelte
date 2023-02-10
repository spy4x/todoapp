<script lang="ts">
  import type { User } from '@prisma/client';

  export let user: User;
</script>

<div data-e2e="user" class="flex items-center gap-2">
  <div class="avatar">
    <div
      class="h-12 w-12 rounded-full border-2 {user.isOnline
        ? 'border-success'
        : 'border-neutral'}"
    >
      <img src={user.photoURL || '/img/user.svg'} alt={user.username} />
    </div>
  </div>
  <span class="text-xl">{user.username}</span>
</div>
