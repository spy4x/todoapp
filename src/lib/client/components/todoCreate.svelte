<script lang="ts">
  import { todos } from '@stores';
  let title = '';
</script>

<form>
  <div class="form-control">
    <div class="input-group">
      <input
        name="title"
        bind:value={title}
        placeholder="Add todo"
        class="input-bordered input input w-full max-w-xs"
      />
      <button
        on:click|preventDefault={() => {
          todos.create(title);
          title = '';
        }}
        type="submit"
        class="btn-primary btn-square btn"
      >
        <svg
          class="h-5 w-5"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 448 512"
          fill="currentColor"
          ><path
            d="M240 80c0-17.7-14.3-32-32-32s-32 14.3-32 32V224H32c-17.7 0-32 14.3-32 32s14.3 32 32 32H176V432c0 17.7 14.3 32 32 32s32-14.3 32-32V288H384c17.7 0 32-14.3 32-32s-14.3-32-32-32H240V80z"
          /></svg
        >
      </button>
    </div>
  </div>
</form>
