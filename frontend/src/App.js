import React, { useCallback, useEffect, useState } from 'react';
import Login from './components/Login';
import { useImmer } from 'use-immer';
import axios from './utils/Axios';
import socket from './utils/SocketIo';
import CallCenter from './components/CallCenter';
import useTokenFromLocalStorage from './hooks/useTokenFromLocalStorage';
import * as Twilio from 'twilio-client';

function App() {
  const [calls, setCalls] = useImmer({
    calls: [],
  });

  const [user, setUser] = useImmer({
    username: '',
    mobileNumber: '',
    verificationCode: '',
    verificationSent: false,
  });
  const [twilioToken, setTwilioToken] = useState();

  const [storedToken, setStoredToken, isValidToken] = useTokenFromLocalStorage(
    null
  );

  useEffect(() => {
    console.log('Twilio token changed');
    if (twilioToken) {
      connectTwilioVoiceClient(twilioToken);
    }
  }, [twilioToken]);

  useEffect(() => {
    if (isValidToken) {
      console.log('Valid token');
      return socket.addToken(storedToken);
    }
    console.log('invalid token');
    socket.removeToken();
  }, [isValidToken, storedToken]);

  useEffect(() => {
    socket.client.on('connect', () => {
      console.log('Connected');
    });
    socket.client.on('disconnect', () => {
      console.log('Socket disconnected');
    });
    socket.client.on('twilio-token', (data) => {
      console.log('Receive Token from the backend');
      setTwilioToken(data.token);
    });
    socket.client.on(
      'call-new',
      useCallback(() => ({ data: { CallSid, CallStatus } }) => {
        console.log('New Call');

        setCalls((draft) => {
          const index = draft.calls.findIndex(
            (call) => call.CallSid === CallSid
          );
          if (index === -1) {
            draft.calls.push({ CallSid, CallStatus });
          }
        });
      })
    );
    socket.client.on('enqueue', ({ data: { CallSid } }) => {
      setCalls((draft) => {
        const index = draft.calls.findIndex(
          ({ CallSid }) => CallSid === CallSid
        );
        if (index === -1) {
          return;
        }
        draft.calls[index].CallStatus = 'enqueue';
      });
    });
    return () => {};
  }, [socket.client]);

  async function sendSmsCode() {
    console.log('Sending SMS');
    await axios.post('/login', {
      to: user.mobileNumber,
      username: user.username,
      channel: 'sms',
    });
    setUser((draft) => {
      draft.verificationSent = true;
    });
  }

  function connectTwilioVoiceClient(twilioToken) {
    const device = new Twilio.Device(twilioToken, { debug: true });
    device.on('error', (error) => {
      console.error(error);
    });
    device.on('incoming', (connection) => {
      console.log('Incoming from twilio');
      connection.accept();
    });
  }

  async function sendVerificationCode() {
    console.log('Sending verification');
    const response = await axios.post('/verify', {
      to: user.mobileNumber,
      code: user.verificationCode,
      username: user.username,
    });
    console.log('received token', response.data.token);
    setStoredToken(response.data.token);
  }

  return (
    <div>
      {isValidToken ? (
        <CallCenter calls={calls} />
      ) : (
        <>
          <CallCenter calls={calls} />
          <Login
            user={user}
            setUser={setUser}
            sendSmsCode={sendSmsCode}
            sendVerificationCode={sendVerificationCode}
          />
        </>
      )}
    </div>
  );
}

export default App;
