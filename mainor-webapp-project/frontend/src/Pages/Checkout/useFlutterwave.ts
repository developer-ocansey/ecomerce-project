import { useEffect } from 'react';

const useRave = (url: string = 'https://checkout.flutterwave.com/v3.js') => {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = url;
    script.async = true;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, [url]);
};

export default useRave;