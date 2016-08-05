export const joinChannel = (channel, success, failure, timeout) => {
    channel
        .join()
        .receive("ok", success || joinOk)
        .receive("error", failure || joinError)
        .receive("timeout", timeout || joinTimeout);
    return channel;
}

const joinOk = (response) => console.log('Joined successfully', response);
const joinError = (response) => console.log('Failed to join channel', response);
const joinTimeout = (response) => console.log('Network issue.  Still waiting...');

export const leaveChannel = (channel, callback) => {
    console.log(`leaving ${channel.topic} channel`)
    channel.timeout = 10;
    channel.leave().receive("ok", callback)
}
