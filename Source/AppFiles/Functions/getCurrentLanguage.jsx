export const getCurrentLanguage = () => {
    return navigator.language.toLowerCase() || navigator.userLanguage.toLowerCase();
};