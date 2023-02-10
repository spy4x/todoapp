<script lang="ts">
  import { auth } from '@stores';
</script>

<div class="navbar absolute border-b border-b-info">
  <div class="flex-1">
    <a href="/" class="btn-ghost btn text-xl normal-case">Todoapp</a>
  </div>
  <div class="flex-none">
    {#if $auth.user}
      <div class="dropdown-end dropdown">
        <label tabindex="0" class="btn-ghost btn-circle avatar btn">
          <div class="w-10 rounded-full border border-neutral">
            <img
              src={$auth.user.photoURL || '/img/user.svg'}
              alt="User avatar"
            />
          </div>
        </label>

        <ul
          tabindex="0"
          class="dropdown-content menu rounded-box menu-compact mt-3 w-52 bg-base-100 p-2 shadow"
        >
          <li>
            <a href="profile" class="justify-between">Profile</a>
          </li>
          <li><a href="javascript:;" on:click={auth.signOut}>Sign out</a></li>
        </ul>
      </div>
    {:else}
      <a class="btn-ghost btn" href="/sign-in">Sign in</a>
      <a class="btn-ghost btn" href="/sign-up">Sign up</a>
    {/if}
  </div>
</div>
