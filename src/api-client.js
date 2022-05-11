import axios from "axios";

const handleResponse = async (response) => {
  const data = response.data;
  if (response.status < 200 || response.status >= 300) {
    console.log("request error with status: ", response.status);
    return Promise.reject(data);
  }

  return data;
};

class API {
  constructor(...args) {
    if (args.length !== 1) {
      throw new Error(
        "Request constructor accepts only one parameter as config object."
      );
    }

    const { baseURL = process.env.REACT_APP_API_URL } = args[0];
    const token = localStorage.getItem("token");

    this.apiClient = axios.create({
      baseURL: baseURL,
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        Accept: "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods":
          "GET, POST, PUT, DELETE, PATCH, OPTIONS",
        "Access-Control-Allow-Headers":
          "Origin, X-Requested-With, Content-Type, Accept, Authorization",
        "Access-Control-Allow-Credentials": "true",
        "Access-Control-Max-Age": "1728000",
        "Access-Control-Expose-Headers": "*",
      },
      // Remove status validation
      validateStatus: (status) => status <= 500,
    });
  }

  _getAuthHeader = (headers = {}) => {
    const token = localStorage.getItem("token");
    return {
      ...headers,
      Authorization: `Bearer ${token}`,
    };
  };

  get = async (url, params, headers = {}) => {
    if (params) {
      url += `${url.includes("?") ? "&" : "?"}${new URLSearchParams(params)}`;
    }
    const response = await this.apiClient.get(url, {
      params: params,
      headers: this._getAuthHeader(headers),
    });
    return handleResponse(response);
  };

  post = async (url, data = {}, headers = {}) => {
    const response = await this.apiClient.post(url, data, {
      headers: this._getAuthHeader(headers),
    });
    return handleResponse(response);
  };

  put = async (url, data = {}, headers = {}) => {
    const response = await this.apiClient.put(url, data, {
      headers: this._getAuthHeader(headers),
    });
    return handleResponse(response);
  };

  del = async (url, headers = {}) => {
    const response = await this.apiClient.delete(url, {
      headers: this._getAuthHeader(headers),
    });
    return handleResponse(response);
  };
}

const apiClient = new API({});

export default apiClient;
export const { get, post, put, del } = apiClient;
