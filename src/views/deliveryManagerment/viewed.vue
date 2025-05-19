<template>
  <div><Delivery :status="1"/></div>
</template>

<script>
import Delivery from '@/components/delivery'

export default {
  name: 'Viewed',
  components: { Delivery }
}
</script>
