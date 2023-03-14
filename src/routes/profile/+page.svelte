<script lang="ts">
  import { auth } from '@stores';
</script>

<h1 class="title mb-4">Profile Page</h1>

<form action="?/deleteUser&id={$auth.user.id}" method="POST">
  <button type="submit" class="btn-primary btn-sm">Delete Profile</button>
</form>
