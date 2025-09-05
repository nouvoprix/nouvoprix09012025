const INITIAL_STATES = {
  userData: null,
  userToken: '',
  productOffer:null,
  unreadChatsCount: 0
  // userProfile: '',
  // userProducts: '',
  // productTerms: '',
  // productPolicy:''
};

export default function (state = INITIAL_STATES, action) {
  switch (action.type) {
    case 'SAVE_TERMS':
      return {
        ...state,
        productTerms: action.payload
      }
    case 'SAVE_POLICY':
      return {
        ...state,
        productPolicy: action.payload
      }
    case 'SAVE_PRODUCTS':
      return {
        ...state,
        userProducts: action.payload
      }
    case 'SAVE_PROFILE':
      return {
        ...state,
        userProfile: action.payload
      }
    case 'SAVE_USER':
      return {
        ...state,
        userData: action.payload,
      };
      case 'PRODUCTOFFER':
        return {
          ...state,
          productOffer: action.payload,
        };
    case 'SET_UNREAD_CHATS_COUNT':
      return {
        ...state,
        unreadChatsCount: action.payload,
      };
    case 'SAVE_TOKEN':
      return {
        ...state,
        userToken: action.payload,
      };
    case 'LOGOUT':
      return INITIAL_STATES;
    default:
      return state;
  }
}
