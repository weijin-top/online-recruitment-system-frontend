<template>
  <div><DorpInBox :status="1"/></div>
</template>

<script>
import DorpInBox from '@/components/dorpInBox'

export default {
  name: 'Viewed',
  components:{ DorpInBox }
}
</script>