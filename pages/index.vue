<template>
  <div>
    <div>
      <div class="form-group">
        <label>MEETING ID</label>
        <input type="text" class="form-control" v-model="input.meeting_id">
      </div>
      <div class="form-group">
        <label>USER ID</label>
        <input type="text" class="form-control" v-model="input.user_id">
      </div>
      <button class="btn btn-primary" @click="createMeetingRoom">部屋を作成</button>
    </div>
  </div>
</template>

<script>
export default {
  data(){
    return {
      videoInputDevices: [],
      meetingSession: null,
      input: {
        meeting_id: '',
        user_id: '',
      }
    }
  },
  methods: {
    async createMeetingRoom(){
      const meetingSession = await this.$store.dispatch('meeting/create', this.input)

      //videoデバイスの設定
      this.videoInputDevices = await meetingSession.audioVideo.listVideoInputDevices();
    }
  }
}
</script>
