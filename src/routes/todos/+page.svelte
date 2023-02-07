<script lang="ts">
  import type { PageData } from "./$types";

  export let data: PageData;
</script>
TODOS:
{JSON.stringify(data.todos, null, 2)}