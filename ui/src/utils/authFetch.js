
const authFetch = (url, options = {}) => {
  const token = localStorage.getItem("kpt");

  return fetch(url, {
    ...options,
    headers: {
      ...(options.headers || {}),
      //"Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    }
  });
}

export { authFetch };