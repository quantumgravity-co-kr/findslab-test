import ReactDOM from 'react-dom/client';
import axios from "axios";
import {BrowserRouter} from "react-router-dom";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import Modal from "@/components/atoms/modal";
import Alert from "@/components/atoms/alert";
import Snackbar from "@/components/atoms/snackbar";
import {App} from "@/pages/app";

axios.defaults.baseURL = import.meta.env.PROD ? import.meta.env.VITE_BASE_URL : import.meta.env.VITE_LOCAL_BASE_URL;
axios.defaults.withCredentials = true;

// CSRF 토큰 관리
let csrfToken: string | null = null;
let csrfPromise: Promise<string> | null = null;

const getCsrfToken = async (): Promise<string> => {
  // 이미 토큰이 있으면 반환
  if (csrfToken) {
    return csrfToken;
  }

  // 이미 요청 중이면 같은 Promise 반환
  if (csrfPromise) {
    return csrfPromise;
  }

  // 새로운 CSRF 토큰 요청
  csrfPromise = axios.get('/csrf').then(({ data }) => {
    csrfToken = data?.data;
    csrfPromise = null;
    return csrfToken as string;
  }).catch(error => {
    csrfPromise = null;
    throw error;
  });

  return csrfPromise;
};

axios.interceptors.request.use(
  async (request) => {
    const isUnsafe = ['post', 'put', 'patch', 'delete'].includes((request?.method || '').toLowerCase());
    const isCsrfRequest = request.url === '/csrf';

    // CSRF 요청이 아니고 unsafe 메서드인 경우
    if (!isCsrfRequest && isUnsafe && !request.headers['X-CSRF-TOKEN']) {
      try {
        const token = await getCsrfToken();
        request.headers['X-CSRF-TOKEN'] = token;
      } catch (error) {
        console.error('Failed to get CSRF token:', error);
      }
    }

    return request;
  },
  error => {
    return Promise.reject(error);
  }
);

axios.interceptors.response.use(
  response => {
    return response;
  },
  async error => {
    if (error.response?.status === 409) {
      const {message} = error.response.data;
      alert(message);
    }

    if (error.response.status === 401) {
      // window.location.href = '/login';
    }

    if (error.response?.status === 403 && error.response.data.message === 'Bad CSRF token') {
      const { config } = error;
      const isUnsafe = ['post', 'put', 'patch', 'delete'].includes((config?.method || '').toLowerCase());

      if (isUnsafe && !config._csrfRetry) {
        config._csrfRetry = true;

        // 토큰 초기화 후 재요청
        csrfToken = null;
        csrfPromise = null;

        try {
          const token = await getCsrfToken();
          axios.defaults.headers.common['X-CSRF-TOKEN'] = token;
          config.headers['X-CSRF-TOKEN'] = token;
          return axios(config);
        } catch (err) {
          return Promise.reject(err);
        }
      }
    }

    return Promise.reject(error);
  }
);

const queryClient = new QueryClient({
  defaultOptions: {queries: {refetchOnWindowFocus: false, retryOnMount: true, refetchOnReconnect: false, retry: false}},
});

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <BrowserRouter basename={'/findslab-test'}>
    <QueryClientProvider client={queryClient}>
      <App/>
      <Modal/>
      <Alert/>
      <Snackbar/>
    </QueryClientProvider>
  </BrowserRouter>
);
