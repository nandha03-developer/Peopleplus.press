export function setCookie(response: any, name: any, value: any, options = {}) {
    response.cookies.set(name, value, {
      ...options,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'None',
      httpOnly: true,
      path: '/',
    });
  }
  
  export function getCookie(request: any, name: any) {
    return request.cookies.get(name);
  }
  
  export function deleteCookie(response: any, name: any) {
    response.cookies.delete(name, { path: '/' });
  }
  