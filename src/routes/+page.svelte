<script lang="ts">
  import "../app.css";
  import type { PageData } from "./$types";
  import { enhance } from "$app/forms";

  export let data: PageData;
  export let form;
</script>

<form method="POST" action="?/signIn" use:enhance class="flex flex-col gap-3 max-w-xs">
  <input type="username" name="username" placeholder="Username" class="input input-bordered w-full max-w-xs" />
  <input type="password" name="password" placeholder="Password" class="input input-bordered w-full max-w-xs" />
  <div class="flex gap-3 justify-end">
    <button type="submit" class="btn">Sign in</button>
    <button formaction="?/signUp" class="btn btn-primary">Sign up</button>
  </div>
  {#if data?.userId}
    <button formaction="?/signOut" class="btn">Sign out</button>
  {/if}
  {#if form?.error}
    <div class="text-red-500">{form.error.message}</div>
  {/if}
</form>