import { useEffect, useState } from 'react';
import useLocalStorage from './useLocalStorage';
import Axios from '../utils/Axios';

function useTokenFromLocalStorage(initialValue) {
  const [value, setValue] = useLocalStorage('token', initialValue);
  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    checkToken();
  }, [value]);

  async function checkToken() {
    const { data } = await Axios.post('/check-token', { token: value });
    console.log('CheckToken', data);
    setIsValid(data.isValid);
  }
  return [value, setValue, isValid];
}

export default useTokenFromLocalStorage;
