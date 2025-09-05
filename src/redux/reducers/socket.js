const socket = null;

export default function (state = socket, action) {
  switch (action.type) {
    case 'SET_SOCKET':
      return action.payload;
    default:
      return state;
  }
}
