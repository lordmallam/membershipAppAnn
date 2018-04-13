import Types from '../actions/types';

const INITIAL_STATE = {
  member: null
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case Types.LOGOUT:
      return INITIAL_STATE;
    default:
      return state;
  }
};