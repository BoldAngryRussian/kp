
const authFetch = async (url, options = {}) => {
  const token = localStorage.getItem("kpt");
  const response = await fetch(url, {
    ...options,
    headers: {
      ...(options.headers || {}),
      "Authorization": `Bearer ${token}`
    }
  });

  if (response.status === 401 || response.status === 403) {
    // Токен просрочен или недействителен
    console.warn("❌ Токен истёк — перенаправляем на /login");
    localStorage.removeItem("kpt"); // очищаем токен
    window.location.href = "/authentication/sign-in";
    return; // можно вернуть null или бросить исключение
  }

  return response;
}

export { authFetch };