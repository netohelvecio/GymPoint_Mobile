export function signInRequest(id) {
  return {
    type: '@auth/SIGN_IN_REQUEST',
    payload: { id },
  };
}

export function signInSuccess(id) {
  return {
    type: '@auth/SIGN_IN_SUCCESS',
    payload: { id },
  };
}

export function signFailure(id) {
  return {
    type: '@auth/SIGN_FAILURE',
    payload: { id },
  };
}
