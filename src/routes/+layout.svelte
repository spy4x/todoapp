<script>
  import '../app.css';
  import { Navbar } from '@components';
</script>

<div class="container relative">
  <Navbar />
  <div data-e2e="page-content" class="h-screen p-6 pt-24">
    <slot />
  </div>
</div>
