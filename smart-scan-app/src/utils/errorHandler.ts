import axios from 'axios';

export interface ApiError {
  code?: string;
  response?: {
    status: number;
    data?: {
      detail?: string;
    };
  };
  message?: string;
}

export const handleApiError = (error: ApiError): string => {
  if (error.code === 'NETWORK_ERROR' || !error.response) {
    return '네트워크 연결을 확인해주세요.';
  }

  if (error.response.status === 401) {
    return '로그인이 필요합니다.';
  }

  if (error.response.status >= 500) {
    return '서버에 문제가 발생했습니다. 잠시 후 다시 시도해주세요.';
  }

  if (error.response.data?.detail) {
    return error.response.data.detail;
  }

  return '요청 처리 중 오류가 발생했습니다.';
};

export const formatAxiosError = (error: any): ApiError => {
  if (axios.isAxiosError(error)) {
    return {
      code: error.code === 'ECONNABORTED' ? 'NETWORK_ERROR' : error.code,
      response: error.response,
      message: error.message,
    };
  }
  return error;
};