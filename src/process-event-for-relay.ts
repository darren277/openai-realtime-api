export function processEventForRelay(userId: string, event: any) {
    //const RELAY_CATCH_URL = 'https://localhost:3000/api/v1/relay'
    const RELAY_CATCH_URL = 'http://localhost:8991/relay_catch_url'

    console.log("THIS USER ID", userId)

    let loggableEvent: any;

    if (event.type === 'response.audio.delta') {
      // truncate event.delta to 20 characters...
      const delta = event.delta.slice(0, 20)

      loggableEvent = {
        ...event,
        delta,
      }
    } else {
      loggableEvent = {
        ...event,
      }
    }

    //const res = axios.post('http://localhost:8991/log_catcher_relay', {event})
    // use fetch
    fetch('http://localhost:8991/log_catcher_relay', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({loggableEvent}),
    }).then((res) => {
      console.log("DEBUG: res =", res.status, res.body)
    }).catch((err) => {
      console.error("DEBUG: error =", err)
    })

    //if (event.type === 'conversation.item.input_audio_transcription.completed') {const transcript = event.item.content[0].text}
    if (event.type === 'conversation.item.input_audio_transcription.completed' as string) {
      console.log("EVENT!!!!!!!!!!!!!!!!!!!!!!!!!!!", event)
      const transcript = event.transcript;
      console.log("\n");
      console.log('INPUT AUDIO TRANSCRIPTION')
      console.log('Transcript:', transcript)
      console.log('-------------------------')
      console.log("\n");

      //const res = axios.post('https://localhost:3000/api/v1/relay', {userId: this.userId, eventType: 'conversation.item.input_audio_transcription.completed', transcript})
      fetch(RELAY_CATCH_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({userId, eventType: 'conversation.item.input_audio_transcription.completed', transcript}),
      }).then((res) => {
        console.log("DEBUG: res =", res.status, res.body)
      }).catch((err) => {
        console.error("DEBUG: error =", err)
      })
    } else if (event.type === 'response.done' as string) {
      const transcript = event.response.output[0].content[0].transcript;
      const usage = event.response.usage;
      const inputTokenDetails = usage.input_token_details;
      const outputTokenDetails = usage.output_token_details;

      console.log("\n");
      console.log('RESPONSE DONE')
      console.log('Transcript:', transcript);
      console.log('Input Token Details:', inputTokenDetails);
      console.log('Output Token Details:', outputTokenDetails);
      console.log('-------------------------')
      console.log("\n");

      //const res = axios.post('https://localhost:3000/api/v1/relay', {userId: this.userId, eventType: 'response.done', transcript, inputTokenDetails, outputTokenDetails})
      fetch(RELAY_CATCH_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({userId, eventType: 'response.done', transcript, inputTokenDetails, outputTokenDetails}),
      }).then((res) => {
        console.log("DEBUG: res =", res.status, res.body)
      }).catch((err) => {
        console.error("DEBUG: error =", err)
      })
    }
}
