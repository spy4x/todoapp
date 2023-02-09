<script lang="ts">
  import '../app.css';
  import { auth } from '../lib/client/auth';

  let username = '';
  let password = '';
</script>

{#if $auth.userId}
  <button type="button" class="btn" on:click={() => auth.signOut()}
    >Sign out</button
  >
{:else}
  <form class="flex max-w-xs flex-col gap-3">
    <input
      name="username"
      bind:value={username}
      placeholder="Username"
      class="input-bordered input w-full max-w-xs"
    />
    <input
      type="password"
      name="password"
      bind:value={password}
      placeholder="Password"
      class="input-bordered input w-full max-w-xs"
    />
    <div class="flex justify-end gap-3">
      <button
        type="button"
        class="btn"
        on:click={() => auth.signIn(username, password)}>Sign in</button
      >
      <button
        type="button"
        class="btn-primary btn"
        on:click={() => auth.signUp(username, password)}>Sign up</button
      >
    </div>
    <!--{#if form?.error}-->
    <!--  <div class="text-red-500">{form.error.message}</div>-->
    <!--{/if}-->
  </form>
{/if}

{JSON.stringify($auth)}
