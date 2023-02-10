<script lang="ts">
  import { auth } from '@stores';
  import { goto } from '$app/navigation';

  let username = '';
  let password = '';

  $: if ($auth.user) {
    goto('/');
  }
</script>

<div class="flex h-full items-center justify-center">
  <form class="flex w-80 flex-col gap-3">
    <input
      name="username"
      bind:value={username}
      placeholder="Username"
      class="input-bordered input input w-full max-w-xs"
    />
    <input
      type="password"
      name="password"
      bind:value={password}
      placeholder="Password"
      class="input-bordered input input w-full max-w-xs"
    />
    <div class="flex justify-between gap-3">
      <a href="/sign-up" class="btn-ghost btn">Sign up</a>
      <button
        on:click={() => auth.signIn(username, password)}
        type="button"
        class="btn"
      >
        Sign in
      </button>
    </div>
    <!-- TODO: display error message -->
    <!--{#if form?.error}-->
    <!--  <div class="text-red-500">{form.error.message}</div>-->
    <!--{/if}-->
  </form>
</div>

{JSON.stringify($auth)}
