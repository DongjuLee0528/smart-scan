import * as SecureStore from 'expo-secure-store';

const ACCESS_TOKEN_KEY = 'access_token';
const REFRESH_TOKEN_KEY = 'refresh_token';
const USER_ID_KEY = 'user_id';
const USER_EMAIL_KEY = 'user_email';
const USER_NAME_KEY = 'user_name';

export const saveTokens = async (accessToken: string, refreshToken: string): Promise<void> => {
  try {
    await SecureStore.setItemAsync(ACCESS_TOKEN_KEY, String(accessToken));
    await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, String(refreshToken));
  } catch (error) {
    console.error('Failed to save tokens');
    throw new Error('토큰 저장에 실패했습니다.');
  }
};

export const saveUserInfo = async (userId: number, email: string, name: string): Promise<void> => {
  try {
    await SecureStore.setItemAsync(USER_ID_KEY, String(userId));
    await SecureStore.setItemAsync(USER_EMAIL_KEY, email);
    await SecureStore.setItemAsync(USER_NAME_KEY, name);
  } catch (error) {
    console.error('Failed to save user info');
    throw new Error('사용자 정보 저장에 실패했습니다.');
  }
};

export const getUserId = async (): Promise<number | null> => {
  try {
    const userId = await SecureStore.getItemAsync(USER_ID_KEY);
    if (!userId) return null;
    const parsed = parseInt(userId, 10);
    return isNaN(parsed) ? null : parsed;
  } catch (error) {
    console.error('Failed to get user ID');
    return null;
  }
};

export const getUserEmail = async (): Promise<string | null> => {
  try {
    return await SecureStore.getItemAsync(USER_EMAIL_KEY);
  } catch (error) {
    console.error('Failed to get user email');
    return null;
  }
};

export const getUserName = async (): Promise<string | null> => {
  try {
    return await SecureStore.getItemAsync(USER_NAME_KEY);
  } catch (error) {
    console.error('Failed to get user name');
    return null;
  }
};

export const getAccessToken = async (): Promise<string | null> => {
  try {
    return await SecureStore.getItemAsync(ACCESS_TOKEN_KEY);
  } catch (error) {
    console.error('Failed to get access token');
    return null;
  }
};

export const getRefreshToken = async (): Promise<string | null> => {
  try {
    return await SecureStore.getItemAsync(REFRESH_TOKEN_KEY);
  } catch (error) {
    console.error('Failed to get refresh token');
    return null;
  }
};

export const clearTokens = async (): Promise<void> => {
  try {
    await SecureStore.deleteItemAsync(ACCESS_TOKEN_KEY);
    await SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY);
    await SecureStore.deleteItemAsync(USER_ID_KEY);
    await SecureStore.deleteItemAsync(USER_EMAIL_KEY);
    await SecureStore.deleteItemAsync(USER_NAME_KEY);
  } catch (error) {
    console.error('Failed to clear tokens');
    throw new Error('토큰 삭제에 실패했습니다.');
  }
};