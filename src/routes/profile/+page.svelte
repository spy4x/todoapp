<script lang="ts">
  import { auth } from '@stores';
  import { goto } from '$app/navigation';

  let showNotification = false;

  const deleteUserHandler = (id: string) => {
    showNotification = true;

    setTimeout(() => {
      showNotification = false;
      auth.deleteUser(id);
    }, 3000);
  };
</script>

{#if $auth.user}
  <h1 class="title mb-4">Profile Page</h1>
  <button
    on:click={deleteUserHandler($auth.user?.id)}
    class="btn-primary btn-sm">Delete Profile</button
  >
{:else}
  <button on:click={() => goto('/')} class="btn-primary btn-sm"
    >Go to Homepage</button
  >
{/if}

{#if showNotification}
  <div class="toast-end toast-bottom toast">
    <div class="alert alert-success">
      <div>
        <span
          >{$auth.user?.username.toUpperCase()}'s profile deleted successfully!</span
        >
      </div>
    </div>
  </div>
{/if}
