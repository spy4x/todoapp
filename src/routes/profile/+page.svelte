<script lang="ts">
  import { auth } from '@stores';
  import { goto } from '$app/navigation';

  let showNotification = false;
  let profileDeleted = false;

  const deleteUserHandler = (id: string) => {
    showNotification = true;
    setTimeout(() => {
      showNotification = false;
      auth.deleteUser(id);
      profileDeleted = true;
    }, 3000);
  };

  $: if (profileDeleted) {
    setTimeout(() => {
      profileDeleted = false;
    }, 3000);
  }
</script>

{#if $auth.user}
  <h1 class="title mb-4">Profile Page</h1>
  <label for="my-modal" class="btn-primary btn-sm px-4 py-2"
    >Delete Profile</label
  >
  <input type="checkbox" id="my-modal" class="modal-toggle" />
  <div class="modal">
    <div class="modal-box">
      <h3 class="text-lg font-bold">Delete Profile</h3>
      <p class="py-4">
        Are you sure you want to delete your profile? <br />This action cannot
        be undone.
      </p>
      <div class="modal-action">
        <label
          on:click={deleteUserHandler($auth.user?.id)}
          for="my-modal"
          aria-hidden="true"
          class="btn">Yes, I'm sure!</label
        >
      </div>
    </div>
  </div>
{:else}
  <button on:click={() => goto('/')} class="btn-primary btn-sm"
    >Go to Homepage</button
  >
{/if}

{#if showNotification}
  <div class="toast-end toast-bottom toast">
    <div class="alert alert-info">
      <div>
        <span>Deleting {$auth.user?.username}'s profile...</span>
      </div>
    </div>
  </div>
{/if}

{#if profileDeleted}
  <div class="toast-end toast-bottom toast">
    <div class="alert alert-success">
      <div>
        <span>Profile deleted successfully!</span>
      </div>
    </div>
  </div>
{/if}
