  
export const setUser = (str,data) => {
    localStorage.setItem(str,JSON.stringify(data))
};
export const getUser = (str) => {
    return JSON.parse(localStorage.getItem(str))
}
export const removeUser = (data) => {
    localStorage.removeItem(data)
}
