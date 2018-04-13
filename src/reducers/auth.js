import Types from '../actions/types';

const INITIAL_STATE = {
  email: '',
  password: '',
  user: null,
  error: '',
  isLoading: false,
  member: null,
  states: [],
  lgas: [],
  isMainLoading: false
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case Types.EMAIL_CHANGED:
      return { ...state, email: action.payload, error: '', isLoading: false };
    case Types.PASSWORD_CHANGED:
      return { ...state, password: action.payload, error: '', isLoading: false };
    case Types.LOGIN_SUCCESS:
      return { ...state, user: action.payload, isLoading: false, error: '' };
    case Types.MEMBER_CHANGED:
      return { ...state, member: action.payload};
    case Types.LOGIN_FAILED:
      return { ...state, error: action.payload, password: '', isLoading: false };
    case Types.LOGIN_STARTED:
      return { ...state, error: '', isLoading: true };
    case Types.IS_LOADING:
      return { ...state, isMainLoading: action.payload };
    case Types.UPDATE_USER:
      return { ...state, user: action.payload };
    case Types.STATES_CHANGED:
      return { ...state, states: action.payload };
    case Types.LGAS_CHANGED:
      return { ...state, lgas: action.payload };
    case Types.LOGOUT:
      return INITIAL_STATE;
    default:
      return state;
  }
};