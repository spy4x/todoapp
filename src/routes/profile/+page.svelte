<script lang="ts">
  import { auth } from '@stores';
</script>

<h1 class="title mb-4">Profile Page</h1>

<button on:click={auth.deleteUser($auth.user.id)} class="btn-primary btn-sm"
  >Delete Profile</button
>
