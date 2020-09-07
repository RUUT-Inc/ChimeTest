import {
  ConsoleLogger,
  DefaultDeviceController,
  DefaultMeetingSession,
  LogLevel,
  MeetingSessionConfiguration
} from 'amazon-chime-sdk-js';

export const mutations = {
  setMeetingSession(state, payload) {
    state.meetingSession = payload
  },
}

export const actions = {
  async create({commit}, input) {
    const { data } = await this.$http().post('/public/tests', input)

    const logger = new ConsoleLogger('MyLogger', LogLevel.INFO)
    const deviceController = new DefaultDeviceController(logger)

    console.log(data)

    const meetingResponse = data.MeetingResp
    const attendeeResponse = data.AttendeeResp
    const configuration = new MeetingSessionConfiguration(meetingResponse, attendeeResponse)

    console.log(configuration)

    const meetingSession = new DefaultMeetingSession(
      configuration,
      logger,
      deviceController
    )

    return meetingSession

  },
}
