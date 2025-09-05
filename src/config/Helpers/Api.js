import Axios from 'axios';
import {NavService} from '../Helpers/NavService';
import Store from '../../Store';
import {AuthMiddleware} from '../store/Middleware';
import baseUrl from '../Common/index'; 


Axios.interceptors.response.use(
  (response) => {
    return response;
  },
  async ({response, ...rest}) => {
    if (response.status == 401) {
      try {
        let {
          AuthReducer: {
            user: {refreshToken},
          },
        } = Store.getState();
        Store.dispatch(
          AuthMiddleware.RefreshToken({
            refreshToken,
            callback: (token) => {
              rest.config.headers.Authorization = 'Bearer ' + token;
              Axios(rest.config);
            },
          }),
        );
        // });
      } catch (err) {
        console.warn('Error= ===', err);
      }
    }
    return response;
  },
);

export default class ApiCaller {
  static Get = (url = '', customUrl = '', headers = {}) => {
    return Axios.get(customUrl ? customUrl : `${baseUrl}${url}`, {
      headers: {'Content-Type': 'application/json; charset=utf-8', ...headers},
    })
      .then((res) => res)
      .catch((err) => err.response);
  };

  static Post = (endPoint = '', body = {}, headers = {}) => {
    return Axios.post(`${baseUrl}${endPoint}`, body, {
      headers: {'Content-Type': 'application/json', ...headers},
    })
      .then((res) => res)
      .catch((err) => err.response);
  };

  static Put = (url = '', body = {}, headers = {}) => {
    return Axios.put(`${baseUrl}${url}`, body, {
      headers: {'Content-Type': 'application/json', ...headers},
    })
      .then((res) => res)
      .catch((err) => err.response);
  };

  static Delete = (url = '', body = {}, headers = {}) => {
    return Axios.delete(`${baseUrl}${url}`, {
      headers: {'Content-Type': 'application/json', ...headers},
      data: body,
    })
      .then((res) => res)
      .catch((err) => err.response);
  };
}