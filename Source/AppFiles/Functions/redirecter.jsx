import { addonPrefixDashboard } from './addonPrefix';

export const redirector = (route = '#/') => {
    window.location.href = `${addonPrefixDashboard()}#/${route}`;
}