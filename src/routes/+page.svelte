<script lang="ts">
  import { TodoList, UserList } from '@components';
  import { auth } from '@stores';

  $: editable = !!$auth.user;
</script>

<div class="flex flex-col justify-between gap-12 md:flex-row">
  <div><TodoList {editable} /></div>
  <div><UserList /></div>
</div>
