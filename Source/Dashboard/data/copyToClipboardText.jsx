import { getCurrentLanguage } from '../AppFiles/Functions/getCurrentLanguage';

export const copyToClipboardText = () => {
    
    switch(getCurrentLanguage()){
        case 'en' : {
            return 'Copy code';
        }

        default : {
            return 'Copy code';
        }
    }
}