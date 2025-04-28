<template>
  <div><DorpInBox :status="0"/></div>
</template>

<script>
import DorpInBox from '@/components/dorpInBox'

export default {
  name: 'NotViewed',
  components:{ DorpInBox }
}
</script>