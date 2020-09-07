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
    <div>
      <audio id="audio-input"></audio>
      <video id="video-preview-0" style="width: 500px; height: 500px"></video>
      <video id="video-preview-1" style="width: 300px; height: 300px"></video>
      <span class="tile"></span>
    </div>
    <div>
      <button @click="mute">mute</button>
      <button @click="video">video</button>
      <button @click="screenShare">screen share</button>
    </div>
  </div>
</template>

<script>
import {mapGetters} from 'vuex'
export default {
  data(){
    return {
      videoInputDevices: [],
      meetingSession: '',
      status: {
        mute: false,
        video: true,
        screenShare: false
      },
      input: {
        meeting_id: '',
        user_id: '',
      }
    }
  },
  methods: {
    async createMeetingRoom(){
      const meetingSession = await this.$store.dispatch('meeting/create', this.input)
      this.meetingSession = meetingSession
      const audioElement = document.getElementById('audio-input')
      meetingSession.audioVideo.bindAudioElement(audioElement);

      //videoデバイスの設定
      this.videoInputDevices = await meetingSession.audioVideo.listVideoInputDevices();
      await meetingSession.audioVideo.chooseVideoInputDevice(this.videoInputDevices[0].deviceId);

      //audioデバイスの設定
      const audioInputDevices = await meetingSession.audioVideo.listAudioInputDevices();
      await meetingSession.audioVideo.chooseAudioInputDevice(audioInputDevices[0].deviceId);

      const observer = {
        videoTileDidUpdate: tileState => {
          const tileIndex = tileState.localTile
            ? 0
            : 1;
          const videoElement = document.getElementById(`video-preview-${tileIndex}`)
          meetingSession.audioVideo.bindVideoElement(tileState.tileId, videoElement);
        },

        contentShareDidStart: () => {
          console.log('Screen share started');
        },
        contentShareDidStop: () => {
          // Chime SDK allows 2 simultaneous content shares per meeting.
          // This method will be invoked if two attendees are already sharing content
          // when you call startContentShareFromScreenCapture or startContentShare.
          console.log('Screen share stopped');
        }
      };

      meetingSession.audioVideo.bindAudioElement(document.getElementById('audio-input'));

      meetingSession.audioVideo.addContentShareObserver(observer);
      meetingSession.audioVideo.addObserver(observer);

      this.meetingSession.audioVideo.startLocalVideoTile()

      meetingSession.audioVideo.start();
    },

    mute(){
      if(this.status.mute){
        this.meetingSession.audioVideo.realtimeUnmuteLocalAudio()
      }else{
        this.meetingSession.audioVideo.realtimeMuteLocalAudio()
      }
      this.status.mute = ! this.status.mute
    },

    async video(){
      await this.meetingSession.audioVideo.chooseVideoInputDevice(this.videoInputDevices[0].deviceId)
      if(this.status.video){
        this.meetingSession.audioVideo.stopLocalVideoTile()
      }else{
        this.meetingSession.audioVideo.startLocalVideoTile()
      }
      this.status.video = ! this.status.video
    },

    screenShare(){
      console.log("screen share")
      if(! this.status.screenShare){
        this.meetingSession.audioVideo.startContentShareFromScreenCapture()
      }else{
        this.meetingSession.audioVideo.stopContentShare()
      }
      this.status.screenShare = ! this.status.screenShare
    },
  }
}
</script>
