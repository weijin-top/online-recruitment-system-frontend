<template>
  <div><Delivery :status="0"/></div>
</template>

<script>
import Delivery from '@/components/delivery'

export default {
  name: 'Untreated',
  components: { Delivery }
}
</script>
