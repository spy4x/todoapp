<script lang="ts">
  import { auth } from '@stores';
  import { goto } from '$app/navigation';
</script>

{#if $auth.user}
  <h1 class="title mb-4">Profile Page</h1>
  <button on:click={auth.deleteUser($auth.user.id)} class="btn-primary btn-sm"
    >Delete Profile</button
  >
{:else}
  <button on:click={() => goto('/')} class="btn-primary btn-sm"
    >Go to Homepage</button
  >
{/if}
