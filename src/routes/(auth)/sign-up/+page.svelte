<script lang="ts">
  import { auth } from '@stores';
  import { goto } from '$app/navigation';

  let username = '';
  let photoURL = '';
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
      placeholder="Username *"
      class="input-bordered input input w-full max-w-xs"
    />
    <div class="flex gap-3">
      <input
        name="photoURL"
        bind:value={photoURL}
        placeholder="URL for your profile picture"
        class="input-bordered input input w-full max-w-xs"
      />
      <div class="avatar">
        <div class="h-12 w-12 rounded-full border border-neutral">
          <img src={photoURL || '/img/user.svg'} alt="User avatar" />
        </div>
      </div>
    </div>

    <input
      type="password"
      name="password"
      bind:value={password}
      placeholder="Password *"
      class="input-bordered input input w-full max-w-xs"
    />
    <div class="flex justify-between gap-3">
      <a href="/sign-in" class="btn-ghost btn">Sign in</a>
      <button
        on:click|preventDefault={() =>
          auth.signUp(username, password, photoURL)}
        type="submit"
        class="btn-primary btn"
      >
        Sign up
      </button>
    </div>
    <!-- TODO: display error message -->
    <!--{#if form?.error}-->
    <!--  <div class="text-red-500">{form.error.message}</div>-->
    <!--{/if}-->
  </form>
</div>
